/*tslint:disable:template-use-track-by-function*/
import { StarkBreadcrumbPath } from "./breadcrumb-path.intf";
import { StarkBreadcrumbConfig } from "./breadcrumb-config.intf";
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewEncapsulation
} from "@angular/core";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	StarkLoggingService,
	StarkRoutingService,
	StarkRoutingTransitionHook
} from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * @ignore
 */
const componentName = "stark-breadcrumb";

/**
 * Component to display the breadcrumb of the view where it is included.
 */
@Component({
	selector: "stark-breadcrumb",
	templateUrl: "./breadcrumb.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkBreadcrumbComponent extends AbstractStarkUiComponent implements OnInit, OnDestroy {
	/**
	 * An {@link StarkBreadcrumbConfig} configuration object for the breadcrumb paths to be displayed.
	 *
	 * If omitted, then the {@link StarkBreadcrumbConfig} object will be calculated processing recursively the router state tree from the
	 * current state to its ancestors to extract the different paths.
	 *
	 * In this case, the translationKey will be taken from the `data` object of the state definition.
	 */
	@Input()
	public breadcrumbConfig?: StarkBreadcrumbConfig;

	/**
	 * @ignore
	 * @internal
	 */
	public deregisterTransitionHook: () => void = () => {
		/*noop*/
	};

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param routingService - The `StarkRoutingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		// if there is not config provided, then it will be automatically constructed based on the router state tree
		if (typeof this.breadcrumbConfig === "undefined") {
			this.breadcrumbConfig = { breadcrumbPaths: this.getPathsFromStateTree() };
			// then refresh the config after every successful transition
			this.deregisterTransitionHook = this.routingService.addTransitionHook(StarkRoutingTransitionHook.ON_SUCCESS, {}, () => {
				this.breadcrumbConfig = { breadcrumbPaths: this.getPathsFromStateTree() };
			});
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		this.deregisterTransitionHook();
	}

	/**
	 * Generate the breadcrumb path elements out of the current router state tree.
	 * From the current child state up to the root parent
	 */
	public getPathsFromStateTree(): StarkBreadcrumbPath[] {
		const stateTreeParams = this.routingService.getStateTreeParams();
		return (
			// convert Map<string,any> to Array<[string,any]>
			Array.from(stateTreeParams)
				// Transform values into StarkBreadcrumbPath
				.map(
					([stateName, stateParams]: [string, any]): StarkBreadcrumbPath => ({
						id: `breadcrumb-path-${stateName.toLowerCase()}`,
						state: stateName,
						stateParams: stateParams,
						translationKey: this.routingService.getTranslationKeyFromState(stateName)
					})
				)
				// Reverse the array
				.reverse()
		);
	}

	/**
	 * Method used to handle the click on a link in the breadcrumb component
	 * @param breadcrumbPath - StarkBreadcrumbPath on which the click was performed
	 */
	public breadcrumbClickHandler(breadcrumbPath: StarkBreadcrumbPath): void {
		this.routingService.navigateTo(breadcrumbPath.state, breadcrumbPath.stateParams);
	}
}
