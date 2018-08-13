import { Component, HostBinding, Inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";

/**
 * Name of the component
 */
const componentName: string = "stark-app-logo";

/**
 * Component to display the application's logo
 */
@Component({
	selector: "stark-app-logo",
	templateUrl: "./app-logo.component.html",
	encapsulation: ViewEncapsulation.None
})
export class StarkAppLogoComponent implements OnInit {
	/**
	 * Adds class="stark-app-logo" attribute on the host component
	 */
	@HostBinding("class")
	public class: string = componentName;

	/**
	 * Params object to be passed to the UI router state defined as homeState.
	 */
	@Input()
	public homeStateParams?: { [property: string]: any };

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param routingService - The routing service of the application
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
		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Handles the event when a click is made on the logo
	 * @param $event - The handled event
	 */
	public logoClickHandler($event: Event): void {
		// cancel the event otherwise Angular triggers a full page reload :(
		$event.preventDefault();
		this.routingService.navigateToHome(this.homeStateParams);
	}
}
