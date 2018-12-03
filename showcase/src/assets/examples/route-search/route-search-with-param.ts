import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-route-search-page",
	templateUrl: "./demo-route-search-page.component.html",
	styleUrls: ["./demo-route-search-page.component.scss"]
})
export class DemoRouteSearchPageComponent implements OnInit {
	public mainMenu: StarkMenuConfig;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.mainMenu = {
			menuSections: [
				{
					label: "Welcome to STARK",
					menuGroups: [
						{
							id: "menu-home",
							label: "Home",
							isVisible: true,
							isEnabled: true,
							targetState: "home",
							targetStateParams: { param1: "1-1-1", param2: "1-1-2" }
						}
					]
				},
				{
					label: "Stark UI",
					menuGroups: [
						{
							id: "menu-stark-ui-components",
							label: "Components",
							isVisible: true,
							isEnabled: true,
							entries: [
								{
									id: "menu-stark-ui-components-action-bar",
									label: "Action bar",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.action-bar"
								},
								{
									id: "menu-stark-ui-components-message-pane",
									label: "Message pane",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.message-pane"
								}
							]
						},
						{
							id: "menu-stark-ui-directives",
							label: "Directives",
							isVisible: true,
							isEnabled: true,
							entries: [
								{
									id: "menu-stark-ui-directives-keyboard",
									label: "Keyboard directives",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.keyboard-directives"
								}
							]
						},
						{
							id: "menu-stark-ui-services",
							label: "Services",
							isVisible: true,
							isEnabled: true,
							targetState: "#"
						}
					]
				},
				{
					label: "Style guide",
					menuGroups: [
						{
							id: "menu-stark-ui-components-button",
							label: "Button",
							isVisible: true,
							isEnabled: true,
							targetState: "styleguide.button"
						},
						{
							id: "menu-style-typography",
							label: "Typography",
							isVisible: true,
							isEnabled: true,
							targetState: "styleguide.typography"
						}
					]
				}
			]
		};
	}
}
