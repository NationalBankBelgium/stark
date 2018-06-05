import { Component, Inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";

/**
 * Name of the component
 */
const componentName: string = "stark-app-logo";

// FIXME: tslint rules temporarily disabled. Enable them once we decide the final implementation of component styles
/* tslint:disable:enforce-component-selector use-view-encapsulation use-host-property-decorator */
@Component({
	selector: componentName,
	templateUrl: "./app-logo.component.html",
	encapsulation: ViewEncapsulation.None,
	host: { class: "stark-app-logo" }
})
/* tslint:enable */
/**
 * Component to display the application's logo
 */
export class StarkAppLogoComponent implements OnInit {
	/**
	 * Params object to be passed to the UI router state defined as homeState.
	 */
	@Input() public homeStateParams?: { [property: string]: any };

	/**
	 * Class constructor
	 * @param logger : the logger of the application
	 * @param routingService : the routing service of the application
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService
	) {
		// empty constructor
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
	}

	/**
	 * Handles the event when a click is made on the logo
	 * @param $event: the handled event
	 */
	public logoClickHandler($event: Event): void {
		// cancel the event otherwise Angular triggers a full page reload :(
		$event.preventDefault();
		this.routingService.navigateToHome(this.homeStateParams);
	}
}
