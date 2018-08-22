import {Component, HostBinding, Inject, Input, OnInit, ViewEncapsulation} from "@angular/core";

import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_APP_CONFIG,
	StarkLoggingService,
	StarkRoutingService,
	StarkApplicationConfig,
	STARK_SESSION_SERVICE,
	StarkSessionService
} from "@nationalbankbelgium/stark-core";

/**
 * Name of the component
 */
const componentName: string = "stark-app-logout";

/**
 * Component to display the application's logout button
 */
@Component({
	selector: "stark-app-logout",
	templateUrl: "./app-logout.component.html",
	encapsulation: ViewEncapsulation.None
})
export class StarkAppLogoutComponent implements OnInit {
	/**
	 * Adds class="stark-app-logout" attribute on the host component
	 */
	@HostBinding("class")
	public class: string = componentName;
	
	/**
	 * Desired icon of the logout button
	 */
	@Input()
	public icon: "power" | string = "power";

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param routingService - The routing service of the application
	 * @param sessionService - The session service of the application
	 * @param appConfig - The configuration of the application
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Inject(STARK_APP_CONFIG) public appConfig: StarkApplicationConfig
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
	 * Handles the event when a click is made on the logout button
	 */
	public logout(): void {
		this.sessionService.logout();
		this.routingService.navigateTo(this.appConfig.homeStateName); // TODO change this to the correct logout url (when available)
	}
}
