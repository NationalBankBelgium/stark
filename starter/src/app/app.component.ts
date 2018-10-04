/**
 * Angular 2 decorators and services
 */
import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";
import { StarkMenuConfig, STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarService } from "@nationalbankbelgium/stark-ui";

/**
 * App Component
 * Top Level Component
 */
@Component({
	selector: "app",
	templateUrl: "./app.component.html"
})
/**
 * AppComponent file
 */
export class AppComponent implements OnInit {
	/**
	 * Name of the project
	 */
	public name: string = "Stark Starter";

	/**
	 * App menu configuration
	 */
	public mainMenu: StarkMenuConfig;

	public constructor(
		@Inject(STARK_APP_SIDEBAR_SERVICE) public sidebarService: StarkAppSidebarService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService
	) {}

	/**
	 * Triggered on the component's initialization
	 */
	public ngOnInit(): void {
		this.logger.debug("app: component loaded");

		this.mainMenu = {
			menuGroups: [
				{
					id: "menu-home",
					label: "STARTER.MENU.HOME",
					isVisible: true,
					isEnabled: true,
					targetState: "home",
					targetStateParams: { param1: "1-1-1", param2: "1-1-2" }
				},
				{
					id: "menu-about",
					label: "STARTER.MENU.ABOUT",
					isVisible: true,
					isEnabled: true,
					targetState: "about",
					targetStateParams: { paramData: "data passed via params" }
				}
			]
		};
	}

	public toggleMenu(): void {
		this.sidebarService.toggleMenu();
	}

	public goHome(): void {
		this.routingService.navigateToHome();
	}
}
