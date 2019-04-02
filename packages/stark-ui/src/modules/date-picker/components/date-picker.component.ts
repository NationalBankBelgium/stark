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
	Type,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from "@angular/material/datepicker";
import moment from "moment";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NgControl, ValidationErrors, Validator } from "@angular/forms";
import { isStarkTimestampMaskConfig, StarkTimestampMaskConfig } from "../../input-mask-directives";
import { MAT_DATE_FORMATS, MatDateFormats } from "@angular/material/core";
import { MatFormFieldControl } from "@angular/material/form-field";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { Subject, Subscription } from "rxjs";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { TranslateService } from "@ngx-translate/core";
import isEqual from "lodash-es/isEqual";

/**
 * Type expected by `dateFilter` @Input.
 */
export type StarkDatePickerFilter = "OnlyWeekends" | "OnlyWeekdays" | ((date: Date) => boolean) | undefined;

/**
 * Type expected by `maskConfig` @Input.
 */
export type StarkDatePickerMaskConfig = StarkTimestampMaskConfig | boolean | undefined;

/**
 * Default DateMask configuration
 */
export const DEFAULT_DATE_MASK_CONFIG: StarkTimestampMaskConfig = { format: "DD/MM/YYYY" };

/**
 * Name of the component
 */
const componentName: string = "stark-date-picker";

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
			// See: https://material.angular.io/guide/creating-a-custom-form-field-control
			provide: MatFormFieldControl,
			useExisting: StarkDatePickerComponent
		}
	]
})
export class StarkDatePickerComponent extends AbstractStarkUiComponent
	implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator, MatFormFieldControl<Date> {
	public static nextId: number = 0;

	@HostBinding()
	public id: string = `stark-date-picker-input-${StarkDatePickerComponent.nextId++}`;

	@HostBinding("attr.aria-describedby")
	public describedBy: string = "";

	@HostBinding("class.floating")
	public get shouldLabelFloat(): boolean {
		return this.focused || !this.empty;
	}

	/**
	 * Filter function or a string
	 * Whenever this value is changed, we set the dateFilter
	 */
	@Input()
	public get dateFilter(): StarkDatePickerFilter {
		return this._dateFilter;
	}

	public set dateFilter(value: StarkDatePickerFilter) {
		this._dateFilter = value;
		if (this._dateFilter === "OnlyWeekends") {
			this._dateFilter = this.filterOnlyWeekends;
		} else if (this._dateFilter === "OnlyWeekdays") {
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
	 * If `true` is passed, the default mask config is applied: {DEFAULT_DATE_MASK_CONFIG|DEFAULT_DATE_MASK_CONFIG}
	 * If `false` is passed or if `dateMask` is not present, the directive is disabled.
	 * If a `StarkTimestampMaskConfig` is passed, it is set as the date mask config.
	 */
	@Input()
	public dateMask: StarkDatePickerMaskConfig;

	/**
	 * Whether the datepicker is disabled
	 */
	@Input()
	public disabled: boolean;

	/**
	 * Maximum date of the date picker
	 */
	@Input()
	public max: Date;

	/**
	 * Minimum date of the date picker
	 */
	@Input()
	public min: Date;

	/**
	 * id attribute of the form field wrapping the mat-datepicker
	 * id attribute followed by "-input" of the mat-datepicker-input
	 */
	@Input()
	public pickerId: string = "";

	/**
	 * HTML "name" attribute of the element.
	 */
	@Input()
	public pickerName: string = "";

	/**
	 * Placeholder to be displayed in the datepicker
	 * Dynamically translated via the @ngx-translate service if the provided text is defined in the translation keys).
	 */
	@Input()
	public placeholder: string;

	/**
	 * If the date-picker is required or not. by default, the date-picker is not required
	 */
	@Input()
	public required: boolean;

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
		this.cdRef.detectChanges();
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _value: Date | null;

	/**
	 * Output that will emit a specific date whenever the selection has changed
	 */
	@Output()
	public dateChange: EventEmitter<Date | undefined> = new EventEmitter<Date | undefined>();

	/**
	 * Output that will emit a specific date whenever the input has changed
	 */
	@Output()
	public dateInput: EventEmitter<Date | undefined> = new EventEmitter<Date | undefined>();

	/**
	 * Reference to the MatDatepicker embedded in this component
	 */
	@ViewChild(MatDatepicker)
	public picker: MatDatepicker<moment.Moment>;

	/**
	 * Reference to the MatDatepickerInput embedded in this component
	 */
	@ViewChild(MatDatepickerInput)
	public pickerInput: MatDatepickerInput<moment.Moment>;

	/**
	 * @ignore
	 * @internal
	 */
	public inputMaskEnabled: boolean = false;

	/**
	 * @ignore
	 * @internal
	 */
	public dateMaskConfig?: StarkTimestampMaskConfig = undefined;

	/**
	 * @ignore
	 * @internal
	 */
	// tslint:disable-next-line:no-null-keyword
	public ngControl: NgControl | null = null;

	/**
	 * Variable to define to use MatFormFieldControl.
	 * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
	 * needs to run change detection.
	 */
	public stateChanges: Subject<void> = new Subject<void>();

	/**
	 * @ignore
	 * @internal
	 */
	public focused: boolean = false;

	/**
	 * Variable to define to use MatFormFieldControl
	 * Whether the control is in an error state.
	 */
	public get errorState(): boolean {
		return (
			this.ngControl !== null &&
			this.ngControl.control !== null &&
			(!!this.ngControl.errors || !!this.pickerInput.validate(this.ngControl.control))
		);
	}

	/**
	 * Variable to define to use MatFormFieldControl
	 * Whether the control is empty.
	 */
	public get empty(): boolean {
		return !this.value;
	}

	/**
	 * @ignore
	 * @internal
	 * Original placeholder translation key to keep in memory to translate again when language changes.
	 */
	private originalPlaceholder: string = "";

	/**
	 * @ignore
	 * @internal
	 */
	private translateOnLangChangeSubscription: Subscription;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 * @param cdRef - Reference to the change detector attached to this component
	 * @param dateFormats - Reference to the date formats provided to MAT_DATE_FORMATS
	 * @param fm - The Focus Monitor Service
	 * @param injector - The Injector of the application
	 * @param translateService - The Translate Service of the application
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
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");

		// tslint:disable-next-line:no-null-keyword
		this.ngControl = this.injector.get<NgControl>(<Type<NgControl>>NgControl, <any>null);

		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		this.translateOnLangChangeSubscription = this.translateService.onLangChange.subscribe(() => {
			// Handle translation internally because mat-form-field uses the value of `@Input public placeholder` to display the label / placeholder
			this.placeholder = this.originalPlaceholder
				? this.translateService.instant(this.originalPlaceholder)
				: this.originalPlaceholder;
			this.stateChanges.next();
		});
		
		super.ngOnInit();
	}

	/**
	 * Component lifecycle hook
	 */
	// tslint:disable-next-line:cognitive-complexity
	public ngOnChanges(changes: SimpleChanges): void {
		if ((changes["max"] || changes["min"]) && this.max < this.min) {
			this.logger.error(
				componentName + ": min date [" + this.min.toDateString() + "] cannot be after max date [" + this.max.toDateString() + "]"
			);
		}

		if (changes["max"] || changes["min"] || changes["required"]) {
			this.stateChanges.next();
			this.cdRef.detectChanges();
			this._onValidatorChange();
		}
		
		if (changes["placeholder"]) {
			this.originalPlaceholder = changes["placeholder"].currentValue || "";
			// Handle translation internally because mat-form-field uses the value of `@Input public placeholder` to display the label / placeholder
			this.placeholder = this.originalPlaceholder
				? this.translateService.instant(this.originalPlaceholder)
				: this.originalPlaceholder;
			this.stateChanges.next();
		}

		if (changes["dateMask"]) {
			if (isStarkTimestampMaskConfig(changes["dateMask"].currentValue)) {
				// only valid configs will be passed to the mask directive
				this.dateMaskConfig = changes["dateMask"].currentValue;
			} else if (typeof changes["dateMask"].currentValue !== "object") {
				this.dateMaskConfig = coerceBooleanProperty(changes["dateMask"].currentValue) ? DEFAULT_DATE_MASK_CONFIG : undefined;
			} else {
				throw new Error(
					componentName + ": the provided dateMask is not of type `StarkDatePickerMaskConfig`. Please provide a correct value."
				);
			}

			if (this.dateMaskConfig) {
				const dateInputFormats: string[] =
					this.dateFormats.parse.dateInput instanceof Array
						? this.dateFormats.parse.dateInput
						: [this.dateFormats.parse.dateInput];

				const isValidParser: boolean = dateInputFormats.some((format: string) =>
					moment("01-12-10", format).isSame(moment("01-12-10", (<StarkTimestampMaskConfig>this.dateMaskConfig).format), "day")
				);

				if (!isValidParser) {
					throw new Error(
						componentName +
							': dateMask.format ["' +
							this.dateMaskConfig.format +
							'"] and provided dateFormats ["' +
							dateInputFormats.join('","') +
							'"] are NOT compatible. Please adapt one of them.'
					);
				}
			}
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
	 * The registered callback function called when an input event occurs on the input element.
	 */
	private _onChange: (_: any) => void = (_: any) => {
		/*noop*/
	};

	/**
	 * @ignore
	 * The registered callback function called when a blur event occurs on the input element.
	 */
	private _onTouched: () => void = () => {
		/*noop*/
	};

	/**
	 * The registered callback function called when the validator inputs change.
	 */
	private _onValidatorChange: () => void = () => {
		/*noop*/
	};

	/**
	 * Registers a function called when the control value changes.
	 *
	 * @param fn The callback function
	 */
	public registerOnChange(fn: (_: any) => void): void {
		this._onChange = fn;
	}

	/**
	 * Registers a function called when the control is touched.
	 *
	 * @param fn The callback function
	 */
	public registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	/**
	 * Sets the "disabled" property on the input element.
	 *
	 * @param isDisabled The disabled value
	 */
	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
		this.stateChanges.next();
		this._onValidatorChange();
	}

	/**
	 * Sets the "value" property on the input element.
	 *
	 * @param obj The checked value
	 */
	public writeValue(obj: any): void {
		this.value = obj;
	}

	/**
	 * Method implemented to use MatFormFieldControl
	 * Sets the list of element IDs that currently describe this control.
	 * @param ids - Ids describing the MatFormFieldControl
	 */
	public setDescribedByIds(ids: string[]): void {
		this.describedBy = ids.join(" ");
	}

	/**
	 * Method implemented to use MatFormFieldControl
	 * It handles a click on the control's container.
	 * @param event - Click Event
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
	 * Registers a callback function to call when the validator inputs change.
	 *
	 * @param fn - The callback function
	 */
	public registerOnValidatorChange(fn: () => void): void {
		this._onValidatorChange = fn;
	}

	/**
	 * Method that performs synchronous validation against the provided control.
	 *
	 * @param control - The control to validate against.
	 *
	 * @returns A map of validation errors if validation fails, otherwise null.
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
	public dateFilterFnWrapper = (momentDate: moment.Moment): boolean => {
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

		// tslint:disable-next-line:no-null-keyword
		this.value = event.value ? event.value.toDate() : null;

		const value: Date | undefined = this.value ? this.value : undefined;
		this.dateChange.emit(value);
		this._onChange(value);
		this._onValidatorChange();
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
	public getTimestampMaskConfig(): StarkDatePickerMaskConfig {
		if (this.inputMaskEnabled) {
			return this.dateMaskConfig;
		}
		return undefined;
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
