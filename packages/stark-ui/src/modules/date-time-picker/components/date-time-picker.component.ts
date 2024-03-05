/* eslint-disable no-null/no-null */
import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Inject,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewChild
} from "@angular/core";
import {
	AbstractControl,
	ControlValueAccessor,
	FormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	NgControl,
	ValidationErrors,
	Validator,
	ValidatorFn,
	Validators
} from "@angular/forms";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { MatLegacyFormField as MatFormField, MatLegacyFormFieldControl as MatFormFieldControl } from "@angular/material/legacy-form-field";
import moment from "moment";
import { Subject, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { minDate as validatorMinDate, maxDate as validatorMaxDate } from "class-validator";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives";
import {
	StarkDateInput,
	StarkDatePickerComponent,
	StarkDatePickerFilter,
	StarkDatePickerMaskConfig
} from "@nationalbankbelgium/stark-ui/src/modules/date-picker";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";

/**
 * Default TimeMask configuration
 */
export const DEFAULT_TIME_MASK_CONFIG: StarkTimestampMaskConfig = { format: "HH:mm:ss" };

/**
 * @ignore
 */
const componentName = "stark-date-time-picker";

/**
 * Component to select a date and a time together
 */
@Component({
	selector: "stark-date-time-picker",
	templateUrl: "./date-time-picker.component.html",
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: StarkDateTimePickerComponent,
			multi: true
		},
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: StarkDateTimePickerComponent
		},
		{
			// This implementation has been made thanks to the official documentation.
			// See: https://v7.material.angular.io/guide/creating-a-custom-form-field-control
			provide: MatFormFieldControl,
			useExisting: StarkDateTimePickerComponent
		}
	],
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkDateTimePickerComponent
	extends AbstractStarkUiComponent
	implements MatFormFieldControl<Date>, ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy
{
	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	private static nextId = 0;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 */
	@HostBinding()
	public id = `stark-date-time-picker${StarkDateTimePickerComponent.nextId++}`;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 */
	@HostBinding("attr.aria-describedby")
	public describedBy = "";

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 */
	@HostBinding("class.floating")
	public get shouldLabelFloat(): boolean {
		return this.focused || !this.empty;
	}

	/**
	 * Source date to bound to the DateTimePicker
	 */
	@Input()
	public get value(): Date | null {
		return this._value;
	}

	public set value(value: Date | null) {
		if (value) {
			this.dateTimeFormGroup.setValue({
				date: new Date(value.getFullYear(), value.getMonth(), value.getDate()),
				time: this.constructTimeStringFromDate(value)
			});
		}
		this._value = value;
		this.stateChanges.next();
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _value: Date | null = null;

	/**
	 * Placeholder / label for DateTimePicker
	 */
	@Input()
	public get placeholder(): string {
		return this._placeholder;
	}

	public set placeholder(value: string) {
		this.originalPlaceholder = value || "";
		// Handle translation internally because mat-form-field uses the value of `@Input public placeholder` to display the label / placeholder
		this._placeholder = this.originalPlaceholder ? this.translateService.instant(this.originalPlaceholder) : this.originalPlaceholder;
		this.stateChanges.next();
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _placeholder = "";

	/**
	 * Determines if DateTimePicker is required
	 */
	@Input()
	public get required(): boolean {
		return this._required;
	}

	public set required(value: boolean) {
		this._required = coerceBooleanProperty(value);
		if (this._required) {
			this.dateTimeFormGroup.controls["date"].setValidators([Validators.required]);
			this.dateTimeFormGroup.controls["time"].setValidators([Validators.required]);
		} else {
			this.dateTimeFormGroup.controls["date"].clearValidators();
			this.dateTimeFormGroup.controls["time"].clearValidators();
		}
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_required: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _required = false;

	/**
	 * Determines if DateTimePicker is disabled
	 */
	@Input()
	public get disabled(): boolean {
		return this._disabled;
	}

	public set disabled(value: boolean) {
		this._disabled = coerceBooleanProperty(value);

		if (this._disabled) {
			this.dateTimeFormGroup.disable();
		} else {
			this.dateTimeFormGroup.enable();
		}
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _disabled = false;

	/**
	 * Mask for the time
	 */
	@Input()
	public get timeMask(): StarkTimestampMaskConfig {
		return this._timeMask;
	}

	public set timeMask(value: StarkTimestampMaskConfig) {
		// only valid mask configs are accepted, otherwise the default mask is used
		// eslint-disable-next-line no-prototype-builtins
		this._timeMask = value && value.hasOwnProperty("format") ? value : DEFAULT_TIME_MASK_CONFIG;
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _timeMask: StarkTimestampMaskConfig = DEFAULT_TIME_MASK_CONFIG;

	/**
	 * Input for {@link StarkDatePickerComponent}
	 */
	@Input()
	public pickerId = "";

	/**
	 * Input for {@link StarkDatePickerComponent}
	 */
	@Input()
	public pickerName = "";

	/**
	 * Input for {@link StarkDatePickerComponent}
	 */
	@Input()
	public dateFilter?: StarkDatePickerFilter;

	/**
	 * Input for {@link StarkDatePickerComponent}
	 */
	@Input()
	public dateMask?: StarkDatePickerMaskConfig;

	/**
	 * Input for {@link StarkDatePickerComponent}
	 */
	@Input()
	public set max(value: moment.Moment | null) {
		if (value === undefined) {
			// eslint-disable-next-line no-null/no-null
			this._max = null;
		} else if (value instanceof Date) {
			this._max = moment(value);
		} else {
			this._max = value;
		}
	}

	public get max(): moment.Moment | null {
		return this._max;
	}

	// Information about input setter coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_max: StarkDateInput;

	/**
	 * @ignore
	 * Angular expects a Moment or null value.
	 */
	// eslint-disable-next-line no-null/no-null
	private _max: moment.Moment | null = null;

	/**
	 * Input for {@link StarkDatePickerComponent}
	 */
	@Input()
	public set min(value: moment.Moment | null) {
		if (value === undefined) {
			// eslint-disable-next-line no-null/no-null
			this._min = null;
		} else if (value instanceof Date) {
			this._min = moment(value);
		} else {
			this._min = value;
		}
	}

	public get min(): moment.Moment | null {
		return this._min;
	}

	// Information about input setter coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_min: StarkDateInput;

	/**
	 * @ignore
	 * Angular expects a Moment or null value.
	 */
	// eslint-disable-next-line no-null/no-null
	public _min: moment.Moment | null = null;

	/**
	 * Output that will emit a specific date whenever the selection has changed
	 */
	@Output()
	public readonly dateTimeChange = new EventEmitter<Date | null>();

	/**
	 * Reference to the time input embedded in this component
	 */
	@ViewChild("timeInput", { static: true })
	public timeInput!: ElementRef<HTMLInputElement>;

	/**
	 * Reference to the Stark date picker embedded in this component
	 */
	@ViewChild(StarkDatePickerComponent, { static: true })
	// Due to split chunks, Angular does not detect that StarkDatePickerComponent implements Validator. We need to force the recognition.
	public datePicker!: StarkDatePickerComponent & Validator;

	/**
	 * @ignore
	 * @internal
	 * The registered callback function called when an input event occurs on the input element.
	 */
	private _onChange: (_: Date | null) => void = (_: Date | null) => {
		/* noop*/
	};

	/**
	 * @ignore
	 * @internal
	 * The registered callback function called when a blur event occurs on the input element.
	 */
	private _onTouched: () => void = () => {
		/* noop*/
	};

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public ngControl: NgControl | null = null;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public controlType = componentName;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public stateChanges = new Subject<void>();

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 */
	public focused = false;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public get empty(): boolean {
		// IMPORTANT: we need to get the 'raw value' because we also need the values from the disabled controls!
		return !this.dateTimeFormGroup.getRawValue().date && !this.dateTimeFormGroup.getRawValue().time;
	}

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public get errorState(): boolean {
		// the control can be in an error state as long as one of these conditions is met:
		// 1) the user has interacted with either the datepicker or the time input
		// 2) the control is programmatically marked as 'touched' or 'dirty'
		const newErrorState =
			this.ngControl !== null &&
			this.ngControl.control !== null &&
			(this.dateTimeFormGroup.controls["date"].touched ||
				this.dateTimeFormGroup.controls["time"].touched ||
				!!this.ngControl.touched ||
				!!this.ngControl.dirty) &&
			(!!this.ngControl.invalid || !!this.datePicker.validate(this.ngControl.control));

		// IMPORTANT: emit a state change when the errorState changes
		// This is needed to force the MatFormFieldControl to refresh and render the MatError's
		if (this._errorState !== newErrorState) {
			this._errorState = newErrorState;
			this.stateChanges.next();
		}

		return this._errorState;
	}

	/**
	 * The current error state
	 * @ignore
	 * @internal
	 */
	public _errorState = false;

	/**
	 * @ignore
	 * @internal
	 * Original placeholder translation key to keep in memory to translate again when language changes.
	 */
	private originalPlaceholder = "";

	/**
	 * @ignore
	 * @internal
	 */
	private translateOnLangChangeSubscription!: Subscription;

	/**
	 * @ignore
	 */
	public dateTimeFormGroup: UntypedFormGroup;

	/**
	 * Angular validator to check whether the component's date is earlier than the given minDate
	 * @ignore
	 * @internal
	 * @param minDate - Minimum date to validate the component's current date
	 */
	private _starkMinDateValidator(minDate: Date): ValidatorFn {
		// for the minDate, we should discard the time (we set it to the minimum possible value: 00:00:00:000)
		// const normalizedMinDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
		return (_control: AbstractControl): ValidationErrors | null => {
			const controlValue = this.constructDateTime();

			return controlValue && !validatorMinDate(controlValue, minDate)
				? {
						starkMinDateTime: {
							min: minDate.toISOString(),
							actual: controlValue.toISOString()
						}
					}
				: null;
		};
	}

	/**
	 * Angular validator to check whether the component's date is earlier than the given minDate
	 * @ignore
	 * @internal
	 * @param maxDate - Maximum date to validate the component's current date
	 */
	private _starkMaxDateValidator(maxDate: Date): ValidatorFn {
		// for the maxDate, we should discard the time (we set it to the maximum possible value: 23:59:59:999)
		// const normalizedMaxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
		return (_control: AbstractControl): ValidationErrors | null => {
			const controlValue = this.constructDateTime();

			return controlValue && !validatorMaxDate(controlValue, maxDate)
				? {
						starkMaxDateTime: {
							max: maxDate.toISOString(),
							actual: controlValue.toISOString()
						}
					}
				: null;
		};
	}

	/**
	 * Default date in case no date is defined
	 */
	public defaultDate = new Date(0);

	/**
	 * Default time (in a Date object form) in case no time is defined.
	 *
	 * IMPORTANT: Although it is a Date object, only the time part will be used.
	 */
	public defaultTime = new Date(2019, 0, 1, 0, 0, 0, 0);

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param _fb - The Angular Form builder
	 * @param _fm - The Angular Material Focus Monitor service
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param matFormField - The parent MatFormField directive surrounding this component
	 * @param injector - The Injector of the application
	 * @param cdRef - Reference to the change detector attached to this component
	 * @param translateService - The `TranslateService` instance of the application.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		private _fb: FormBuilder,
		private _fm: FocusMonitor,
		elementRef: ElementRef,
		renderer: Renderer2,
		private matFormField: MatFormField,
		private injector: Injector,
		private cdRef: ChangeDetectorRef,
		private translateService: TranslateService
	) {
		super(renderer, elementRef);

		this.dateTimeFormGroup = this._fb.group({
			date: new UntypedFormControl(undefined),
			time: new UntypedFormControl(undefined)
		});

		this._fm.monitor(elementRef, true).subscribe((origin: FocusOrigin) => {
			// when the element is blurred, the emitted 'origin' is null
			if (origin === null) {
				this.dateTimeFormGroup.controls["date"].markAsTouched();
				this.dateTimeFormGroup.controls["time"].markAsTouched();
			}

			this.focused = !!origin && !this.disabled;
			this.stateChanges.next();
		});
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.ngControl = this.injector.get<NgControl>(NgControl, <any>null);

		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		// the parent node of the _connectionContainerRef is the 'div.form-field-wrapper' which defines the final width of the form field
		const parentNode: HTMLElement = this.renderer.parentNode(this.matFormField._connectionContainerRef.nativeElement);
		this.renderer.addClass(parentNode, `${componentName}-form-field-wrapper`);

		this.translateOnLangChangeSubscription = this.translateService.onLangChange.subscribe(() => {
			// re-assign the placeholder to refresh the translation (see 'placeholder' setter)
			this.placeholder = this.originalPlaceholder;
		});

		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Component lifecycle hook
	 * @param changes - Contains the changed properties
	 */
	public ngOnChanges(changes: SimpleChanges): void {
		if (changes["min"] || changes["max"]) {
			const validators: ValidatorFn[] = [];
			if (this.min) {
				validators.push(this._starkMinDateValidator(this.min.toDate()));
			}
			if (this.max) {
				validators.push(this._starkMaxDateValidator(this.max.toDate()));
			}
			this.dateTimeFormGroup.setValidators(validators);
		}

		if (changes["max"] || changes["min"] || changes["required"]) {
			this.cdRef.detectChanges();
			// IMPORTANT: the '_onValidatorChange()' callback from Validator API should not be called here to update the validity of the control because it triggers a valueChange event!
			// therefore we call 'updateValueAndValidity()' manually on the control instead and without emitting the valueChanges event :)
			if (this.ngControl && this.ngControl.control) {
				this.ngControl.control.updateValueAndValidity({ emitEvent: false });
			}
			this.stateChanges.next();
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		this.stateChanges.complete();
		this._fm.stopMonitoring(this.elementRef.nativeElement);

		if (this.translateOnLangChangeSubscription) {
			this.translateOnLangChangeSubscription.unsubscribe();
		}
	}

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public setDescribedByIds(ids: string[]): void {
		this.describedBy = ids.join(" ");
	}

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public onContainerClick(event: MouseEvent): void {
		if ((<Element>event.target).tagName.toLowerCase() !== "input") {
			this.elementRef.nativeElement.querySelector("input").focus();
		}
	}

	/**
	 * Part of {@link ControlValueAccessor} API
	 * Sets the "value" property on the input element.
	 * @ignore
	 * @internal
	 */
	public writeValue(value: Date): void {
		this.value = value;
	}

	/**
	 * Part of {@link ControlValueAccessor} API
	 * Registers a function to be called when the control value changes.
	 * @ignore
	 * @internal
	 */
	public registerOnChange(fn: (val: Date | null) => void): void {
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
		this.stateChanges.next();
	}

	/**
	 * Part of {@link Validator} API
	 * @ignore
	 * @internal
	 */
	public registerOnValidatorChange(_fn: () => void): void {
		// we don't need to keep a reference to the callback function (i.e. in a '_onValidatorChange' property)
		// because such callback, when it is called to update the validity of the control, it triggers a valueChange event too!
	}

	/**
	 * Part of {@link Validator} API
	 * @ignore
	 * @internal
	 */
	public validate(control: AbstractControl): ValidationErrors | null {
		return { ...this.datePicker.validate(control), ...this.dateTimeFormGroup.errors };
	}

	/**
	 * @ignore
	 */
	public onDateTimeChange(): void {
		const dateTime = this.constructDateTime();

		this._onTouched();
		this._onChange(dateTime);
		this.dateTimeChange.emit(dateTime);
	}

	/**
	 * Construct the date time model based on the internal form controls for date and time
	 */
	public constructDateTime(): Date | null {
		// IMPORTANT: we need to get the 'raw value' because we also need the values from the disabled controls!
		let date: Date = this.dateTimeFormGroup.getRawValue().date;
		const time = this.parseTime(this.dateTimeFormGroup.getRawValue().time);
		let dateTime: Date | null;

		if (!date && !time) {
			dateTime = null;
		} else {
			if (!date) {
				date = this.defaultDate; // default date in case no date is defined
				this.dateTimeFormGroup.controls["date"].setValue(date);
			}

			let timeValues: number[];
			if (!time) {
				timeValues = this.getTimeNumericValuesFromDate(this.defaultTime); // default time values in case no time is defined
				// IMPORTANT: when the user is manually clearing the time field, we just keep the default value internally and DON'T set the control value
				// otherwise the user will not be able to manually clear entirely the time and type another one because the field would always be reset to '00:00:00'
				if (document.activeElement !== this.timeInput.nativeElement) {
					this.dateTimeFormGroup.controls["time"].setValue(this.constructTimeStringFromDate(this.defaultTime));
				}
			} else {
				timeValues = this.getTimeNumericValuesFromDate(time);
			}

			dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...timeValues);
		}

		return dateTime;
	}

	/**
	 * Construct a time string (with the format "HH:mm:ss:SSS") from the given date
	 * @param dateTime - `Date` object
	 */
	public constructTimeStringFromDate(dateTime: Date): string {
		return [`0${dateTime.getHours()}`, `0${dateTime.getMinutes()}`, `0${dateTime.getSeconds()}`, `00${dateTime.getMilliseconds()}`]
			.map((timePart: string, index: number) => {
				const numberOfChars = index === 3 ? 3 : 2; // for milliseconds 3 chars should be taken
				return timePart.substring(timePart.length - numberOfChars);
			})
			.join(":");
	}

	/**
	 * Return an array with the numeric values of the time part of the given date
	 * @param dateTime - `Date` object
	 */
	public getTimeNumericValuesFromDate(dateTime: Date): number[] {
		return [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds(), dateTime.getMilliseconds()];
	}

	/**
	 * @ignore
	 */
	private parseTime(timeValue: string = ""): Date | null {
		const time = moment(timeValue, this.timeMask.format);
		return time.isValid() ? time.toDate() : null;
	}

	/**
	 * Focus the time input field
	 * @param event - The handled event
	 */
	public focusTimeInput(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		this.timeInput.nativeElement.focus();
	}

	/**
	 * Clears the values of the internal form controls for date and time
	 */
	public clearDateTime(): void {
		this.dateTimeFormGroup.reset();
		this._onTouched();
		this._onChange(null);
		this.dateTimeChange.emit(null);
	}
}
