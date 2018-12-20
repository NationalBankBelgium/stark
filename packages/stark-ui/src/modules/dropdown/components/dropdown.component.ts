import {
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { StarkComponentUtil, StarkFormUtil } from "../../../util";
import { FormControl, Validators } from "@angular/forms";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { Subscription } from "rxjs";

/**
 * @ignore
 */
const _isEqual: Function = require("lodash/isEqual");

/**
 * Name of the component
 */
const componentName: string = "stark-dropdown";

/**
 * Warning message for reactive form issue
 */
const reactiveWarningMessage: string =
	componentName + ': When dropdownFormControl is set, "value", "selectionChanged" and "isDisabled" should not be defined.';

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
	}
})
export class StarkDropdownComponent extends AbstractStarkUiComponent implements OnInit, OnChanges, OnInit, OnDestroy {
	/**
	 * If the dropdown will contain a default blank (optional)
	 */
	@Input()
	public defaultBlank?: boolean;

	/**
	 * FormControl object to be used in the dropdown.
	 */
	@Input()
	public dropdownFormControl?: FormControl;

	/**
	 * HTML "id" attribute of the element.
	 */
	@Input()
	public dropdownId: string;

	/**
	 * HTML "name" attribute of the element.
	 */
	@Input()
	public dropdownName: string;

	/**
	 * header Text to be displayed as the dropdown's header. Such header will be shown at the top of the
	 * dropdown options list(dynamically translated via the $translate service if the provided text is defined in the translation keys).
	 */
	// TODO reenable once a solution for the replacement of md-select-header as been found
	// @Input()
	// public header?: string;
	/**
	 * Whether the dropdown is disabled (optional)
	 */
	@Input()
	public isDisabled?: boolean = false;

	/**
	 * Allows multiple option selection. Setting the attribute to "true" or empty
	 * will enable this feature. (optional)
	 */
	@Input()
	public multiSelect?: string;

	/**
	 * Array of options to be included in the dropdown list. This parameter is a one-way
	 * binding (one-directional).
	 */
	@Input()
	public options: any[];

	/**
	 * Property name to be used as id of the options defined. If this parameter as
	 * well as the optionLabelProperty are omitted, then the options parameter is considered to be an array of simple types. (optional)
	 */
	@Input()
	public optionIdProperty?: string;

	/**
	 * Property name to be used as label of the options defined (dynamically translated via
	 * the $translate service if the provided text is defined in the translation keys). If this parameter as well as the
	 * optionIdProperty are omitted, then the options parameter is considered to be an array of simple types. (optional)
	 */
	@Input()
	public optionLabelProperty?: string;

	/**
	 * Text to be displayed as the dropdown's placeholder (dynamically translated via the $translate
	 * service if the provided text is defined in the translation keys).
	 */
	@Input()
	public placeholder: string;

	/**
	 * If the dropdown is required or not. by default, the dropdown is not required
	 */
	@Input()
	public required: boolean = false;

	/**
	 * Source object to be bound to the dropdown ngModel.
	 */
	@Input()
	public value?: any | any[];

	/**
	 * This will emit the newly selected value.
	 */
	@Output()
	public selectionChanged?: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Whether the multiple row selection is enabled.
	 */
	public isMultiSelectEnabled: boolean = false;

	/**
	 * @ignore
	 * @internal
	 */
	public optionsAreSimpleTypes: boolean;

	/**
	 * @ignore
	 */
	public formControl: FormControl;

	/**
	 * @ignore
	 * @internal
	 */
	private formControlSubscription: Subscription;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");
		this.optionsAreSimpleTypes = this.areSimpleTypes();

		if (StarkFormUtil.isFormControl(this.dropdownFormControl)) {
			this.formControl = this.dropdownFormControl;
		} else {
			const isDisabled: boolean = this.isDisabled || false;
			this.formControl = new FormControl(
				{ value: this.value, disabled: isDisabled },
				this.required ? [Validators.required] : []
			);

			this.formControlSubscription = this.formControl.valueChanges
				.pipe(
					filter((value: any) => value !== null),
					distinctUntilChanged()
				)
				.subscribe((value: any) => {
					if (this.selectionChanged) {
						this.selectionChanged.emit(value);
					}
				});
		}

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
			this.isMultiSelectEnabled = StarkComponentUtil.isInputEnabled(this.multiSelect);
		}

		if (changes["isDisabled"]) {
			if (StarkFormUtil.isFormControl(this.dropdownFormControl)) {
				this.logger.warn(reactiveWarningMessage);
			}

			if (StarkFormUtil.isFormControl(this.formControl)) {
				if (this.isDisabled) {
					this.formControl.disable();
				} else {
					this.formControl.enable();
				}
			}
		}

		if (changes["required"]) {
			this.setDefaultBlank();
			if (
				!changes["required"].firstChange &&
				!StarkFormUtil.isFormControl(this.dropdownFormControl) &&
				StarkFormUtil.isFormControl(this.formControl)
			) {
				if (this.required) {
					this.formControl.setValidators([Validators.required]);
				} else {
					// If we want to remove only one validator, we can follow the implementation proposed on stackoverflow.
					// See: https://stackoverflow.com/questions/46488078/angular-4-remove-required-validator-conditionally
					this.formControl.clearValidators();
				}

				this.formControl.updateValueAndValidity();
			}
		}

		if (changes["value"]) {
			if (StarkFormUtil.isFormControl(this.dropdownFormControl)) {
				this.logger.warn(reactiveWarningMessage);
			}

			if (
				!changes["value"].firstChange &&
				StarkFormUtil.isFormControl(this.formControl) &&
				!_isEqual(this.formControl.value, this.value)
			) {
				this.formControl.setValue(this.value);
			}
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		if (typeof this.formControlSubscription !== "undefined") {
			this.formControlSubscription.unsubscribe();
		}
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
}
