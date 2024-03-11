import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChildren,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	Renderer2,
	SimpleChanges,
	ViewChild,
	ViewChildren,
	ViewEncapsulation,
	TemplateRef,
	ContentChild
} from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
	MatColumnDef,
	MatTable,
	MatTableDataSource
} from "@angular/material/table";
import { SelectionChange, SelectionModel } from "@angular/cdk/collections";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { Subscription } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

import { StarkTableColumnComponent } from "./column.component";
import { StarkSortingRule, StarkTableMultisortDialogComponent, StarkTableMultisortDialogData } from "./dialogs/multisort.component";
import { StarkAction, StarkActionBarConfig } from "@nationalbankbelgium/stark-ui/src/modules/action-bar";
import {
	StarkColumnCellClickedOutput,
	StarkColumnFilterChangedOutput,
	StarkColumnSortChangedOutput,
	StarkTableColumnFilter,
	StarkTableColumnProperties,
	StarkTableColumnSortingDirection,
	StarkTableFilter,
	StarkTableRowActions
} from "../entities";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";
import { StarkPaginateEvent, StarkPaginationComponent, StarkPaginationConfig } from "@nationalbankbelgium/stark-ui/src/modules/pagination";
import { StarkMinimapComponentMode, StarkMinimapItemProperties } from "@nationalbankbelgium/stark-ui/src/modules/minimap";
import find from "lodash-es/find";
import findIndex from "lodash-es/findIndex";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { StarkTableExpandDetailDirective } from "../directives/table-expand-detail.directive";
import { StarkTableRowContentDirective } from "../directives/table-row-content.directive";

/**
 * @ignore
 */
const componentName = "stark-table";

/**
 * Default filter {@link StarkTableFilter} configuration
 */
const defaultFilter: StarkTableFilter = {
	globalFilterPresent: true,
	filterPosition: "below"
};

/**
 * The default values set for {@link StarkTableColumnProperties}
 */
const DEFAULT_COLUMN_PROPERTIES: Partial<StarkTableColumnProperties> = {
	isFilterable: true,
	isSortable: true,
	isVisible: true
};

// FIXME: refactor the template of this component function to reduce its cyclomatic complexity
/* eslint-disable @angular-eslint/template/cyclomatic-complexity */
/**
 * Component to display array data in a table layout.
 */
@Component({
	selector: "stark-table",
	templateUrl: "./table.component.html",
	encapsulation: ViewEncapsulation.None,
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	changeDetection: ChangeDetectionStrategy.Default,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	},
	animations: [
		trigger("detailExpand", [
			state("collapsed", style({ height: "0px", minHeight: "0", display: "none" })),
			state("expanded", style({ height: "*" })),
			transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
		])
	]
})
export class StarkTableComponent extends AbstractStarkUiComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	/**
	 * Array of {@link StarkTableColumnProperties} objects which define the columns of the data table.
	 */
	@Input()
	public set columnProperties(input: StarkTableColumnProperties[]) {
		this.isFooterEnabled =
			findIndex(
				input || [],
				(column: StarkTableColumnProperties) => typeof column.footerValue !== "undefined" && column.footerValue !== ""
			) > -1;

		this._columnProperties = (input || []).map((properties: StarkTableColumnProperties) => ({
			...DEFAULT_COLUMN_PROPERTIES,
			...properties,
			footerValue: this.isFooterEnabled ? properties.footerValue || "" : undefined
		}));

		if (this.dataSource) {
			this.cdRef.detectChanges();

			this.updateTableColumns();

			if (this.isArrayFilled(this.orderProperties)) {
				this.sortData();
			}
		}
	}

	public get columnProperties(): StarkTableColumnProperties[] {
		return this._columnProperties;
	}

	/**
	 * Return the array of {@link StarkMinimapItemProperties} to be displayed display in the table minimap component
	 */
	public get _minimapItemProperties(): StarkMinimapItemProperties[] {
		return this.columnProperties.map(({ name, label }: StarkTableColumnProperties) => ({
			name,
			label: label || name
		}));
	}

	/**
	 * Return the items to be shown as "visible" in the table minimap component
	 */
	public get _visibleMinimapItems(): string[] {
		return this.columnProperties
			.filter(({ isVisible }: StarkTableColumnProperties) => !!isVisible)
			.map(({ name }: StarkTableColumnProperties) => name);
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _columnProperties: StarkTableColumnProperties[] = [];

	/**
	 * Array of {@link StarkAction} objects.
	 */
	@Input()
	public customTableActions?: StarkAction[];

	/**
	 * Mode in which the custom actions will be displayed in the table
	 */
	@Input()
	public customTableActionsType: "regular" | "alt" = "regular";

	/**
	 * Data that will be display inside your table.
	 */
	@Input()
	public data: object[] = [];

	public static ngAcceptInputType_data: object[] | undefined | null;

	/**
	 * Object which contains filtering information for the table.
	 */
	@Input()
	public get filter(): StarkTableFilter {
		return this._filter;
	}

	public set filter(value: StarkTableFilter) {
		this._filter = { ...defaultFilter, ...value };
	}

	public static ngAcceptInputType_filter: StarkTableFilter | undefined;

	/**
	 * @ignore
	 * @internal
	 */
	private _filter: StarkTableFilter = defaultFilter;

	/**
	 * Allows to fix the header to the top of the scrolling viewport containing the table.
	 * Setting the attribute to `true` or empty will enable this feature.
	 *
	 * The class `fixed-header` will be added under `.stark-table` which defines the following CSS properties:
	 * - `overflow-y: auto;`
	 * - `height: 400px;`
	 *
	 * If you need to change the height, please redefine the value for `.stark-table .fixed-header { height: 400px; }`
	 */
	@Input()
	public set fixedHeader(value: boolean) {
		this.isFixedHeaderEnabled = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_fixedHeader: BooleanInput;

	/**
	 * HTML id of the table
	 */
	@Input()
	public htmlId?: string;

	/**
	 * Determine if you can select the rows in the table
	 * @deprecated  - use {@link selection} instead
	 */
	@Input()
	public rowsSelectable?: boolean;

	/**
	 * Allows multiple row selection. Setting the attribute to "true" or empty will enable this feature.
	 * @deprecated - use {@link selection} instead
	 */
	@Input()
	public multiSelect?: string;

	/**
	 * Allows sorting by multiple columns. Setting the attribute to "true" or empty will enable this feature.
	 */
	@Input()
	public set multiSort(value: boolean) {
		this.isMultiSortEnabled = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_multiSort: BooleanInput;

	/**
	 * Columns to be sorted by default
	 */
	@Input()
	public orderProperties?: string[];

	/**
	 * Whether to display the pagination component
	 */
	@Input()
	public paginate = false;

	/**
	 * Shows or hides the {@link StarkMinimapComponent} in the header. When set to 'compact' it shows the compacted minimap
	 */
	@Input()
	public minimap: boolean | StarkMinimapComponentMode = true;

	/**
	 * {@link StarkPaginationConfig} object for the embedded {@link StarkPaginationComponent}
	 *
	 * **IMPORTANT:** the pagination component is displayed in "compact" mode
	 */
	@Input()
	public paginationConfig: StarkPaginationConfig = {};

	/**
	 * Determine if the item counter is enabled. Shows how many items are in the data object array.
	 *
	 * Default: `false`
	 */
	@Input()
	public get showRowsCounter(): boolean {
		return this._showRowsCounter;
	}

	public set showRowsCounter(value: boolean) {
		this._showRowsCounter = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_showRowsCounter: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _showRowsCounter = false;

	/**
	 * {@link StarkActionBarConfig} object for the {@link StarkActionBarComponent} to be displayed in all the rows
	 */
	@Input()
	public tableRowActions: StarkTableRowActions = { actions: [] };

	/**
	 * Active row that should be collapsed
	 */
	@Input()
	public expandedRows: object[] = [];

	/**
	 * An {@link StarkActionBarConfig} object defining the different actions to be shown in each row of the table
	 * @deprecated - use {@link tableRowActions} instead
	 */
	@Input()
	public set tableRowsActionBarConfig(config: StarkActionBarConfig) {
		this.logger.warn("[tableRowsActionBarConfig] attribute on <stark-table> is deprecated. Use [tableRowActions] instead.");
		this.tableRowActions = <StarkTableRowActions>config;
	}

	/**
	 * Function to generate classNames for rows
	 */
	@Input()
	public rowClassNameFn?: (row: object, index: number) => string;

	/* eslint-disable jsdoc/require-param */
	/**
	 * Function to see if a row is collapsed
	 */
	@Input()
	public expandedRowFn: (expandedRow: object, row: object) => boolean = (expandedRow: object, row: object): boolean =>
		expandedRow === row;
	/* eslint-enable jsdoc/require-param */

	/**
	 * Angular CDK selection model used for the "master" selection of the table
	 */
	@Input()
	public get selection(): SelectionModel<object> {
		return this._selection;
	}

	public set selection(selection: SelectionModel<object>) {
		// eslint-disable-next-line import/no-deprecated
		if (coerceBooleanProperty(this.multiSelect) || !!this.rowsSelectable) {
			this.logger.error(
				`${componentName}: 'selection' cannot be used with 'multiSelect' and/or 'rowsSelectable'. Please use 'selection' only.`
			);
		}

		if (selection) {
			this._managedSelection = true;

			if (!this.displayedColumns.includes("select")) {
				this.displayedColumns.unshift("select");
			}

			this._selection = selection;
			this._resetSelection();
		} else if (this._selection) {
			this._managedSelection = false;
			const i: number = this.displayedColumns.indexOf("select");
			this.displayedColumns.splice(i);

			this._resetSelection(true);
		}
	}

	/**
	 * @ignore
	 */
	private _selection!: SelectionModel<object>;

	/**
	 * Determine if the row index must be present or not.
	 *
	 * Default: `false`
	 */
	@Input()
	public get showRowIndex(): boolean {
		return this._showRowIndex;
	}

	public set showRowIndex(value: boolean) {
		this._showRowIndex = coerceBooleanProperty(value);

		if (this._showRowIndex) {
			if (!this.displayedColumns.includes("rowIndex")) {
				this.displayedColumns.unshift("rowIndex");
			}
		} else {
			const i: number = this.displayedColumns.indexOf("rowIndex");
			this.displayedColumns.splice(i);
		}
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_showRowIndex: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _showRowIndex = false;

	/**
	 * Output event emitter that will emit the latest filter value whenever it changes.
	 */
	@Output()
	public readonly filterChanged = new EventEmitter<StarkTableFilter>();

	/**
	 * Callback function to be called when the pagination changes. Two parameters
	 * will be passed to the callback function:
	 *        -- page (number)
	 *        -- itemsPerPage (number)
	 *
	 * When you declare it in html tags you have to declare it like 'on-paginate="yourFunction(page,itemsPerPage)"'
	 * If no callback function is passed, the data will be paginated automatically by the component.
	 *
	 * When set onPaginate, these attributes are required : totalItems
	 */
	@Output()
	public readonly paginationChanged = new EventEmitter<StarkPaginateEvent>();

	/**
	 * Output event emitter that will emit the array of selected rows.
	 * @deprecated - use {@link selection} instead
	 */
	@Output()
	public readonly selectChanged = new EventEmitter<object[]>();

	/**
	 * Output event emitter that will emit the data of a row when it is clicked.
	 * If there are no observers it will not emit, but instead select the row.
	 */
	@Output()
	public readonly rowClicked = new EventEmitter<object>();

	/**
	 * Reference to the MatTable embedded in this component
	 */
	@ViewChild(MatTable, { static: true })
	public table!: MatTable<object>;

	/**
	 * Reference to the MatPaginator embedded in this component
	 */
	@ViewChild(StarkPaginationComponent, { static: false })
	public starkPaginator!: StarkPaginationComponent;

	/**
	 * Columns added automatically by this component according to the `columnProperties` input
	 */
	@ViewChildren(StarkTableColumnComponent)
	public viewColumns!: QueryList<StarkTableColumnComponent>;

	/**
	 * Columns added by the user via transclusion inside an <div> element with class "stark-table-columns"
	 */
	@ContentChildren(StarkTableColumnComponent)
	public contentColumns!: QueryList<StarkTableColumnComponent>;

	@ContentChild(StarkTableExpandDetailDirective, { static: false, read: TemplateRef })
	public expandedDetailTemplate!: StarkTableExpandDetailDirective;

	@ContentChild(StarkTableRowContentDirective, { static: false, read: TemplateRef })
	public customRowTemplate!: StarkTableRowContentDirective;

	/**
	 * Array of StarkTableColumnComponents defined in this table
	 */
	public columns: StarkTableColumnComponent[] = [];

	/**
	 * Array of StarkAction for alt mode
	 */
	public customTableAltActions?: StarkAction[];

	/**
	 * {@link StarkActionBarConfig} object for the {@link StarkActionBarComponent} in regular mode
	 */
	public customTableRegularActions: StarkActionBarConfig = { actions: [] };

	/**
	 * MatTableDataSource associated to the MatTable embedded in this component
	 */
	public dataSource!: MatTableDataSource<object>;

	/**
	 * Array of columns (column id's) to be displayed in the table.
	 */
	public displayedColumns: string[] = [];

	/**
	 * @ignore
	 */
	public _globalFilterFormCtrl = new UntypedFormControl();

	/**
	 * Whether the fixed header is enabled.
	 */
	public isFixedHeaderEnabled = false;

	/**
	 * Whether the footer is enabled.
	 *
	 * Default: if there is no footer defined here and in any other column, then it won't be displayed.
	 * Otherwise, if at least one of the other columns defines a footer,
	 * then the footer of this column will be displayed as empty
	 */
	public isFooterEnabled = false;

	/**
	 * Whether the current sorting is done on multiple columns
	 */
	public isMultiSorting = false;

	/**
	 * Whether the sorting by multiple columns is enabled.
	 */
	public isMultiSortEnabled = false;

	/**
	 * @ignore
	 */
	private _selectionSub!: Subscription;

	/**
	 * @ignore
	 */
	private _managedSelection = false;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param dialogService - Angular Material service to open Material Design modal dialogs.
	 * @param cdRef - Reference to the change detector attached to this component
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		public dialogService: MatDialog,
		private cdRef: ChangeDetectorRef,
		renderer: Renderer2,
		elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();

		this._resetSelection();
		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Component lifecycle hook
	 */
	public ngAfterViewInit(): void {
		this.logger.debug(componentName + ": ngAfterViewInit");

		this.updateTableColumns();

		this.initializeDataSource();

		if (this.isArrayFilled(this.orderProperties)) {
			this.sortData();
		}

		this._globalFilterFormCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((value?: string | null) => {
			// eslint-disable-next-line no-null/no-null
			this.filter.globalFilterValue = value === null ? undefined : value;
			this.filterChanged.emit(this.filter);

			if (value) {
				this.dataSource.filter = value.trim().toLowerCase();
			} else {
				this.dataSource.filter = "%empty%";
			}

			this.applyFilter();
		});

		this.cdRef.detectChanges();
	}

	/**
	 * Component lifecycle hook
	 * @param changes - Contains the changed properties
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	public ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]) {
			this.data = this.data || [];

			if (!changes["data"].isFirstChange()) {
				if (this.resetFilterValueOnDataChange()) {
					this.filterChanged.emit(this.filter);
					this.applyFilter();
				}

				if (this.isArrayFilled(this.orderProperties)) {
					this.sortData();
				} else {
					this.dataSource.data = [...this.data];
				}

				this.paginationConfig = {
					...this.paginationConfig,
					totalItems: this.dataSource.filteredData.length
				};
			}
		}

		if (changes["orderProperties"] && !changes["orderProperties"].isFirstChange()) {
			this.sortData();
		}

		if (changes["filter"]) {
			this.filter = { ...defaultFilter, ...this.filter };
			this._globalFilterFormCtrl.setValue(this.filter.globalFilterValue);
		}

		/* eslint-disable import/no-deprecated */
		if (changes["rowsSelectable"]) {
			if (this._managedSelection) {
				this.logger.error(
					`${componentName}: 'selection' cannot be used with 'multiSelect' and/or 'rowsSelectable'. Please use 'selection' only.`
				);
			} else if (this.rowsSelectable) {
				if (!this.displayedColumns.includes("select")) {
					this.displayedColumns.unshift("select");
				}
			} else {
				const i: number = this.displayedColumns.indexOf("select");
				this.displayedColumns.splice(i);
			}
		}
		/* eslint-enable import/no-deprecated */

		if (changes["multiSelect"] && !changes["multiSelect"].isFirstChange()) {
			if (this._managedSelection) {
				this.logger.error(
					`${componentName}: 'selection' cannot be used with 'multiSelect' and/or 'rowsSelectable'. Please use 'selection' only.`
				);
			} else {
				this._resetSelection(true);
			}
		}

		if (changes["customTableActionsType"] || changes["customTableActions"]) {
			if (this.customTableActionsType === "regular") {
				this.customTableRegularActions = { actions: this.customTableActions || [] };
			} else {
				this.customTableRegularActions = { actions: [] };
				this.customTableAltActions = this.customTableActions;
			}
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		this._selectionSub.unsubscribe();
	}

	/**
	 * Remove the columns that were previously defined
	 */
	private removeOldColumnsFromTable(): void {
		// this.table._contentColumnDefs.toArray() contains the column definitions provided by the user

		// using the internal prop from mat-table to get the custom column definitions (no other way for now)
		const oldColumns: Set<MatColumnDef> = this.table["_customColumnDefs"];
		oldColumns.forEach((oldColumn: MatColumnDef) => {
			this.table.removeColumnDef(oldColumn);
			// removing column also from the displayed columns (such array should match the dataSource!)
			this.displayedColumns.splice(
				this.displayedColumns.findIndex((column: string) => column === oldColumn.name),
				1
			);
		});
	}

	/**
	 * Add the new columns defined
	 * @param columns - The columns to be added
	 */
	private addColumnsToTable(columns: StarkTableColumnComponent[]): void {
		for (const column of columns) {
			this.table.addColumnDef(column.columnDef);

			const columnProperties = find(
				this.columnProperties,
				(columnProps: StarkTableColumnProperties) => column.name === columnProps.name
			);

			if (this.isColumnPropertiesWithOnClickCallback(columnProperties)) {
				column.cellClicked.subscribe((cellClickedOutput: StarkColumnCellClickedOutput) => {
					columnProperties.onClickCallback(cellClickedOutput.value, cellClickedOutput.row, cellClickedOutput.columnName);
				});
			}

			column.sortChanged.subscribe((sortedColumn: StarkColumnSortChangedOutput) => {
				this.onReorderChange(sortedColumn);
			});
			column.filterChanged.subscribe((filteredColumn: StarkColumnFilterChangedOutput) => {
				this.onColumnFilterChange(filteredColumn.name, filteredColumn.filterValue);
				this.applyFilter();
			});
			this.displayedColumns = [...this.displayedColumns, column.name];
		}
	}

	/**
	 * Trigger the filtering of the MatTableDataSource used by the MatTable
	 */
	public applyFilter(): void {
		this.dataSource.filter = "" + this.dataSource.filter;
		this.paginationConfig = { ...this.paginationConfig, totalItems: this.dataSource.filteredData.length };
	}

	/**
	 * Selects all rows if they are not all selected; otherwise clear selection.
	 */
	public masterToggle(): void {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			for (const row of this.dataSource.filteredData) {
				this.selection.select(row);
			}
		}
	}

	/**
	 * Create and initialize the MatTableDataSource used by the MatTable
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	private initializeDataSource(): void {
		this.dataSource = new MatTableDataSource(this.data);
		this.paginationConfig = {
			...this.paginationConfig,
			totalItems: this.dataSource.filteredData.length
		};

		// if there are observers subscribed to the StarkPagination event, it means that the developer will take care of the pagination
		// so we just re-emit the event from the Stark Pagination component (online mode)
		if (this.paginationChanged.observers.length > 0) {
			this.starkPaginator.paginated.subscribe((paginateEvent: StarkPaginateEvent) => {
				this.paginationChanged.emit(paginateEvent);
			});
		} else {
			// if there are no observers, then the data will be paginated internally in the MatTable via the Stark paginator event (offline mode)
			this.dataSource.paginator = this.starkPaginator;
		}

		this.starkPaginator.emitMatPaginationEvent();

		this.dataSource.filterPredicate = (rowData: object, globalFilter: string): boolean => {
			const matchFilter: boolean[] = [];

			if (globalFilter !== "%empty%") {
				// initially we take all the filter criteria as "unmet" criteria
				let unmetFilterCriteria: RegExp[] = this.getNormalizedFilterCriteria(globalFilter);

				for (const column of this.columns) {
					const displayedValue: string = column.getDisplayedValue(rowData).toString();
					// recalculate the "unmet" criteria again based on the remaining "unmet" criteria from the previous iteration
					unmetFilterCriteria = this.getUnmetFilterCriteria(displayedValue, unmetFilterCriteria);
				}

				matchFilter.push(unmetFilterCriteria.length === 0);
			}

			for (const column of this.columns) {
				if (column.filterValue) {
					const displayedValue: string = column.getDisplayedValue(rowData).toString();
					const filterCriteria: RegExp[] = this.getNormalizedFilterCriteria(column.filterValue);

					matchFilter.push(this.getUnmetFilterCriteria(displayedValue, filterCriteria).length === 0);
				}
			}

			return !matchFilter.length || matchFilter.every(Boolean);
		};

		if (this.filter.globalFilterValue && this.filter.globalFilterValue !== "") {
			this.dataSource.filter = this.filter.globalFilterValue;
		} else {
			this.dataSource.filter = "%empty%";
		}
	}

	/**
	 * Update columns of the Mat-Table component based on columnProperties.
	 */
	public updateTableColumns(): void {
		// add the columns the developer defined with the <stark-table-column>
		this.columns = [...this.viewColumns.toArray(), ...this.contentColumns.toArray()];

		this.removeOldColumnsFromTable();
		this.addColumnsToTable(this.columns);
	}

	/**
	 * Return the filter criteria that the item does not meet
	 * @param item - The item to filter
	 * @param filterCriteria - The criteria that should be met by the item
	 */
	public getUnmetFilterCriteria(item: object | string, filterCriteria: RegExp[]): RegExp[] {
		let itemStr: string;

		if (item && typeof item === "object") {
			itemStr = JSON.stringify(item);
		} else {
			itemStr = item;
		}

		return filterCriteria.filter(
			(criteria: RegExp) => !criteria.test(itemStr) // the item does not fulfill the given criteria
		);
	}

	/**
	 * Normalize the given filter value into a more complex filter criteria supporting wildcards
	 * @param filterValue - The original filter value
	 * @returns An array containing more complex regex based on the original filter value supporting wildcards
	 */
	public getNormalizedFilterCriteria(filterValue: string): RegExp[] {
		const filter: string = filterValue
			.replace(/\\(?=\*)\*/g, "<stark_char_star>") // string "\*" (escaped *)
			.replace(/\\(?=\?)\?/g, "<stark_char_quot>") // string "\?" (escaped ?)
			.replace(/\\/g, "<stark_char_backsl>") // character "\"
			.replace(/[*?[\]()$+^]/g, (match: string) => {
				// replace chars "*", "?", "[", "]", "(", ")", "$", "+", "^"
				if (match === "*") {
					return "\\S*"; // wildcard "*"
				} else if (match === "?") {
					return "\\S{1}"; // wildcard "?"
				}

				return "\\" + match; // add trailing "\" to escape the character
			})
			.replace("<stark_char_star>", "\\*")
			.replace("<stark_char_quot>", "\\?")
			.replace("<stark_char_backsl>", "\\\\");

		return filter.split(" ").map((filterStr: string) => new RegExp(filterStr, "i"));
	}

	/**
	 * Return whether the number of selected elements matches the total number of rows.
	 */
	public isAllSelected(): boolean {
		const numSelected: number = this.selection.selected.length;
		const numRows: number = this.data.length;
		return numSelected === numRows;
	}

	/**
	 * Called when the Clear button in the filter pop-up is clicked
	 */
	public onClearFilter(): void {
		this._globalFilterFormCtrl.reset();
	}

	/**
	 * Called whenever the value of the filter input of a column changes
	 * @param columnName - The column whose filter input has changed
	 * @param filterValue - The new value set to the filter input
	 */
	public onColumnFilterChange(columnName: string, filterValue?: string): void {
		if (typeof this.filter.columns !== "undefined") {
			for (const columnFilter of this.filter.columns) {
				if (columnFilter.columnName === columnName) {
					columnFilter.filterValue = filterValue;
					break;
				}
			}

			this.filterChanged.emit(this.filter);
		}
	}

	/**
	 * Called whenever the sorting of any of the columns changes
	 * @param column - The column whose sorting has changed
	 */
	public onReorderChange(column: StarkColumnSortChangedOutput): void {
		if (column.sortable) {
			this.resetSorting(column);
			const sortedColumn = find(this.columns, { name: column.name });
			if (sortedColumn) {
				sortedColumn.sortPriority = 1;
				switch (column.sortDirection) {
					case "asc":
						sortedColumn.sortDirection = "desc";
						break;
					case "desc":
						sortedColumn.sortDirection = "";
						break;
					default:
						sortedColumn.sortDirection = "asc";
						break;
				}
			}
			this.sortData();
		}
	}

	/**
	 * Open the multi-sort dialog to configure the multi-column sorting of the data
	 */
	public openMultiSortDialog(): void {
		const dialogRef: MatDialogRef<StarkTableMultisortDialogComponent, StarkSortingRule[]> = this.dialogService.open<
			StarkTableMultisortDialogComponent,
			StarkTableMultisortDialogData
		>(StarkTableMultisortDialogComponent, {
			panelClass: "stark-table-dialog-multisort-panel-class", // the width is set via CSS using this class
			data: { columns: this.columns.filter((column: StarkTableColumnComponent) => column.sortable) }
		});

		dialogRef.afterClosed().subscribe((savedRules: StarkSortingRule[] | undefined) => {
			// re-calculate the orderProperties with the sorting defined in the dialog
			if (savedRules) {
				const newOrderProperties: string[] = [];

				// IMPORTANT: the rules should be ordered by priority because the priority passed to the columns by getColumnSortingPriority()
				// is calculated based on the order in which the columns appear in the "orderProperties"
				const orderedRulesByPriority = savedRules
					// we only care about the columns that are really sorted, the rest should be discarded
					.filter((rule: StarkSortingRule) => rule.sortDirection !== "")
					.sort((rule1: StarkSortingRule, rule2: StarkSortingRule) => (rule1.sortPriority < rule2.sortPriority ? -1 : 1));

				for (const rule of orderedRulesByPriority) {
					let columnWithSortDirection: string = rule.column.name; // asc
					if (rule.sortDirection === "desc") {
						columnWithSortDirection = "-" + rule.column.name; // desc
					}
					newOrderProperties.push(columnWithSortDirection);
				}

				this.orderProperties = newOrderProperties; // enforcing immutability :)
				this.cdRef.detectChanges(); // needed due to ChangeDetectionStrategy.OnPush in order to refresh the columns

				this.sortData();
			}
		});
	}

	/**
	 * Clear the sorting direction of every column in the table except for the given column (if any)
	 * @param exceptColumn - Column whose sorting direction should not be cleared
	 */
	public resetSorting(exceptColumn: StarkColumnSortChangedOutput): void {
		for (const column of this.columns) {
			if (exceptColumn.name !== column.name) {
				column.sortDirection = "";
				column.sortPriority = 100;
			}
		}
	}

	/**
	 * @ignore
	 */
	private _resetSelection(forceReset: boolean = false): void {
		/* eslint-disable import/no-deprecated */
		if (!this.selection || forceReset) {
			this._selection = new SelectionModel<object>(coerceBooleanProperty(this.multiSelect), []);
		}

		// Emit event when selection changes
		if (this._selectionSub) {
			this._selectionSub.unsubscribe();
		}
		this._selectionSub = this.selection.changed.subscribe((change: SelectionChange<object>) => {
			const selected: object[] = change.source.selected;
			this.selectChanged.emit(selected);
		});
		/* eslint-enable import/no-deprecated */
	}

	/**
	 * Sort the data according to the direction and priority (if any) defined for each column.
	 * In case there is a compareFn defined for any of the columns then such method is called to perform the custom sorting.
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	public sortData(): void {
		if (!this.columns) {
			return;
		}
		const sortableColumns: StarkTableColumnComponent[] = this.columns
			.filter((columnToFilter: StarkTableColumnComponent) => !!columnToFilter.sortDirection)
			.sort((column1: StarkTableColumnComponent, column2: StarkTableColumnComponent) => column1.sortPriority - column2.sortPriority);

		// FIXME If "multiSort" is empty or equal to "true", isMultiSorting is true. Otherwise, "isMultiSorting" should stay false.
		// Should remove this condition ?
		this.isMultiSorting = sortableColumns.length > 1;

		this.dataSource.data = [...this.data].sort((row1: object, row2: object) => {
			for (const column of sortableColumns) {
				const isAscendingDirection: boolean = column.sortDirection === "asc";
				if (column.compareFn instanceof Function) {
					const compareResult: number = column.compareFn(column.getRawValue(row1), column.getRawValue(row2));
					if (compareResult !== 0) {
						return isAscendingDirection ? compareResult : compareResult * -1;
					}
				} else {
					const valueObj1: string | number = column.getDisplayedValue(row1);
					const valueObj2: string | number = column.getDisplayedValue(row2);
					const obj1: string | number = typeof valueObj1 === "string" ? valueObj1.toLowerCase() : valueObj1;
					const obj2: string | number = typeof valueObj2 === "string" ? valueObj2.toLowerCase() : valueObj2;

					if (obj1 > obj2) {
						return isAscendingDirection ? 1 : -1;
					}
					if (obj1 < obj2) {
						return isAscendingDirection ? -1 : 1;
					}
				}
			}
			return 0;
		});
	}

	/**
	 * Get the filter value of the specified column.
	 * @param columnName - Name of the column whose filter value should be retrieved.
	 * @returns The filter value of the specified column or undefined in case it has no filter value defined.
	 */
	public getColumnFilterValue(columnName: string): string | undefined {
		let columnFilterValue: string | undefined;

		if (this.filter.columns instanceof Array) {
			for (const columnFilter of this.filter.columns) {
				if (
					columnFilter.columnName === columnName &&
					typeof columnFilter.filterValue === "string" &&
					columnFilter.filterValue !== ""
				) {
					columnFilterValue = columnFilter.filterValue;
					break;
				}
			}
		}
		return columnFilterValue;
	}

	/**
	 * Get the position of the filter box of the specified column.
	 * @param columnName - Name of the column whose filter box position should be retrieved.
	 * @returns The position of the filter box of the specified column.
	 */
	public getColumnFilterPosition(columnName: string): StarkTableColumnFilter["filterPosition"] {
		if (!(this.filter.columns instanceof Array)) {
			return undefined;
		}

		const column = this.filter.columns.find((columnFilter: StarkTableColumnFilter) => columnFilter.columnName === columnName);
		return column ? column.filterPosition : undefined;
	}

	/**
	 * Get the sorting direction of the specified column.
	 * @param columnName - Name of the column whose sorting direction should be retrieved.
	 * @returns The sorting direction of the specified column.
	 */
	public getColumnSortingDirection(columnName: string): StarkTableColumnSortingDirection {
		let columnSortingDirection: StarkTableColumnSortingDirection = "";

		if (this.isArrayFilled(this.orderProperties)) {
			const columnOrderProperty: string | undefined = this.orderProperties.filter((orderProperty: string) => {
				if (orderProperty.startsWith("-")) {
					return orderProperty === "-" + columnName;
				}
				return orderProperty === columnName;
			})[0];

			if (columnOrderProperty) {
				columnSortingDirection = columnOrderProperty.startsWith("-") ? "desc" : "asc";
			}
		}

		return columnSortingDirection;
	}

	/**
	 * Get the sorting priority of the specified column.
	 * @param columnName - Name of the column whose sorting priority should be retrieved.
	 * @returns The sorting priority of the specified column.
	 */
	public getColumnSortingPriority(columnName: string): number | undefined {
		let columnSortingPriority: number | undefined;
		let priority = 1;

		if (this.isArrayFilled(this.orderProperties)) {
			for (const orderProperty of this.orderProperties) {
				if (orderProperty === columnName || (orderProperty.startsWith("-") && orderProperty === "-" + columnName)) {
					columnSortingPriority = priority;
					break;
				}

				priority++;
			}
		}

		return columnSortingPriority;
	}

	/**
	 * Reset the filter value (global or per column) as long as the resetFilterOnDataChange (global or per column) option is enabled
	 * @returns Whether the filter has been reset
	 */
	public resetFilterValueOnDataChange(): boolean {
		let filterValueReset = false;

		if (
			typeof this.filter.globalFilterValue === "string" &&
			this.filter.globalFilterValue !== "" &&
			this.filter.resetGlobalFilterOnDataChange === true
		) {
			this._globalFilterFormCtrl.reset();
			filterValueReset = true;
		}

		if (typeof this.filter.columns !== "undefined") {
			for (const columnFilter of this.filter.columns) {
				if (
					typeof columnFilter.filterValue === "string" &&
					columnFilter.filterValue !== "" &&
					columnFilter.resetFilterOnDataChange === true
				) {
					columnFilter.filterValue = "";
					filterValueReset = true;
				}
			}
		}

		return filterValueReset;
	}

	/**
	 * Check if a given row is inside the expandedRow.
	 * @param row - The data object to check.
	 * @returns boolean
	 */
	public isRowInExpandedRows(row: object): boolean {
		return this.expandedRows.some((expandedRow: object) => this.expandedRowFn(expandedRow, row));
	}

	/**
	 * Gets the class for a specific row if a rowClassNameFn function has been given as an Input.
	 * Also checks if the row is selected.
	 * @param row - The data object passed to the row.
	 * @param index - The index of the row.
	 * @returns The classNames generated by the rowClassNameFn function
	 */
	public getRowClasses(row: object, index: number): string {
		const classes: string[] = [];

		// Check if selected
		if (this.selection && this.selection.isSelected(row)) {
			classes.push("selected");
		}

		if (this.isRowInExpandedRows(row)) {
			classes.push("expanded");
		}

		// Run rowClassNameFn
		if (typeof this.rowClassNameFn === "function") {
			classes.push(this.rowClassNameFn(row, index));
		}

		return classes.join(" ") || "";
	}

	/**
	 * Handles if a row is clicked. If there are listeners on the rowClick event of the table these should handle the event.
	 * If there are no listeners we fall back to the default behaviour, which is (de)selecting the row (if rowsSelectable is enabled)
	 * @param row - The data object passed to the row
	 */
	public onRowClick(row: object): void {
		if (this.rowClicked.observers.length > 0) {
			// If there is an observer, emit an event
			this.rowClicked.emit(row);
			// eslint-disable-next-line import/no-deprecated
		} else if (this._managedSelection || this.rowsSelectable) {
			// If multi-select is enabled, (un)select the row
			this.selection.toggle(row);
		} else {
			// Do nothing
		}
	}

	/**
	 * Get the row index, based on its position in dataSource.data
	 * @param row - Row to get index
	 */
	public getRowIndex(row: any): number | undefined {
		if (this.dataSource && this.dataSource.data) {
			return this.dataSource.data.indexOf(row) + 1;
		}

		return undefined;
	}

	/**
	 * Toggles the visibility of a column
	 * @param item - The item containing the name of the column
	 */
	public toggleColumnVisibility(item: StarkMinimapItemProperties): void {
		const index: number = this.columnProperties.findIndex(({ name }: StarkTableColumnProperties) => name === item.name);
		this.columnProperties[index].isVisible = !this.columnProperties[index].isVisible;
	}

	/**
	 * @ignore
	 * Type guard
	 */
	private isArrayFilled(array: any): array is any[] {
		return array instanceof Array && !!array.length;
	}

	/**
	 * @ignore
	 */
	public trackColumnFn(_index: number, item: StarkTableColumnProperties): string {
		return item.name;
	}

	/**
	 * @ignore
	 * Type guard
	 */
	private isColumnPropertiesWithOnClickCallback(
		columnProperties?: StarkTableColumnProperties
	): columnProperties is StarkTableColumnProperties & Required<Pick<StarkTableColumnProperties, "onClickCallback">> {
		return !!columnProperties && columnProperties.onClickCallback instanceof Function;
	}

	/**
	 * @ignore
	 * Type guard
	 */
	public isGlobalFilterPresent(
		filter: StarkTableFilter
	): filter is StarkTableFilter & Required<Pick<StarkTableFilter, "filterPosition">> {
		return !!filter && !!filter.globalFilterPresent && (filter.filterPosition === "above" || filter.filterPosition === "below");
	}
}
