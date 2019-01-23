import {
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
import { MatColumnDef } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { FormControl } from "@angular/forms";
import { distinctUntilChanged } from "rxjs/operators";
import { StarkColumnFilterChangedOutput, StarkColumnSortChangedOutput, StarkTableColumnSortingDirection } from "../entities";

/**
 * @ignore
 */
const _isEqual: Function = require("lodash/isEqual");

/**
 * @ignore
 */
const _get: Function = require("lodash/get");

/**
 * Component to display a column inside the StarkTableComponent
 */
@Component({
	selector: "stark-table-column",
	templateUrl: "./column.component.html",
	encapsulation: ViewEncapsulation.None,
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
	private _name: string;

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
	public sortDirection: StarkTableColumnSortingDirection;

	/**
	 * Whether this column is filterable
	 */
	@Input()
	public filterable: boolean = false;

	/**
	 * Value of the filter
	 * Wildcards can be used: "*" to match any anything and "?" to match one character.
	 * Use "\*" and "\?" to match exactly the characters "*" and "?"
	 */
	@Input()
	public filterValue?: string;

	/**
	 * Label to be shown as the column's header. Default: the column's name
	 */
	@Input()
	public headerLabel: string;

	/**
	 * Whether the column is sortable or not. Default: true
	 */
	@Input()
	public sortable: boolean = true;

	/**
	 * Priority of the column.
	 */
	@Input()
	public sortPriority: number;

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
	 * Output that will emit a specific column whenever its filter value has changed
	 */
	@Output()
	public filterChanged: EventEmitter<StarkColumnFilterChangedOutput> = new EventEmitter<StarkColumnFilterChangedOutput>();

	/**
	 * Output that will emit a specific column whenever its sorting direction has changed
	 */
	@Output()
	public sortChanged: EventEmitter<StarkColumnSortChangedOutput> = new EventEmitter<StarkColumnSortChangedOutput>();

	/**
	 * Reference to the MatColumnDef embedded in this component
	 */
	@ViewChild(MatColumnDef)
	public columnDef: MatColumnDef;

	/**
	 * Reference to the transcluded template in this component via the ngTemplateOutlet
	 */
	@ContentChild(TemplateRef)
	public columnTemplate: TemplateRef<object>;

	/**
	 * @ignore
	 * Internal formControl to manage the filter value of the column
	 */
	public _filterFormCtrl: FormControl;

	/**
	 * Class constructor
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 * @param translateService - the translation service of the application
	 */
	public constructor(protected renderer: Renderer2, protected elementRef: ElementRef, private translateService: TranslateService) {
		super(renderer, elementRef);
	}

	public ngOnInit(): void {
		this._filterFormCtrl = new FormControl(this.filterValue);

		this._filterFormCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((value?: string | null) => {
			this.filterValue = value === null ? undefined : value;
			this.filterChanged.emit({
				filterValue: this.filterValue,
				name: this.name
			});
		});
	}

	public ngOnChanges(simpleChanges: SimpleChanges): void {
		if (
			simpleChanges["filterValue"] &&
			!simpleChanges["filterValue"].isFirstChange() &&
			!_isEqual(simpleChanges["filterValue"].previousValue, simpleChanges["filterValue"].currentValue)
		) {
			this._filterFormCtrl.setValue(this.filterValue);
		}
	}

	/**
	 * Returns the header label of the column if it's specified. If not, simply returns the name of the column
	 */
	public getHeaderLabel(): string {
		return this.translateService.instant(this.headerLabel ? this.headerLabel : this.name);
	}

	/**
	 * Get the raw value of the column
	 * @param row - The row item
	 * @returns The raw value of the property from the given row item
	 */
	public getRawValue(row: object): any | undefined {
		let rawValue: any | undefined = _get(row, this.name);

		if (this.dataAccessor) {
			rawValue = this.dataAccessor(row, this.name);
		}

		// ensure we always return undefined instead of null
		return rawValue !== null ? rawValue : undefined;
	}

	/**
	 * Get the final displayed value of the column
	 * @param row - The row item
	 * @returns The displayed value of the property from the given row item after applying the
	 * formatter (if there was any defined in the column) and translating the value (in case the value is a translation key)
	 */
	public getDisplayedValue(row: object): string | number {
		let formattedValue: string = "";
		const rawValue: any | undefined = this.getRawValue(row);

		if (typeof rawValue !== "undefined") {
			if (this.cellFormatter instanceof Function) {
				formattedValue = this.cellFormatter(rawValue, row, this.name);
			} else if (typeof rawValue === "number") {
				return rawValue; // return already, no point in translating a number
			} else {
				formattedValue = rawValue.toString();
			}
		} else {
			return ""; // return already, no point in translating an empty string
		}

		return formattedValue;
		// TODO: add translation feature
		// return this.$translate.instant(formattedValue);
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
