import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	TemplateRef,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { UntypedFormControl } from "@angular/forms";
import { MenuPositionY } from "@angular/material/menu";
import { MatColumnDef } from "@angular/material/table";
import { distinctUntilChanged } from "rxjs/operators";
import isEqual from "lodash-es/isEqual";
import get from "lodash-es/get";
import {
	StarkColumnCellClickedOutput,
	StarkColumnFilterChangedOutput,
	StarkColumnSortChangedOutput,
	StarkTableColumnSortingDirection
} from "../entities";

/**
 * Component to display a column inside the StarkTableComponent
 */
@Component({
	selector: "stark-table-column",
	templateUrl: "./column.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: "stark-table-column"
	}
})
export class StarkTableColumnComponent extends AbstractStarkUiComponent implements OnInit, OnChanges {
	/**
	 * Name of the property that will be the source of the column.
	 */
	@Input()
	public get name(): string {
		return this._name;
	}

	public set name(name: string) {
		this._name = name;
		this.columnDef.name = name;
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _name = "";

	/**
	 * Function that returns
	 *   1 : if obj1 > obj2
	 *   0 : if obj1 === obj2
	 *  -1 : if obj1 < obj2
	 *
	 * @param obj1 - First object in the comparison
	 * @param obj2 - Second object in the comparison
	 */
	@Input()
	public compareFn?: (obj1: object, obj2: object) => number;

	/**
	 * Function that returns the raw value of this column in case the access to such value can't be provided via the column name.
	 */
	@Input()
	public dataAccessor?: (data: object, name: string) => string; // TODO: really needed?

	/**
	 * Function that returns a formatted value (string) to be set in the cell. It can be used to set different formats
	 * depending on the row, value and or columnName. This function is called with 3 parameters:
	 * @param value - The value of the cell to be formatted
	 * @param row - The row object that contains the cell
	 * @param columnName - The column that the cell belongs to
	 */
	@Input()
	public cellFormatter?: (value: any, row?: object, columnName?: string) => string;

	/**
	 * Sorting direction of the column.
	 */
	@Input()
	public sortDirection: StarkTableColumnSortingDirection = "";

	/**
	 * Whether this column is filterable
	 */
	@Input()
	public get filterable(): boolean {
		return this._filterable;
	}

	public set filterable(value: boolean) {
		this._filterable = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_filterable: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _filterable = false;

	/**
	 * Value of the filter
	 * Wildcards can be used: "*" to match any anything and "?" to match one character.
	 * Use "\*" and "\?" to match exactly the characters "*" and "?"
	 */
	@Input()
	public filterValue?: string;

	/**
	 * Label to be shown as the column's header.
	 *
	 * Default: the column's name
	 */
	@Input()
	public set headerLabel(value: string) {
		this._headerLabel = value;
	}

	/**
	 * Returns the header label of the column if it's specified. If not, simply returns the name of the column
	 */
	public get headerLabel(): string {
		return this._headerLabel || this.name;
	}

	public static ngAcceptInputType_headerLabel: string | undefined;

	/**
	 * @ignore
	 * @internal
	 */
	private _headerLabel?: string;

	/**
	 * Value to be shown as the column's footer.
	 */
	@Input()
	public set footerValue(value: string | number | undefined) {
		this._footerValue = value;
	}

	/**
	 * Returns the footer value of the column if it's specified.
	 */
	public get footerValue(): string | number | undefined {
		return this._footerValue;
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _footerValue?: string | number;

	/**
	 * Whether the column is sortable or not.
	 *
	 * Default: `true`
	 */
	@Input()
	public sortable = true;

	/**
	 * Position where the column filter box should be displayed.
	 *
	 * Default: `"below"`
	 */
	@Input()
	public get filterPosition(): MenuPositionY {
		return this._filterPosition;
	}

	public set filterPosition(value: MenuPositionY) {
		this._filterPosition = value || "below";
	}

	public static ngAcceptInputType_filterPosition: MenuPositionY | undefined;

	/**
	 * @ignore
	 * @internal
	 */
	private _filterPosition: MenuPositionY = "below";

	/**
	 * Priority of the column.
	 */
	@Input()
	public sortPriority = 100;

	public static ngAcceptInputType_sortPriority: number | undefined;

	/**
	 * Whether the column is visible or not.
	 *
	 * Default: `true`
	 */
	@Input()
	public get visible(): boolean {
		return this._visible;
	}

	public set visible(value: boolean) {
		this._visible = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_visible: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _visible = true;

	/**
	 * A function to generate classNames for cells based on the value, its row and the name of the column.
	 * Or a static string with the classNames.
	 */
	@Input()
	public cellClassName?: ((value: any, row?: object, columnName?: string) => string) | string;

	/**
	 * A static className for the header
	 */
	@Input()
	public headerClassName?: string;

	/**
	 * Make the column stick to the right side of the table
	 */
	@Input()
	public get stickyEnd(): boolean {
		return this._stickyEnd;
	}

	public set stickyEnd(value: boolean) {
		this._stickyEnd = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_stickyEnd: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _stickyEnd = false;

	/**
	 * Output that will emit a StarkColumnCellClickedOutput whenever a cell in the column is clicked
	 */
	@Output()
	public readonly cellClicked = new EventEmitter<StarkColumnCellClickedOutput>();

	/**
	 * Output that will emit a specific column whenever its filter value has changed
	 */
	@Output()
	public readonly filterChanged = new EventEmitter<StarkColumnFilterChangedOutput>();

	/**
	 * Output that will emit a specific column whenever its sorting direction has changed
	 */
	@Output()
	public readonly sortChanged = new EventEmitter<StarkColumnSortChangedOutput>();

	/**
	 * Reference to the MatColumnDef embedded in this component
	 */
	@ViewChild(MatColumnDef, { static: true })
	public columnDef!: MatColumnDef;

	/**
	 * Reference to the transcluded template in this component via the ngTemplateOutlet
	 */
	@ContentChild(TemplateRef, { static: true })
	// eslint-disable-next-line no-null/no-null
	public columnTemplate: TemplateRef<object> | null = null;

	/**
	 * @ignore
	 * Internal formControl to manage the filter value of the column
	 */
	public _filterFormCtrl = new UntypedFormControl();

	/**
	 * Class constructor
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	// eslint-disable-next-line no-useless-constructor
	public constructor(renderer: Renderer2, elementRef: ElementRef) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();

		this._filterFormCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((value?: string | null) => {
			// eslint-disable-next-line no-null/no-null
			this.filterValue = value === null ? undefined : value;
			this.filterChanged.emit({
				filterValue: this.filterValue,
				name: this.name
			});
		});
	}

	/**
	 * Component lifecycle hook
	 * @param simpleChanges - Contains the changed properties
	 */
	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (
			simpleChanges["filterValue"] &&
			!isEqual(simpleChanges["filterValue"].previousValue, simpleChanges["filterValue"].currentValue)
		) {
			this._filterFormCtrl.setValue(this.filterValue);
		}

		if (simpleChanges["sortPriority"] && typeof simpleChanges["sortPriority"].currentValue === "undefined") {
			this.sortPriority = 100;
		}
	}

	/**
	 * Get the raw value of the column
	 * @param row - The row item
	 * @returns The raw value of the property from the given row item
	 */
	public getRawValue(row: object): any | undefined {
		let rawValue: any | undefined = get(row, this.name);

		if (this.dataAccessor) {
			rawValue = this.dataAccessor(row, this.name);
		}

		// ensure we always return undefined instead of null
		// eslint-disable-next-line no-null/no-null
		return rawValue !== null ? rawValue : undefined;
	}

	/**
	 * Called whenever a cell of the column is clicked
	 * @param $event - The handled event
	 * @param row - The row item
	 */
	public onCellClick($event: Event, row: object): void {
		if (this.cellClicked.observers.length > 0) {
			$event.stopPropagation();

			this.cellClicked.emit({
				value: this.getRawValue(row),
				row: row,
				columnName: this.name
			});
		}
	}

	/**
	 * Get the final displayed value of the column
	 * @param row - The row item
	 * @returns The displayed value of the property from the given row item after applying the
	 * formatter (if there was any defined in the column) and translating the value (in case the value is a translation key)
	 */
	public getDisplayedValue(row: object): string | number {
		let formattedValue = "";
		const rawValue: any | undefined = this.getRawValue(row);

		if (this.cellFormatter instanceof Function) {
			formattedValue = this.cellFormatter(rawValue, row, this.name);
		} else if (typeof rawValue === "undefined") {
			return ""; // return already, no point in translating an empty string
		} else if (typeof rawValue === "number") {
			return rawValue; // return already, no point in translating a number
		} else {
			formattedValue = rawValue.toString();
		}

		// TODO: add translation feature
		// return this.$translate.instant(formattedValue);
		return formattedValue;
	}

	/**
	 * Called when the Clear button in the filter pop-up is clicked
	 */
	public onClearFilter(): void {
		this._filterFormCtrl.reset();
		this.onFilterChange();
	}

	/**
	 * Called whenever the value of the filter input changes
	 */
	public onFilterChange(): void {
		this.filterChanged.emit(this);
	}

	/**
	 * Called whenever the sorting of the column changes
	 */
	public onSortChange(): void {
		this.sortChanged.emit({
			name: this.name,
			sortable: this.sortable,
			sortDirection: this.sortDirection,
			sortPriority: this.sortPriority
		});
	}

	/**
	 * Gets a the classes for a specific cell, based on the cellClassName Input and the cellClassNameFn function if it was given.
	 * @param row - The data object of the row the cell is in.
	 * @returns The classes for the cell.
	 */
	public getCellClassNames(row: object): string {
		if (!this.visible) {
			return "hidden";
		}

		if (!this.cellClassName) {
			return "";
		}

		if (typeof this.cellClassName === "string") {
			return this.cellClassName;
		}

		const value: any = this.getRawValue(row);
		return this.cellClassName(value, row, this.name);
	}

	/**
	 * Get the classes for a header
	 * @returns The classes for the header
	 */
	public getHeaderClassNames(): string {
		const classes: string[] = [];

		if (!this.visible) {
			classes.push("hidden");
		}

		if (this.sortable) {
			classes.push("sortable");
		}

		if (this.filterValue) {
			classes.push("filtering");
		}

		if (this.headerClassName) {
			classes.push(this.headerClassName);
		}

		return classes.join(" ");
	}
}
