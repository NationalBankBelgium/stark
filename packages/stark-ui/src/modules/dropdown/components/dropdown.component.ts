import {
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
	Optional,
	Output,
	Renderer2,
	SimpleChanges,
	Type,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NgControl, ValidationErrors, Validator, Validators } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { MatFormField, MatFormFieldControl } from "@angular/material/form-field";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { TranslateService } from "@ngx-translate/core";
import isEqual from "lodash-es/isEqual";

/**
 * Name of the component
 */
const componentName = "stark-dropdown";

/**
 * Component to display dropdown list based on the options passed as parameters. The dropdown component is based
 * on the Angular Material MatSelect.
 */
@Component({
	selector: "stark-dropdown",
	templateUrl: "./dropdown.component.html",
	encapsulation: ViewEncapsulation.None,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	},
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: StarkDropdownComponent,
			multi: true
		},
		{
			// This implementation has been made thanks to the official documentation.
			// See: https://material.angular.io/guide/creating-a-custom-form-field-control
			provide: MatFormFieldControl,
			useExisting: StarkDropdownComponent
		}
	]
})
export class StarkDropdownComponent extends AbstractStarkUiComponent
	implements OnInit, OnChanges, OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<any | any[]>, Validator {
	public static nextId = 0;

	@HostBinding()
	public id = `stark-dropdown-input-${StarkDropdownComponent.nextId++}`;

	@HostBinding("attr.aria-describedby")
	public describedBy = "";

	@HostBinding("class.floating")
	public get shouldLabelFloat(): boolean {
		return this.focused || !this.empty;
	}

	/**
	 * If the dropdown will contain a default blank (optional)
	 */
	@Input()
	public defaultBlank?: boolean;

	/**
	 * HTML "id" attribute of the element.
	 */
	@Input()
	public dropdownId = "undefined";

	/**
	 * HTML "name" attribute of the element.
	 */
	@Input()
	public dropdownName = "undefined";

	/**
	 * header Text to be displayed as the dropdown's header. Such header will be shown at the top of the
	 * dropdown options list(dynamically translated via the $translate service if the provided text is defined in the translation keys).
	 */
	// TODO re-enable once a solution for the replacement of md-select-header as been found
	// @Input()
	// public header?: string;

	/**
	 * Whether the dropdown is disabled
	 */
	@Input()
	public disabled = false;

	/**
	 * Allows multiple option selection. Setting the attribute to "true" or empty
	 * will enable this feature. (optional)
	 */
	@Input()
	public multiSelect = false;

	/**
	 * Array of options to be included in the dropdown list. This parameter is a one-way
	 * binding (one-directional).
	 */
	@Input()
	public options: any[] = [];

	/**
	 * Property name to be used as id of the options defined. If this parameter as
	 * well as the optionLabelProperty are omitted, then the options parameter is considered to be an array of simple types. (optional)
	 */
	@Input()
	public optionIdProperty?: string;

	/**
	 * Property name to be used as label of the options defined (dynamically translated via
	 * the @ngx-translate service if the provided text is defined in the translation keys). If this parameter as well as the
	 * optionIdProperty are omitted, then the options parameter is considered to be an array of simple types. (optional)
	 */
	@Input()
	public optionLabelProperty?: string;

	/**
	 * Text to be displayed as the dropdown's placeholder.
	 * Dynamically translated via the @ngx-translate service if the provided text is defined in the translation keys.
	 */
	@Input()
	public placeholder = "";

	/**
	 * If the dropdown is required or not. by default, the dropdown is not required
	 */
	@Input()
	public required = false;

	/**
	 * Source object to be bound to the dropdown ngModel.
	 */
	@Input()
	public get value(): any | any[] {
		return this._value;
	}

	public set value(value: any | any[]) {
		if (!isEqual(this._value, value)) {
			this._value = value;
			this.stateChanges.next();
		}
	}

	/**
	 * @ignore
	 * @internal
	 */
	private _value: any | any[];

	/**
	 * This will emit the newly selected value.
	 */
	@Output()
	public readonly selectionChanged = new EventEmitter<any>();

	/**
	 * Reference to the single MatSelect element embedded in this component
	 */
	@ViewChild("singleSelect", { static: true })
	private singleSelectElement?: MatSelect;

	/**
	 * Reference to the multi MatSelect element embedded in this component
	 */
	@ViewChild("multiSelect", { static: true })
	private multiSelectElement?: MatSelect;

	/**
	 * @ignore
	 * @internal
	 */
	public optionsAreSimpleTypes?: boolean;

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
	public focused = false;

	/**
	 * Variable to define to use MatFormFieldControl
	 * Whether the control is in an error state.
	 */
	public get errorState(): boolean {
		/**
		 * We decided to handle errors only when ngControl is defined, thanks to a `formControl` or an `NgModel`.
		 * Otherwise, we're able to switch the state to "error" and display the `alert` color on the mat-form-field.
		 * But there is no way for the developer to detect there is an error coming from the `stark-dropdown` and display an error message.
		 */
		return (
			!!this.ngControl &&
			(!!this.ngControl.touched || !!this.ngControl.dirty) &&
			(!!this.ngControl.invalid || (this.ngControl.control !== null && !!this.validate(this.ngControl.control)))
		);
	}

	/**
	 * Variable to define to use MatFormFieldControl
	 * Whether the control is empty.
	 */
	public get empty(): boolean {
		return !this.value || (this.multiSelect && !this.value.length);
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
	private translateOnLangChangeSubscription?: Subscription;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 * @param fm - The Focus Monitor Service
	 * @param injector - The Injector of the application
	 * @param formField - The MatFormField of this component
	 * @param translateService - The Translate Service of the application
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef,
		private fm: FocusMonitor,
		private injector: Injector,
		@Optional() private formField: MatFormField,
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
		this.optionsAreSimpleTypes = this.areSimpleTypes();

		// tslint:disable-next-line:no-null-keyword
		this.ngControl = this.injector.get<NgControl>(<Type<NgControl>>NgControl, <any>null);

		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}

		if (this.formField) {
			/**
			 * Add class on the parent mat-form-field tag
			 * `mat-form-field-type-mat-select` - class to apply the elliptic effect and other styles for mat-select from mat-form-field
			 * `stark-dropdown-mat-form-field` - class to control the parent mat-form-field
			 * `stark-color` - class to set a the input color
			 */
			this.formField._elementRef.nativeElement.classList.add("mat-form-field-type-mat-select", "stark-dropdown-mat-form-field");

			if (this.color) {
				this.formField._elementRef.nativeElement.classList.add(`stark-${this.color}`);
			}
		}

		this.translateOnLangChangeSubscription = this.translateService.onLangChange.subscribe(() => {
			// Handle translation internally because mat-form-field uses the value of `@Input public placeholder` to display the label / placeholder
			this.placeholder = this.originalPlaceholder
				? this.translateService.instant(this.originalPlaceholder)
				: this.originalPlaceholder;
			this.stateChanges.next();
		});

		this.setDefaultBlank();
		super.ngOnInit();
	}

	/**
	 * Component lifecycle hook
	 */
	// tslint:disable-next-line:cognitive-complexity cyclomatic-complexity
	public ngOnChanges(changes: SimpleChanges): void {
		if (changes["optionIdProperty"] || changes["optionLabelProperty"]) {
			this.optionsAreSimpleTypes = this.areSimpleTypes();
		}

		if (changes["multiSelect"]) {
			// This avoids an error when switching between "simple select" and "multiple select"
			if (!changes["multiSelect"].isFirstChange()) {
				this.onInternalValueChange(undefined);
			}
			this.multiSelect = coerceBooleanProperty(changes["multiSelect"].currentValue);
		}

		if (changes["required"]) {
			this.required = coerceBooleanProperty(changes["required"].currentValue);
			this.setDefaultBlank();
			this.stateChanges.next();
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
	 * Handled when a `change` event is fired on the `<mat-select>` element, then emits the value on `selectionChanged`.
	 * @param change - The MatSelectChange to to handle
	 */
	public onSelectionChange(change: MatSelectChange): void {
		this.onInternalValueChange(change.value);
	}

	/**
	 * Trigger required methods `selectionChanged.emit`, `_onChange`, `_onValidatorChange` when `value´ is changed internally.
	 * @param value - New value to assign
	 */
	public onInternalValueChange(value: any | any[]): void {
		this.value = value;

		this.selectionChanged.emit(this.value);
		this._onChange(this.value);
		this._onValidatorChange();
	}

	/**
	 * Whether the type of the option elements is a primitive type (string, number, boolean...)
	 * In case none of the optionId and optionLabel parameters are provided, then a simple data types array is assumed
	 */
	public areSimpleTypes(): boolean {
		return !(
			typeof this.optionIdProperty !== "undefined" &&
			this.optionIdProperty !== "" &&
			typeof this.optionLabelProperty !== "undefined" &&
			this.optionLabelProperty !== ""
		);
	}

	/**
	 * set blank by default in the dropdown component
	 */
	public setDefaultBlank(): void {
		// defaultBlank is by default false, you should explicitly set to true to add it
		if (!this.defaultBlank) {
			this.defaultBlank = false;
		}
		// if dropdown is required you should not be able to select blank
		if (this.required) {
			this.defaultBlank = false;
		}
	}

	/**
	 * Return the id of the option or the option itself if it is a simple type.
	 * @param option - the option which id we want to retrieve
	 * @returns the value to return
	 */
	public getOptionValue(option: any): any {
		return this.optionsAreSimpleTypes ? option : option[<string>this.optionIdProperty];
	}

	/**
	 * Return the label of the option or the option itself if it is a simple type.
	 * @param option - the option which value we want to retrieve
	 * @returns the value to return
	 */
	public getOptionLabel(option: any): any {
		const optionLabel: string = this.optionsAreSimpleTypes ? option : option[<string>this.optionLabelProperty];
		return optionLabel.toString(); // IMPORTANT: the label should be a STRING otherwise the translate directive fails
	}

	/**
	 * @ignore
	 */
	public trackItemFn(_index: number, item: any): string {
		// FIXME: cannot call areSimpleTypes() from the component since this track function gets no context
		return item;
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
	 */
	public onContainerClick(): void {
		// Mimic implementation of MatSelect: https://github.com/angular/components/blob/master/src/material/select/select.ts
		if (!!this.singleSelectElement) {
			this.singleSelectElement.focus();
			this.singleSelectElement.open();
		} else if (!!this.multiSelectElement) {
			this.multiSelectElement.focus();
			this.multiSelectElement.open();
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
		// tslint:disable-next-line:no-null-keyword
		return this.required ? Validators.required(control) : null;
	}

	/**
	 * Method which set the MatFormField as touched once the mat-select has been clicked.
	 */
	public onOpenedChange(): void {
		this._onTouched();
	}
}
