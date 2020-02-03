import {
	AfterContentInit,
	Component,
	ContentChild,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import { StarkSearchFormComponent } from "../../classes";
import {
	StarkFormButton,
	StarkFormCustomizablePredefinedButton,
	StarkFormDefaultPredefinedButton,
	StarkGenericSearchActionBarConfig,
	StarkGenericSearchFormButtonsConfig
} from "../../entities";
import {
	StarkAction,
	StarkActionBarConfig,
	StarkCustomizablePredefinedAction,
	StarkDefaultPredefinedAction
} from "../../../action-bar/components";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { FormGroup } from "@angular/forms";
import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from "@angular/animations";
import { AbstractStarkUiComponent } from "../../../../common/classes/abstract-component";
import isEqual from "lodash-es/isEqual";

/**
 * Name of the component
 */
const componentName = "stark-generic-search";

/**
 * @ignore
 */
declare type UnusedLabelProps = "labelActivated" | "labelSwitchFunction";

/**
 * @ignore
 */
declare type UnusedIconProps = "iconActivated" | "iconSwitchFunction";

/**
 * @ignore
 */
declare type StarkDefaultPredefinedActionBarGenericAction = Required<
	Pick<StarkDefaultPredefinedAction, Exclude<keyof StarkDefaultPredefinedAction, UnusedLabelProps | UnusedIconProps>>
> &
	Pick<StarkDefaultPredefinedAction, UnusedIconProps>;

/**
 * @ignore
 */
declare type StarkCustomizablePredefinedActionBarGenericAction = Required<
	Pick<StarkCustomizablePredefinedAction, Exclude<keyof StarkCustomizablePredefinedAction, UnusedLabelProps | UnusedIconProps>>
> &
	Partial<Pick<StarkCustomizablePredefinedAction, UnusedIconProps>>;

/**
 * @ignore
 */
interface StarkGenericSearchActionBarConfigRequired extends StarkGenericSearchActionBarConfig, StarkActionBarConfig {
	search: StarkDefaultPredefinedActionBarGenericAction;
	new: StarkCustomizablePredefinedActionBarGenericAction;
	reset: StarkCustomizablePredefinedActionBarGenericAction;
}

/**
 * @ignore
 */
interface StarkGenericSearchFormButtonsConfigRequired extends StarkGenericSearchFormButtonsConfig {
	search: Required<StarkFormDefaultPredefinedButton>;
	new: Required<StarkFormCustomizablePredefinedButton>;
	reset: Required<StarkFormCustomizablePredefinedButton>;
	custom: StarkFormButton[];
}

/**
 * @ignore
 */
const formAnimations: AnimationTriggerMetadata = trigger("collapse", [
	state("closed", style({ opacity: 0, height: 0 })),
	transition("* <=> closed", animate(400))
]);

/**
 * Component to display a generic search form with an action bar and form buttons for these actions:
 *
 * - New: emits in the newTriggered event emitter
 * - Search: emits in the searchTriggered event emitter
 * - Reset: emits in the resetTriggered event emitter
 *
 * **IMPORTANT:** In the HTML, the component defining the search form content should be exported as `searchForm`
 * so that it is accessible from the Stark Generic Search component.
 * See [Angular: Template reference variables](https://angular.io/guide/template-syntax#template-reference-variables--var-)
 *
 * @example
 * <stark-generic-search formHtmlId="demo-generic-search-form"
 *                       (searchTriggered)="onSearch($event)"
 *                       (resetTriggered)="onReset($event)"
 *                       [isFormHidden]="hideSearch">
 *       							<!-- your search form component should be exported as 'searchForm' -->
 *                    <your-search-form-component #searchForm
 *                               [searchCriteria]="workingCopy"
 *                               (workingCopyChanged)="updateWorkingCopy($event)">
 *                    </your-search-form-component>
 * </stark-generic-search>
 */
@Component({
	selector: "stark-generic-search",
	templateUrl: "./generic-search.component.html",
	animations: [formAnimations],
	encapsulation: ViewEncapsulation.None,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkGenericSearchComponent extends AbstractStarkUiComponent implements OnInit, OnChanges, AfterContentInit {
	/**
	 * Configuration object for the action bar to be shown above the generic form
	 */
	@Input()
	public formActionBarConfig?: StarkGenericSearchActionBarConfig;

	/**
	 * Configuration object for the buttons to be shown in the generic form
	 */
	@Input()
	public formButtonsConfig?: StarkGenericSearchFormButtonsConfig;

	/**
	 * Whether the search form should be hidden. Default: false
	 */
	@Input()
	public isFormHidden = false;

	/**
	 * HTML id of action bar component.
	 */
	@Input()
	public formHtmlId = "stark-generic-search-form";

	/**
	 * Whether the search form should be hidden once the search is triggered.
	 * Default: false
	 */
	@Input()
	public hideOnSearch = false;

	/**
	 * Callback function to be called when the "New" button is clicked (in case it is shown)
	 */
	@Output()
	public readonly newTriggered = new EventEmitter<void>();

	/**
	 * Callback function to be called when the "Reset" button is clicked.
	 * The form model object is passed as parameter to this function.
	 */
	@Output()
	public readonly resetTriggered = new EventEmitter<FormGroup>();

	/**
	 * Callback function to be called when the "Search" button is clicked.
	 * The form model object is passed as parameter to this function.
	 */
	@Output()
	public readonly searchTriggered = new EventEmitter<FormGroup | undefined>();

	/**
	 * Callback function to be called when the visibility of the generic form changes.
	 * A boolean is passed as parameter to indicate whether the generic form is visible or not.
	 */
	@Output()
	public readonly formVisibilityChanged = new EventEmitter<boolean>();

	/**
	 * Reference to the child search form component. Such component is looked up by the `searchForm` template reference variable.
	 *
	 * Therefore, the child search form component should be exported as `searchForm`.
	 *
	 * See https://angular.io/guide/template-syntax#template-reference-variables--var- for more info about template reference variables.
	 */
	@ContentChild("searchForm", { static: true })
	public searchFormComponent!: StarkSearchFormComponent<unknown>;

	/**
	 * Configuration object for the the {@link StarkActionBarComponent} to be shown in the search form.
	 */
	public actionBarConfig: StarkActionBarConfig = { actions: [] };

	/**
	 * Object containing normalized options that will be used to generate config for the the {@link StarkActionBarComponent}
	 * to be shown in the search form.
	 */
	public normalizedFormActionBarConfig!: StarkGenericSearchActionBarConfigRequired;

	/**
	 * Object containing normalized options for the different buttons to be shown in the search form.
	 */
	public normalizedFormButtonsConfig!: StarkGenericSearchFormButtonsConfigRequired;

	/**
	 * Reference to the FormGroup instance bound to the search form.
	 *
	 * In the HTML, the component defining the search form content should be exported as `searchForm`
	 * so that it is accessible from the Stark Generic Search component. See example above.
	 */
	public get genericForm(): FormGroup {
		return this.searchFormComponent.searchForm;
	}

	/**
	 * Class constructor
	 * @param logger - The logger of the application.
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngAfterContentInit(): void {
		if (!this.searchFormComponent) {
			throw new Error("StarkGenericSearchComponent: the searchForm content child is required.");
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.normalizedFormButtonsConfig = this.normalizeFormButtonsConfig(this.formButtonsConfig);
		this.normalizedFormActionBarConfig = this.normalizeFormActionBarConfig(this.formActionBarConfig);
		this.actionBarConfig = this.buildActionBarConfig(this.normalizedFormActionBarConfig);

		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnChanges(changesObj: SimpleChanges): void {
		if (
			changesObj["formButtonsConfig"] &&
			!changesObj["formButtonsConfig"].isFirstChange() &&
			!isEqual(this.formButtonsConfig, this.normalizedFormButtonsConfig)
		) {
			this.normalizedFormButtonsConfig = this.normalizeFormButtonsConfig(this.formButtonsConfig);
		}

		if (
			changesObj["formActionBarConfig"] &&
			!changesObj["formActionBarConfig"].isFirstChange() &&
			!isEqual(this.formActionBarConfig, this.normalizedFormActionBarConfig)
		) {
			this.normalizedFormActionBarConfig = this.normalizeFormActionBarConfig(this.formActionBarConfig);
			this.actionBarConfig = this.buildActionBarConfig(this.normalizedFormActionBarConfig);
		}
	}

	/**
	 * Normalize the form buttons config
	 * Set a default value for each property of each button if there is no value defined
	 * @param config - Form buttons configuration
	 */
	public normalizeFormButtonsConfig(config?: StarkGenericSearchFormButtonsConfig): StarkGenericSearchFormButtonsConfigRequired {
		config = config || {};

		/**
		 * @ignore
		 */
		function normalizeButtonConfig(
			buttonConfig: StarkFormCustomizablePredefinedButton,
			defaultConfig: Required<StarkFormCustomizablePredefinedButton>
		): Required<StarkFormCustomizablePredefinedButton> {
			return {
				icon: typeof buttonConfig.icon !== "undefined" ? buttonConfig.icon : defaultConfig.icon,
				label: typeof buttonConfig.label !== "undefined" ? buttonConfig.label : defaultConfig.label,
				isEnabled: typeof buttonConfig.isEnabled !== "undefined" ? buttonConfig.isEnabled : defaultConfig.isEnabled,
				isVisible: typeof buttonConfig.isVisible !== "undefined" ? buttonConfig.isVisible : defaultConfig.isVisible,
				className: typeof buttonConfig.className !== "undefined" ? buttonConfig.className : defaultConfig.className,
				buttonColor: typeof buttonConfig.buttonColor !== "undefined" ? buttonConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		/**
		 * @ignore
		 */
		function normalizeDefaultButtonConfig(
			buttonConfig: StarkFormDefaultPredefinedButton,
			defaultConfig: Required<StarkFormDefaultPredefinedButton>
		): Required<StarkFormDefaultPredefinedButton> {
			return {
				icon: typeof buttonConfig.icon !== "undefined" ? buttonConfig.icon : defaultConfig.icon,
				label: typeof buttonConfig.label !== "undefined" ? buttonConfig.label : defaultConfig.label,
				isEnabled: typeof buttonConfig.isEnabled !== "undefined" ? buttonConfig.isEnabled : defaultConfig.isEnabled,
				className: typeof buttonConfig.className !== "undefined" ? buttonConfig.className : defaultConfig.className,
				buttonColor: typeof buttonConfig.buttonColor !== "undefined" ? buttonConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		// set default values
		const normalizedConfig: StarkGenericSearchFormButtonsConfigRequired = {
			search: {
				icon: "",
				label: "STARK.ICONS.SEARCH",
				isEnabled: true,
				className: "mat-raised-button",
				buttonColor: "primary"
			},
			new: {
				icon: "",
				label: "STARK.ICONS.NEW_ITEM",
				isEnabled: true,
				isVisible: true,
				className: "mat-stroked-button",
				buttonColor: "primary"
			},
			reset: {
				icon: "",
				label: "STARK.ICONS.RESET",
				isEnabled: true,
				isVisible: true,
				className: "mat-stroked-button",
				buttonColor: "primary"
			},
			custom: []
		};

		if (config.search) {
			normalizedConfig.search = normalizeDefaultButtonConfig(config.search, normalizedConfig.search);
		}

		if (config.new) {
			normalizedConfig.new = normalizeButtonConfig(config.new, normalizedConfig.new);
		}

		if (config.reset) {
			normalizedConfig.reset = normalizeButtonConfig(config.reset, normalizedConfig.reset);
		}

		if (config.custom !== undefined) {
			normalizedConfig.custom = config.custom;
		}

		return normalizedConfig;
	}

	/**
	 * Normalize the form action bar config
	 * Set a default value for each property of each action if there is no value defined
	 * @param config - Form action bar configuration
	 */
	public normalizeFormActionBarConfig(config?: StarkGenericSearchActionBarConfig): StarkGenericSearchActionBarConfigRequired {
		config = config || { actions: [] };

		/**
		 * @ignore
		 */
		function normalizeDefaultActionConfig(
			actionConfig: StarkDefaultPredefinedAction,
			defaultConfig: StarkDefaultPredefinedActionBarGenericAction
		): StarkDefaultPredefinedActionBarGenericAction {
			return {
				icon: typeof actionConfig.icon !== "undefined" ? actionConfig.icon : defaultConfig.icon,
				label: typeof actionConfig.label !== "undefined" ? actionConfig.label : defaultConfig.label,
				isEnabled: typeof actionConfig.isEnabled !== "undefined" ? actionConfig.isEnabled : defaultConfig.isEnabled,
				iconActivated: actionConfig.iconActivated,
				iconSwitchFunction: actionConfig.iconSwitchFunction,
				className: typeof actionConfig.className !== "undefined" ? actionConfig.className : defaultConfig.className,
				buttonColor: typeof actionConfig.buttonColor !== "undefined" ? actionConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		/**
		 * @ignore
		 */
		function normalizeActionConfig(
			actionConfig: StarkCustomizablePredefinedAction,
			defaultConfig: StarkCustomizablePredefinedActionBarGenericAction
		): StarkCustomizablePredefinedActionBarGenericAction {
			return {
				icon: typeof actionConfig.icon !== "undefined" ? actionConfig.icon : defaultConfig.icon,
				label: typeof actionConfig.label !== "undefined" ? actionConfig.label : defaultConfig.label,
				isEnabled: typeof actionConfig.isEnabled !== "undefined" ? actionConfig.isEnabled : defaultConfig.isEnabled,
				isVisible: typeof actionConfig.isVisible !== "undefined" ? actionConfig.isVisible : defaultConfig.isVisible,
				iconActivated: actionConfig.iconActivated,
				iconSwitchFunction: actionConfig.iconSwitchFunction,
				className: typeof actionConfig.className !== "undefined" ? actionConfig.className : defaultConfig.className,
				buttonColor: typeof actionConfig.buttonColor !== "undefined" ? actionConfig.buttonColor : defaultConfig.buttonColor
			};
		}

		// set default values
		const normalizedConfig: StarkGenericSearchActionBarConfigRequired = {
			search: {
				icon: "magnify",
				label: "STARK.ICONS.SEARCH",
				isEnabled: true,
				className: "",
				buttonColor: "primary"
			},
			new: {
				icon: "note-plus",
				label: "STARK.ICONS.NEW_ITEM",
				isEnabled: true,
				isVisible: true,
				className: "",
				buttonColor: "primary"
			},
			reset: {
				icon: "undo",
				label: "STARK.ICONS.RESET",
				isEnabled: true,
				isVisible: true,
				className: "",
				buttonColor: "primary"
			},
			actions: [],
			isPresent: true // action bar is present by default, should be explicitly set to false to remove it
		};

		if (config.search) {
			normalizedConfig.search = normalizeDefaultActionConfig(config.search, normalizedConfig.search);
		}

		if (config.new) {
			normalizedConfig.new = normalizeActionConfig(config.new, normalizedConfig.new);
		}

		if (config.reset) {
			normalizedConfig.reset = normalizeActionConfig(config.reset, normalizedConfig.reset);
		}

		if (config.actions !== undefined) {
			normalizedConfig.actions = config.actions;
		}

		if (config.isPresent !== undefined) {
			normalizedConfig.isPresent = config.isPresent;
		}

		return normalizedConfig;
	}

	/**
	 * Build the action bar config object based on the searchFormActionBarConfig object and set the action calls to emit
	 * values through the defined Output
	 * @param searchFormActionBarConfig - Form action bar configuration
	 */
	public buildActionBarConfig(searchFormActionBarConfig: StarkGenericSearchActionBarConfigRequired): StarkActionBarConfig {
		// TODO: replace this code with a Type to convert all optional props to required
		// see https://github.com/JakeGinnivan/TypeScript-Handbook/commit/a02ef7023f2fb513dc35d8de35be23b926ec82e3
		const predefinedSearchAction: StarkDefaultPredefinedActionBarGenericAction = searchFormActionBarConfig.search;
		const actionSearch: StarkAction = {
			label: predefinedSearchAction.label,
			icon: predefinedSearchAction.icon,
			buttonColor: predefinedSearchAction.buttonColor,
			isEnabled: predefinedSearchAction.isEnabled,
			iconActivated: predefinedSearchAction.iconActivated,
			iconSwitchFunction: predefinedSearchAction.iconSwitchFunction,
			className: predefinedSearchAction.className,
			id: "search-action-bar",
			isVisible: true,
			actionCall: (): void => {
				this.searchTriggered.emit(this.genericForm);
			}
		};

		const predefinedResetAction: StarkCustomizablePredefinedAction = <StarkCustomizablePredefinedAction>searchFormActionBarConfig.reset;
		const actionReset: StarkAction = {
			label: <string>predefinedResetAction.label,
			icon: <string>predefinedResetAction.icon,
			isEnabled: <boolean>predefinedResetAction.isEnabled,
			isVisible: <boolean>predefinedResetAction.isVisible,
			iconActivated: predefinedResetAction.iconActivated,
			iconSwitchFunction: predefinedResetAction.iconSwitchFunction,
			className: predefinedResetAction.className,
			id: "undo-action-bar",
			actionCall: (): void => {
				if (this.resetTriggered) {
					this.resetTriggered.emit(this.genericForm);
				}
			}
		};

		const predefinedNewAction: StarkCustomizablePredefinedAction = <StarkCustomizablePredefinedAction>searchFormActionBarConfig.new;
		const actionNew: StarkAction = {
			label: <string>predefinedNewAction.label,
			icon: <string>predefinedNewAction.icon,
			isEnabled: <boolean>predefinedNewAction.isEnabled,
			isVisible: <boolean>predefinedNewAction.isVisible,
			iconActivated: predefinedNewAction.iconActivated,
			iconSwitchFunction: predefinedNewAction.iconSwitchFunction,
			className: predefinedNewAction.className,
			id: "new-action-bar",
			actionCall: (): void => {
				if (this.newTriggered) {
					this.newTriggered.emit();
				}
			}
		};

		return {
			isPresent: searchFormActionBarConfig.isPresent,
			actions: [actionNew, actionSearch, actionReset, ...searchFormActionBarConfig.actions]
		};
	}

	/**
	 * Emit the form through "searchTriggered" event emitter then hide the search form based on hideOnSearch variable
	 */
	public triggerSearch(): void {
		this.searchTriggered.emit(this.genericForm);
		if (this.hideOnSearch) {
			this.hideForm();
		}
	}

	/**
	 * Hide the search form and emit a boolean through formVisibilityChanged event emitter that indicates if the search is displayed
	 */
	public hideForm(): void {
		if (!this.isFormHidden) {
			this.isFormHidden = true;

			// by the moment, the callback is called only when the form is hidden
			this.formVisibilityChanged.emit(!this.isFormHidden);
		}
	}

	/**
	 * @ignore
	 */
	public trackItemFn(formButton: StarkFormButton): string {
		return formButton.id;
	}
}
