/*tslint:disable:trackBy-function*/
import { StarkBreadcrumbPath } from "./breadcrumb-path.intf";
import { StarkBreadcrumbConfig } from "./breadcrumb-config.intf";
import { Component, HostBinding, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import {
	STARK_ROUTING_SERVICE,
	StarkRoutingService,
	STARK_LOGGING_SERVICE,
	StarkLoggingService,
	StarkRoutingTransitionHook
} from "@nationalbankbelgium/stark-core";

/**
 * Name of the component
 */
const componentName: string = "stark-breadcrumb";

/**
 * Component to display the breadcrumb of the view where it is included.
 */
@Component({
	selector: "stark-breadcrumb",
	templateUrl: "./breadcrumb.component.html"
})
export class StarkBreadcrumbComponent implements OnInit, OnDestroy {
	/**
	 * Adds class="stark-breadcrumb" attribute on the host component
	 */
	@HostBinding("class")
	public class: string = componentName;

	/**
	 * object containing an array of StarkBreadcrumbPath objects with the following data:
	 *
	 *  - path: the URL defined for the state
	 *  - state: the name of the state that will be navigated to
	 *  - stateParams: the params needed for the state
	 *  - translationKey: the key used to translate the label of the specific path. If empty, the path will be taken instead
	 *
	 * If omitted, then the StarkBreadcrumbConfig object will calculated processing recursively the UI router state tree from the
	 * current state to its ancestors to extract the different paths. In this case, the translationKey will be taken from the
	 * "data" object of the state definition.
	 *
	 * The breadcrumbConfig parameter is a one-way binding (one-directional, optional)
	 */
	@Input()
	public breadcrumbConfig?: StarkBreadcrumbConfig;

	public transitionHookDeregisterFn: Function;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService
	) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		// if there is not config provided, then it will be automatically constructed based on the router state tree
		if (typeof this.breadcrumbConfig === "undefined") {
			this.breadcrumbConfig = { breadcrumbPaths: this.getPathsFromStateTree() };
			// then refresh the config after every successful transition
			this.transitionHookDeregisterFn = this.routingService.addTransitionHook(StarkRoutingTransitionHook.ON_SUCCESS, {}, () => {
				this.breadcrumbConfig = { breadcrumbPaths: this.getPathsFromStateTree() };
				console.log("breadcrumb: this.breadcrumbConfig  ->  ", this.breadcrumbConfig);
			});
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		if (this.transitionHookDeregisterFn) {
			this.transitionHookDeregisterFn();
		}
	}

	/**
	 * Generate the breadcrumb path elements out of the current router state tree.
	 * From the current child state up to the root parent
	 */
	public getPathsFromStateTree(): StarkBreadcrumbPath[] {
		const statePaths: StarkBreadcrumbPath[] = [];

		const stateTreeParams: Map<string, any> = this.routingService.getStateTreeParams();

		stateTreeParams.forEach((stateParams: any, stateName: string) => {
			const stateTranslationKey: string = this.routingService.getTranslationKeyFromState(stateName);

			const breadcrumbPath: StarkBreadcrumbPath = {
				id: "breadcrumb-path-" + stateName.toLowerCase(),
				state: stateName,
				stateParams: stateParams,
				translationKey: stateTranslationKey
			};
			statePaths.unshift(breadcrumbPath); // added to the start of the array because we go in the reverse way
		});

		return statePaths;
	}

	/**
	 * Method used to handle the click on a link in the breadcrumb component
	 * @param StarkBreadcrumbPath - breadcrumbPath on which the click was performed
	 */
	public breadcrumbClickHandler(breadcrumbPath: StarkBreadcrumbPath): void {
		this.routingService.navigateTo(breadcrumbPath.state, breadcrumbPath.stateParams);
	}
}
