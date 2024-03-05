import {
	AfterViewInit,
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
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from "@angular/material/datepicker";
import moment from "moment";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NgControl, ValidationErrors, Validator } from "@angular/forms";
import { MAT_DATE_FORMATS, MatDateFormats } from "@angular/material/core";
import { MatLegacyFormFieldControl as MatFormFieldControl } from "@angular/material/legacy-form-field";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { TranslateService } from "@ngx-translate/core";
import { Subject, Subscription } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { isStarkTimestampMaskConfig, StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";
import isEqual from "lodash-es/isEqual";

/**
 * Type expected by [StarkDatePickerComponent dateFilter]{@link StarkDatePickerComponent#dateFilter} input.
 */
export type StarkDatePickerFilter = "OnlyWeekends" | "OnlyWeekdays" | ((date: Date) => boolean);

/**
 * Type expected by [StarkDatePickerComponent maskConfig]{@link StarkDatePickerComponent#maskConfig} input.
 */
export type StarkDatePickerMaskConfig = StarkTimestampMaskConfig | boolean;

/**
 * Type expected by [StarkDatePickerComponent max]{@link StarkDatePickerComponent#max} and
 * [StarkDatePickerComponent min]{@link StarkDatePickerComponent#min} inputs.
 */
export type StarkDateInput = Date | moment.Moment | null | undefined;

/**
 * Default date mask configuration used by the {@link StarkDatePickerComponent}
 */
export const DEFAULT_DATE_MASK_CONFIG: StarkTimestampMaskConfig = { format: "DD/MM/YYYY" };

/**
 * @ignore
 */
const componentName = "stark-date-picker";

/**
 * Component to display the stark date-picker
 */
@Component({
	selector: "stark-date-picker",
	templateUrl: "./date-picker.component.html",
	encapsulation: ViewEncapsulation.None,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		// The `mat-form-field-flex` class is necessary to apply `mat-form-field` styles on this date-picker component.
		class: componentName + " mat-form-field-flex"
	},
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: StarkDatePickerComponent,
			multi: true
		},
		{
			// This implementation has been made thanks to the official documentation.
			// See: https://v7.material.angular.io/guide/creating-a-custom-form-field-control
			provide: MatFormFieldControl,
			useExisting: StarkDatePickerComponent
		}
	]
})
export class StarkDatePickerComponent
	extends AbstractStarkUiComponent
	implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor, Validator, MatFormFieldControl<Date>
{
	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public static nextId = 0;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 */
	@HostBinding()
	public id = `stark-date-picker-input-${StarkDatePickerComponent.nextId++}`;

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
	 * Filter function or a string
	 * Whenever this value is changed, we set the dateFilter
	 */
	@Input()
	public get dateFilter(): StarkDatePickerFilter | undefined {
		return this._dateFilter;
	}

	public set dateFilter(value: StarkDatePickerFilter | undefined) {
		this._dateFilter = value;
		if (this._dateFilter === "OnlyWeekends") {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			this._dateFilter = this.filterOnlyWeekends;
		} else if (this._dateFilter === "OnlyWeekdays") {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			this._dateFilter = this.filterOnlyWeekdays;
		}
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _dateFilter?: StarkDatePickerFilter;

	/**
	 * Timestamp Mask Configuration to apply on the date-picker.
	 * - If `true` is passed, the default mask config is applied: {@link DEFAULT_DATE_MASK_CONFIG}
	 * - If `false` is passed or if `dateMask` is not present, the directive is disabled.
	 * - If a {@link StarkTimestampMaskConfig} is passed, it is set as the date mask config.
	 */
	@Input()
	public set dateMask(value: StarkDatePickerMaskConfig) {
		if (isStarkTimestampMaskConfig(value)) {
			// only valid configs will be passed to the mask directive
			this.dateMaskConfig = value;
		} else if (typeof value !== "object") {
			this.dateMaskConfig = coerceBooleanProperty(value) ? DEFAULT_DATE_MASK_CONFIG : undefined;
		} else {
			throw new Error(
				componentName + ": the provided dateMask is not of type `StarkDatePickerMaskConfig`. Please provide a correct value."
			);
		}

		if (isStarkTimestampMaskConfig(this.dateMaskConfig)) {
			const dateInputFormats: string[] =
				this.dateFormats.parse.dateInput instanceof Array ? this.dateFormats.parse.dateInput : [this.dateFormats.parse.dateInput];

			const isValidParser: boolean = dateInputFormats.some((format: string) =>
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				moment("01-12-10", format).isSame(moment("01-12-10", this.dateMaskConfig!.format), "day")
			);

			if (!isValidParser) {
				throw new Error(
					componentName +
						': dateMask.format ["' +
						this.dateMaskConfig.format +
						'"] and the provided parse format(s) in MAT_DATE_FORMATS ["' +
						dateInputFormats.join('","') +
						'"] are NOT compatible. Please adapt one of them.'
				);
			}
		}
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_dateMask: BooleanInput | StarkDatePickerMaskConfig;

	/**
	 * Whether the datepicker is disabled
	 */
	@Input()
	public get disabled(): boolean {
		return this._disabled;
	}

	public set disabled(value: boolean) {
		this._disabled = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_disabled: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _disabled = false;

	/**
	 * Maximum date of the date picker
	 *
	 * Supported types: `Date | moment.Moment | undefined | null`
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
	 * Minimum date of the date picker
	 *
	 * Supported types: `Date | moment.Moment | undefined | null`
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
	 * The HTML `id` attribute of the date picker's calendar popup.
	 * This id is also used, suffixed with `"-input"`, as the HTML `id` attribute of the date picker's input field.
	 */
	@Input()
	public pickerId = "";

	/**
	 * HTML `name` attribute of the element.
	 */
	@Input()
	public pickerName = "";

	/**
	 * Placeholder to be displayed in the datepicker.
	 * This is dynamically translated via the @ngx-translate service if the provided text is defined in the translation keys).
	 */
	@Input()
	public set placeholder(value: string) {
		this.originalPlaceholder = value || "";
		// Handle translation internally because mat-form-field uses the value of `@Input public placeholder` to display the label / placeholder
		this._placeholder = this.originalPlaceholder ? this.translateService.instant(this.originalPlaceholder) : this.originalPlaceholder;
		this.stateChanges.next();
	}

	public get placeholder(): string {
		return this._placeholder;
	}

	/**
	 * @ignore
	 */
	private _placeholder = "";

	/**
	 * If the date-picker is required or not.
	 *
	 * Default: `false` (the date-picker is not required)
	 */
	@Input()
	public get required(): boolean {
		return this._required;
	}

	public set required(value: boolean) {
		this._required = coerceBooleanProperty(value);
	}

	// Information about boolean coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	public static ngAcceptInputType_required: BooleanInput;

	/**
	 * @ignore
	 * @internal
	 */
	private _required = false;

	/**
	 * Source Date to be bound to the datepicker model
	 */
	@Input()
	public get value(): Date | null {
		return this._value;
	}

	public set value(value: Date | null) {
		if (!isEqual(this._value, value)) {
			this._value = value;
			this.stateChanges.next();
		}
	}

	/**
	 * @ignore
	 * @internal
	 */
	// eslint-disable-next-line no-null/no-null
	private _value: Date | null = null;

	/**
	 * Output that will emit a specific date whenever the selection has changed
	 */
	@Output()
	public readonly dateChange = new EventEmitter<Date | undefined>();

	/**
	 * Output that will emit a specific date whenever the input has changed
	 */
	@Output()
	public readonly dateInput = new EventEmitter<Date | undefined>();

	/**
	 * Reference to the MatDatepicker embedded in this component
	 */
	@ViewChild(MatDatepicker, { static: true })
	public picker!: MatDatepicker<moment.Moment>;

	/**
	 * Reference to the MatDatepickerInput embedded in this component
	 */
	@ViewChild(MatDatepickerInput, { static: true })
	public pickerInput!: MatDatepickerInput<moment.Moment>;

	/**
	 * @ignore
	 * @internal
	 */
	public inputMaskEnabled = false;

	/**
	 * @ignore
	 * @internal
	 */
	public dateMaskConfig?: StarkTimestampMaskConfig = undefined;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	// eslint-disable-next-line no-null/no-null
	public ngControl: NgControl | null = null;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public stateChanges: Subject<void> = new Subject<void>();

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public focused = false;

	/**
	 * @ignore
	 * @internal
	 */
	public pickerInputTouched = false;

	/**
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public get errorState(): boolean {
		// the control can be in an error state as long as one of these conditions is met:
		// 1) the user has interacted with it
		// 2) the control is programmatically marked as 'touched' or 'dirty'
		const newErrorState =
			// eslint-disable-next-line no-null/no-null
			this.ngControl !== null &&
			// eslint-disable-next-line no-null/no-null
			this.ngControl.control !== null &&
			(this.pickerInputTouched || !!this.ngControl.touched || !!this.ngControl.dirty) &&
			(!!this.ngControl.errors || !!this.pickerInput.validate(this.ngControl.control));

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
	 * Part of {@link MatFormFieldControl} API
	 * @ignore
	 * @internal
	 */
	public get empty(): boolean {
		return !this.value;
	}

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
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 * @param cdRef - Reference to the change detector attached to this component
	 * @param dateFormats - Reference to the date formats provided to MAT_DATE_FORMATS
	 * @param fm - The Focus Monitor Service
	 * @param injector - The Injector of the application
	 * @param translateService - The `TranslateService` instance of the application.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		renderer: Renderer2,
		elementRef: ElementRef<HTMLElement>,
		private cdRef: ChangeDetectorRef,
		@Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
		private fm: FocusMonitor,
		private injector: Injector,
		private translateService: TranslateService
	) {
		super(renderer, elementRef);

		fm.monitor(elementRef, true).subscribe((origin: FocusOrigin) => {
			this.focused = !!origin && !this.disabled;
			this.stateChanges.next();
		});
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		// eslint-disable-next-line no-null/no-null
		this.ngControl = this.injector.get<NgControl>(NgControl, <any>null);

		// eslint-disable-next-line no-null/no-null
		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		this.translateOnLangChangeSubscription = this.translateService.onLangChange.subscribe(() => {
			// re-assign the placeholder to refresh the translation (see 'placeholder' setter)
			this.placeholder = this.originalPlaceholder;
		});

		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Component lifecycle hook
	 */
	public ngAfterViewInit(): void {
		const markPickerInputAsTouched = (): void => {
			this.pickerInputTouched = true;
			this.stateChanges.next();
		};

		// the picker input should be marked as touched when it has actually been touched or when the calendar is closed
		// this way we ensure that the errors are displayed properly when the user interacted with the picker (and not when the picker is pristine)
		this.pickerInput.registerOnTouched(markPickerInputAsTouched);
		this.picker.closedStream.subscribe(markPickerInputAsTouched);
	}

	/**
	 * Component lifecycle hook
	 * @param changes - Contains the changed properties
	 */
	public ngOnChanges(changes: SimpleChanges): void {
		if ((changes["max"] || changes["min"]) && this.max && this.min && this.max.isSameOrBefore(this.min)) {
			this.logger.error(
				componentName +
					": min date [" +
					this.min.format(DEFAULT_DATE_MASK_CONFIG.format) +
					"] cannot be after max date [" +
					this.max.format(DEFAULT_DATE_MASK_CONFIG.format) +
					"]"
			);
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
		this.fm.stopMonitoring(this.elementRef.nativeElement);

		if (this.translateOnLangChangeSubscription) {
			this.translateOnLangChangeSubscription.unsubscribe();
		}
	}

	/**
	 * @ignore
	 * @internal
	 * The registered callback function called when an input event occurs on the input element.
	 */
	private _onChange: (_: any) => void = (_: any): void => {
		/* noop*/
	};

	/**
	 * @ignore
	 * @internal
	 * The registered callback function called when a blur event occurs on the input element.
	 */
	private _onTouched: () => void = (): void => {
		/* noop*/
	};

	/**
	 * Part of {@link ControlValueAccessor} API
	 * Registers a function to be called when the control value changes.
	 * @ignore
	 * @internal
	 */
	public registerOnChange(fn: (_: any) => void): void {
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
	 * Part of {@link ControlValueAccessor} API
	 * Sets the "value" property on the input element.
	 * @ignore
	 * @internal
	 */
	public writeValue(obj: any): void {
		this.value = obj;
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
			const inputElement: HTMLElement = this.elementRef.nativeElement.querySelector("input");
			if (inputElement) {
				inputElement.focus();
			}
		}
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
		return this.pickerInput.validate(control);
	}

	/**
	 * Wrap the dateFilter function
	 * We use the MomentDateModule, so the MatDatepicker will return a moment.Moment object.
	 * To keep consistency with the old code, the end user should be able to specify a custom dateFilter accepting a Date object as a parameter
	 * @param momentDate - The date to be checked
	 * @returns Whether the date is filtered or not
	 */
	public dateFilterFnWrapper = (momentDate: moment.Moment | null): boolean => {
		// eslint-disable-next-line no-null/no-null
		if (momentDate === null) {
			return false;
		}
		const date: Date = momentDate.toDate();
		if (typeof this._dateFilter === "function") {
			return this._dateFilter(date);
		}
		return true;
	};

	/**
	 * Filter only the weekend days
	 * @param date - The date to be checked
	 * @returns Whether the date is a weekend day or not
	 */
	public filterOnlyWeekends(date: Date): boolean {
		const day: number = date.getDay();
		return day === 0 || day === 6;
	}

	/**
	 * Filter only the week days
	 * @param date - The date to be checked
	 * @returns Whether the date is a week day or not
	 */
	public filterOnlyWeekdays(date: Date): boolean {
		const day: number = date.getDay();
		return day !== 0 && day !== 6;
	}

	/**
	 * Handled when a `change` event is fired on the `<input [matDatepicker]="picker">` element, then emits on `dateChange`.
	 * @param event - The MatDatepickerInputEvent to re-emit
	 */
	public onDateChange(event: MatDatepickerInputEvent<moment.Moment>): void {
		this._onTouched();

		// eslint-disable-next-line no-null/no-null
		this.value = event.value ? event.value.toDate() : null;

		const value: Date | undefined = this.value ? this.value : undefined;
		this._onChange(value);
		// emit after the model has actually changed
		this.dateChange.emit(value);
	}

	/**
	 * Handled when an `input` event is fired on this `<input [matDatepicker]="picker">` element, then emits the `dateInput`.
	 * @param event - The MatDatepickerInputEvent to re-emit
	 */
	public onDateInput(event: MatDatepickerInputEvent<moment.Moment>): void {
		const value: Date | undefined = event.value ? event.value.toDate() : undefined;
		this.dateInput.emit(value);
	}

	/**
	 * Get the `starkTimestampMask` configuration.
	 * If the inputMask is not enabled, it returns `undefined` to disable `starkTimestampMask`.
	 * Otherwise, it returns the defined configuration.
	 */
	public getTimestampMaskConfig(): StarkTimestampMaskConfig | undefined {
		return this.inputMaskEnabled ? this.dateMaskConfig : undefined;
	}

	/**
	 * Method triggered when the date-picker input is focused.
	 * This method changes the displayed value to make the starkTimestampInput directive working and enables the directive.
	 *
	 * @param focusEvent - The focus event
	 */
	public onFocus(focusEvent: FocusEvent): void {
		// FIXME Investigate this later.
		// Is there a way built-in in Angular Material to do this ?
		if (this.dateMaskConfig && focusEvent.target && focusEvent.target instanceof HTMLInputElement) {
			const focusValue: string | null = focusEvent.target.value;
			if (focusValue) {
				focusEvent.target.value = moment(focusValue, this.dateFormats.display.dateInput).format(this.dateMaskConfig.format);
			}
		}

		this.inputMaskEnabled = true;
	}

	/**
	 * Method triggered when the date-picker input is blurred.
	 * This method disables the starkTimestampInput directive.
	 */
	public onBlur(): void {
		this.inputMaskEnabled = false;
	}
}
