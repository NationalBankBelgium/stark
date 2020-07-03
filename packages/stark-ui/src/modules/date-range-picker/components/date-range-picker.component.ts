/* tslint:disable:no-null-keyword */
import {
	ChangeDetectorRef,
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
import {
	AbstractControl,
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR,
	NgControl,
	ValidatorFn,
	Validators
} from "@angular/forms";
import { Subscription } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import get from "lodash-es/get";
import isEqual from "lodash-es/isEqual";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { StarkDatePickerComponent, StarkDatePickerFilter, StarkDatePickerMaskConfig } from "../../date-picker/components";
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
export class StarkDateRangePickerComponent extends AbstractStarkUiComponent implements ControlValueAccessor, OnInit, OnDestroy {
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
	private _startDate!: FormControl; // will be defined by '_setupFormControls()' called in the constructor

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

	/**
	 * Source Date to be bound to the end datepicker model
	 */
	@Input()
	public get endDate(): Date | undefined {
		return this._endDate.value || undefined;
	}

	public set endDate(value: Date | undefined) {
		this._endDate.setValue(value);
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
	private _endDate!: FormControl; // will be defined by '_setupFormControls()' called in the constructor

	/**
	 * Label to be displayed in the end datepicker
	 */
	@Input()
	public endDateLabel = "STARK.DATE_RANGE_PICKER.TO";

	/**
	 * Minimum date of the end date picker
	 */
	@Input()
	public set endMinDate(date: Date | undefined) {
		this._endMinDate = date;
	}

	public get endMinDate(): Date | undefined {
		// use the startDate when defined to provide better user experience :)
		return this.startDate || this._endMinDate;
	}

	private _endMinDate?: Date;

	/**
	 * Maximum date of the end date picker
	 */
	@Input()
	public endMaxDate?: Date;

	/**
	 * Input to manage both start date and end date.
	 */
	@Input()
	public set rangeFormGroup(val: FormGroup) {
		const { startDate, endDate } = val.controls;
		if (!(startDate instanceof FormControl && endDate instanceof FormControl)) {
			this.logger.error(`[${componentName}]: "formGroup" requires a FormControl for startDate and another one for endDate`);
			return;
		}

		this._formGroup = val;
		// overwrite internal formControls and setup again the validators, subscriptions, etc.
		this._startDate = startDate;
		this._endDate = endDate;
		this._setupFormControls();
	}

	/**
	 * @ignore
	 */
	private _formGroup?: FormGroup;

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
	 * Whether the date pickers are disabled
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

		// enable/disable the controls without emitting a change event since the values did not change (to avoid unnecessary extra calls!)
		if (val) {
			if (this.startDateFormControl) {
				this.startDateFormControl.disable({ emitEvent: false });
			}
			if (this.endDateFormControl) {
				this.endDateFormControl.disable({ emitEvent: false });
			}
		} else {
			if (this.startDateFormControl) {
				this.startDateFormControl.enable({ emitEvent: false });
			}
			if (this.endDateFormControl) {
				this.endDateFormControl.enable({ emitEvent: false });
			}
		}
	}

	/**
	 * Whether the date pickers are required
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
	 * Output that will emit a specific date range whenever the selection has changed
	 */
	@Output()
	public readonly dateRangeChanged = new EventEmitter<StarkDateRangePickerEvent>();

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

	/**
	 * @ignore
	 * @internal
	 * The registered callback function called when a blur event occurs on the input element.
	 */
	private _onTouched: () => void = () => {
		/*noop*/
	};

	/**
	 * @ignore
	 * @internal
	 * The registered callback function called when an input event occurs on the input element.
	 */
	private _onChange: (_dateRange: StarkDateRangePickerEvent) => void = (_: any) => {
		/*noop*/
	};

	/**
	 * Subscriptions to be removed at end of component lifecycle
	 * @ignore
	 */
	private subs: Subscription[] = [];

	/**
	 * @ignore
	 * @internal
	 */
	public currentRange?: StarkDateRangePickerEvent;

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
	 * @ignore
	 * @internal
	 */
	private _endAfterStartValidator: ValidatorFn = ({ value }) => {
		return value instanceof Date && this.startDate instanceof Date && value.getTime() < this.startDate.getTime()
			? { endAfterStart: true }
			: null;
	};

	/**
	 * @ignore
	 * @internal
	 * Validator that will perform the 'required' validation only if the 'required' input is enabled
	 * IMPORTANT: this should be always added to the internal form controls for the start and end date pickers
	 */
	private _requiredValidator: ValidatorFn = (control: AbstractControl) => {
		if (this.required) {
			return Validators.required(control);
		}

		return null;
	};

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param injector - The Injector of the application
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 * @param cdRef - Reference to the change detector attached to this component
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		private injector: Injector,
		protected renderer: Renderer2,
		protected elementRef: ElementRef,
		protected cdRef: ChangeDetectorRef
	) {
		super(renderer, elementRef);
		// IMPORTANT: the form controls should be initialized here because they should be available before the developer passes his own form controls
		this._setupFormControls();
	}

	/**
	 * Angular lifecycle method
	 */
	public ngOnInit(): void {
		this._setupNgControl();
		this.logger.debug(componentName + ": component initialized");
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
	 * @ignore
	 * @internal
	 */
	private _setupFormControls(): void {
		// merge the original validators with ones from the start/end date form controls if already available
		// or create the form controls with such validators otherwise
		// IMPORTANT: the '_requiredValidator' should ALWAYS be added. Internally it checks whether the control is actually required or not.
		// By doing this, the formControl will be marked as 'required' since the beginning (if it is marked as required).
		// This prevents the 'ExpressionChangedAfterItHasBeenCheckedError' in the template when the developer uses an NgModel and retrieves the internal errors
		// However, the error will NOT prevent the error from happening when FormControl is used (via the 'rangeFormGroup' input).
		if (this.startDateFormControl) {
			this.startDateFormControl.setValidators(
				Validators.compose([this.startDateFormControl.validator, this._requiredValidator, this._startBeforeEndValidator])
			);
		} else {
			this._startDate = new FormControl(undefined, [this._requiredValidator, this._startBeforeEndValidator]);
		}
		if (this.endDateFormControl) {
			this.endDateFormControl.setValidators(
				Validators.compose([this.endDateFormControl.validator, this._requiredValidator, this._endAfterStartValidator])
			);
		} else {
			this._endDate = new FormControl(undefined, [this._requiredValidator, this._endAfterStartValidator]);
		}

		for (const subscription of this.subs) {
			subscription.unsubscribe();
		}

		this.subs.push(
			this.startDateFormControl.valueChanges.pipe(distinctUntilChanged()).subscribe((_value: Date) => {
				this.onDateChanged("start");
			}),
			this.endDateFormControl.valueChanges.pipe(distinctUntilChanged()).subscribe((_value: Date) => {
				this.onDateChanged("end");
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
	 * Handle the date changed on the start and end datepicker
	 * @param dateOrigin - Whether the change was triggered by the start or end date picker
	 */
	public onDateChanged(dateOrigin: "start" | "end"): void {
		this._onTouched();

		if (this.startDate && this.endDate && this.endDate.getTime() < this.startDate.getTime()) {
			// clear the value of one of the date pickers and make the change to affect ONLY that control
			// this is because at the end both controls will be validated once the final value is emitted (see the 'else' block below)
			if (dateOrigin === "start") {
				this.endDateFormControl.setValue(undefined, { onlySelf: true });
			} else {
				this.startDateFormControl.setValue(undefined, { onlySelf: true });
			}
			this.cdRef.detectChanges(); // to force a refresh of the validation errors
		} else {
			const dateRange: StarkDateRangePickerEvent = { startDate: this.startDate, endDate: this.endDate };

			if (!isEqual(dateRange, this.currentRange)) {
				// calling 'updateValueAndValidity()' manually on both form controls without emitting the valueChanges event (to avoid unnecessary extra calls in the end user's code!)
				this.startDateFormControl.updateValueAndValidity({ emitEvent: false });
				this.endDateFormControl.updateValueAndValidity({ emitEvent: false });

				this.currentRange = dateRange;
				this._onChange(dateRange);
				this.dateRangeChanged.emit(dateRange);
			}
		}
	}

	/**
	 * Part of {@link ControlValueAccessor} API
	 * Registers a function to be called when the control value changes.
	 * @ignore
	 * @internal
	 */
	public registerOnChange(fn: (_dateRange: StarkDateRangePickerEvent) => void): void {
		this._onChange = fn;
	}

	/**
	 * Part of {@link ControlValueAccessor} API
	 * Registers a function to be called when the control is touched.
	 * @ignore
	 * @internal
	 */
	public registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	/**
	 * Part of {@link ControlValueAccessor} API
	 * Sets the "disabled" property on the input element.
	 * @ignore
	 * @internal
	 */
	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	/**
	 * Part of {@link ControlValueAccessor} API
	 * Sets the "value" property on the input element.
	 * @ignore
	 * @internal
	 */
	public writeValue(dateRange: StarkDateRangePickerEvent): void {
		dateRange = dateRange || {};
		this.startDateFormControl.setValue(dateRange.startDate, { emitEvent: false });
		this.endDateFormControl.setValue(dateRange.endDate, { emitEvent: false });
	}
}
