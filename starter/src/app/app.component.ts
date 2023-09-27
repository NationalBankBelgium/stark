/**
 * Angular 2 decorators and services
 */
import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";
import { STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarService, StarkMenuConfig } from "@nationalbankbelgium/stark-ui";

/**
 * App Component
 * Top Level Component
 */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
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
	public name = "Stark Starter";

	/**
	 * App menu configuration
	 */
	public mainMenu: StarkMenuConfig = {
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
	}

	public toggleMenu(): void {
		this.sidebarService.toggleMenu();
	}

	public goHome(): void {
		this.routingService.navigateToHome();
	}
}
