/* tslint:disable:no-null-keyword */
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Injector,
	Input,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	Type,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, NgControl, ValidatorFn, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import noop from "lodash-es/noop";
import get from "lodash-es/get";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { StarkDatePickerComponent, StarkDatePickerFilter, StarkDatePickerMaskConfig } from "../../date-picker";
import { StarkDateRangePickerEvent } from "./date-range-picker-event.intf";

/**
 * Name of the component
 */
const componentName = "stark-date-range-picker";

/**
 * Component to display the stark date-range-picker
 */
@Component({
	selector: "stark-date-range-picker",
	templateUrl: "./date-range-picker.component.html",
	encapsulation: ViewEncapsulation.None,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: StarkDateRangePickerComponent
		}
	]
})
export class StarkDateRangePickerComponent extends AbstractStarkUiComponent
	implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
	/**
	 * ControlValueAccessor listener
	 * @ignore
	 */
	private _onTouched: () => void = noop;

	/**
	 * ControlValueAccessor listener
	 * @ignore
	 */
	private _onChange: (_dateRange: StarkDateRangePickerEvent) => void = noop;

	/**
	 * Subscriptions to be removed at end of component lifecycle
	 * @ignore
	 */
	private subs: Subscription[] = [];

	/*--- VIEW CHILDREN ---*/
	/**
	 * Reference to the start datepicker embedded in this component
	 */
	@ViewChild("startPicker")
	public startPicker!: StarkDatePickerComponent;

	/**
	 * Reference to the end datepicker embedded in this component
	 */
	@ViewChild("endPicker")
	public endPicker!: StarkDatePickerComponent;

	/*--- START-DATE CONFIGURATIONS ---*/

	/**
	 * @ignore
	 * @internal
	 */
	private _startBeforeEndValidator: ValidatorFn = ({ value }) => {
		return value instanceof Date && this.endDate instanceof Date && value.getTime() > this.endDate.getTime()
			? { startBeforeEnd: true }
			: null;
	};

	/**
	 * Source Date to be bound to the start datepicker model
	 */
	@Input()
	public get startDate(): Date | undefined {
		return this._startDate.value || undefined;
	}

	public set startDate(value: Date | undefined) {
		this._startDate.setValue(value);
	}

	/**
	 * The internal formControl used to manage the state of the starkDatePicker for the start date.
	 * This can be used to retrieve internal errors.
	 *
	 * @example
	 *
	 * <stark-date-range-picker required #starkDateRangePicker >
	 *   <ng-container start-date-errors>
	 *     {{starkDateRangePicker.startDateFormControl.hasError('required') ? "Start date is required" : null }}
	 *   </ng-container>
	 * </stark-date-range-picker>
	 */
	public get startDateFormControl(): FormControl {
		return this._startDate;
	}

	/**
	 * @ignore
	 */
	private _startDate = new FormControl();

	/**
	 * Label to be displayed in the end datepicker
	 */
	@Input()
	public startDateLabel = "STARK.DATE_RANGE_PICKER.FROM";

	/**
	 * Minimum date of the start date picker
	 */
	@Input()
	public startMinDate?: Date;

	/**
	 * Maximum date of the start date picker
	 */
	@Input()
	public startMaxDate?: Date;

	/*--- END-DATE CONFIGURATIONS ---*/

	/**
	 * @ignore
	 * @internal
	 */
	private _endAfterStartValidator: ValidatorFn = ({ value }) => {
		return value instanceof Date && this.startDate instanceof Date && value.getTime() < this.startDate.getTime()
			? { endAfterStart: true }
			: null;
	};

	/**
	 * Source Date to be bound to the end datepicker model
	 */
	@Input()
	public get endDate(): Date | undefined {
		return this._endDate.value || undefined;
	}

	public set endDate(value: Date | undefined) {
		this._endDate.setValue(value || null);
	}

	/**
	 * The internal formControl used to manage the state of the starkDatePicker for the start date.
	 * This can be used to retrieve internal errors.
	 *
	 * @example
	 *
	 * <stark-date-range-picker required #starkDateRangePicker >
	 *   <ng-container end-date-errors>
	 *     {{starkDateRangePicker.endDateFormControl.hasError('required') ? "End date is required" : null }}
	 *   </ng-container>
	 * </stark-date-range-picker>
	 */
	public get endDateFormControl(): FormControl {
		return this._endDate;
	}

	/**
	 * @ignore
	 */
	private _endDate = new FormControl();

	/**
	 * Label to be displayed in the end datepicker
	 */
	@Input()
	public endDateLabel = "STARK.DATE_RANGE_PICKER.TO";

	/**
	 * Minimum date of the end date picker
	 */
	@Input()
	public endMinDate?: Date;

	/**
	 * Maximum date of the end date picker
	 */
	@Input()
	public endMaxDate?: Date;

	/*--- SHARED CONFIGURATIONS ---*/

	/**
	 * Input to manage both start date and end date.
	 */
	@Input()
	public set rangeFormGroup(val: FormGroup) {
		const { startDate, endDate } = val.controls;
		if (!(startDate instanceof FormControl && endDate instanceof FormControl)) {
			this.logger.error(`[${componentName}]: "formGroup" requires a FormControl for startDate and endDate`);
			return;
		}

		this._formGroup = val;
		// overwrite internal formControls
		this._startDate = startDate;
		this._endDate = endDate;
	}

	/**
	 * @ignore
	 */
	private _formGroup?: FormGroup;

	/**
	 * Output that will emit a specific date whenever the selection has changed
	 */
	@Output()
	public readonly dateRangeChanged = new EventEmitter<StarkDateRangePickerEvent>();

	/**
	 * Filter function or a string
	 * Will be applied to both date-picker
	 */
	@Input()
	public dateFilter?: StarkDatePickerFilter;

	/**
	 * Timestamp Mask Configuration to apply on the start/end date-picker.
	 * If `true` is passed, the default mask config is applied: {DEFAULT_DATE_MASK_CONFIG|DEFAULT_DATE_MASK_CONFIG}
	 * If `false` is passed or if `dateMask` is not present, the directive is disabled.
	 * If a `StarkTimestampMaskConfig` is passed, it is set as the date mask config.
	 */
	@Input()
	public dateMask?: StarkDatePickerMaskConfig;

	/**
	 * Whether the datepickers are disabled
	 */
	@Input()
	public set disabled(val: boolean) {
		if (this._formGroup) {
			this.logger.warn(`[${componentName}]: 
			It looks like you're using the "disabled" attribute with a "formGroup". We recommend using following approach.
       
      Example: 
      dateRangeFormGroup = new FormGroup({
        startDate: new FormControl({value: null, disabled: true}),
        endDate: new FormControl({value: null, disabled: true})
      });
			`);
		}

		if (val) {
			this.startDateFormControl.disable();
			this.endDateFormControl.disable();
		} else {
			this.startDateFormControl.enable();
			this.endDateFormControl.enable();
		}
	}

	/**
	 * Whether the datepickers are required
	 */
	@Input()
	public required = false;

	/**
	 * HTML "name" attribute of the element.
	 */
	@Input()
	public rangePickerId = "";

	/**
	 * HTML "name" attribute of the element.
	 */
	@Input()
	public rangePickerName = "";

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param injector - The Injector of the application
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		private injector: Injector,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Angular lifecycle method
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");
		this._setupFormControls();
	}

	/**
	 * Angular lifecycle method
	 */
	public ngAfterViewInit(): void {
		this._setupNgControl();
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _setupFormControls(): void {
		// Merge the original validators with ones from the start/end date form controls
		this.startDateFormControl.setValidators(Validators.compose([this.startDateFormControl.validator, this._startBeforeEndValidator]));
		this.endDateFormControl.setValidators(Validators.compose([this.endDateFormControl.validator, this._endAfterStartValidator]));

		for (const subscription of this.subs) {
			subscription.unsubscribe();
		}
		this.subs.push(
			this.startDateFormControl.valueChanges.subscribe(() => {
				this.endDateFormControl.updateValueAndValidity({ emitEvent: false, onlySelf: true });
				this.onDateChanged();
			}),
			this.endDateFormControl.valueChanges.subscribe(() => {
				this.startDateFormControl.updateValueAndValidity({ emitEvent: false, onlySelf: true });
				this.onDateChanged();
			})
		);
	}

	/**
	 * Link the passed control (if one is available) to the internal formControls.
	 * @ignore
	 * @internal
	 */
	private _setupNgControl(): void {
		// Get the ngControl from the injector
		const ngControl = this.injector.get<NgControl>(<Type<NgControl>>NgControl, <any>null);
		if (!ngControl) {
			return;
		}

		ngControl.valueAccessor = this;

		if (typeof get(ngControl, "control.validator") === "function") {
			this.logger.warn(
				`[${componentName}]: validators set on the control will not be used, use the "formGroup" attribute to manage your own validations.`
			);
		}
	}

	/**
	 * Angular lifecycle method
	 */
	public ngOnDestroy(): void {
		for (const subscription of this.subs) {
			subscription.unsubscribe();
		}
	}

	/**
	 * Handle the date changed on the start and end datepicker
	 */
	public onDateChanged(): void {
		this._onTouched();

		const dateRange: StarkDateRangePickerEvent = { startDate: this.startDate, endDate: this.endDate };

		this._onChange(dateRange);
		this.dateRangeChanged.emit(dateRange);
	}

	/*--- Control Value Accessor methods---*/

	/**
	 * @ignore
	 */
	public registerOnChange(fn: (_dateRange: StarkDateRangePickerEvent) => void): void {
		this._onChange = fn;
	}

	/**
	 * @ignore
	 */
	public registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	/**
	 * @ignore
	 */
	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	/**
	 * @ignore
	 */
	public writeValue(dateRange: StarkDateRangePickerEvent): void {
		dateRange = dateRange || {};
		this.startDateFormControl.setValue(dateRange.startDate, { emitEvent: false });
		this.endDateFormControl.setValue(dateRange.endDate, { emitEvent: false });
	}
}
