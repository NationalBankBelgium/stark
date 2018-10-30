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
export class AppComponent implements OnInit {
	public mainMenu: StarkMenuConfig;

	public constructor(
		@Inject(STARK_APP_SIDEBAR_SERVICE) public sidebarService: StarkAppSidebarService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService
	) {}

	/* tslint:disable */
	public ngOnInit(): void {
		this.logger.debug("app: component loaded");
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
						},
						{
							id: "menu-getting-started",
							label: "Getting started",
							isVisible: true,
							isEnabled: true,
							targetState: "#"
						},
						{
							id: "menu-news",
							label: "News",
							isVisible: true,
							isEnabled: true,
							targetState: "news"
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
									targetState: "demo.action-bar"
								},
								{
									id: "menu-stark-ui-components-logout",
									label: "App logout",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.logout"
								},
								{
									id: "menu-stark-ui-components-menu",
									label: "App menu",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.menu"
								},
								{
									id: "menu-stark-ui-components-sidebar",
									label: "App sidebar",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.sidebar"
								},
								{
									id: "menu-stark-ui-components-breadcrumb",
									label: "Breadcrumb",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.breadcrumb"
								},
								{
									id: "menu-stark-ui-components-button",
									label: "Button",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.button"
								},
								{
									id: "menu-stark-ui-components-collapsible",
									label: "Collapsible",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.collapsible"
								},
								{
									id: "menu-stark-ui-components-date-picker",
									label: "Date picker",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.date-picker"
								},
								{
									id: "menu-stark-ui-components-date-range-picker",
									label: "Date range picker",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.date-range-picker"
								},
								{
									id: "menu-stark-ui-components-dropdown",
									label: "Dropdown",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.dropdown"
								},
								{
									id: "menu-stark-ui-components-example-viewer",
									label: "Example viewer",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.example-viewer"
								},
								{
									id: "menu-stark-ui-components-language-selector",
									label: "Language selector",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.language-selector"
								},
								{
									id: "menu-stark-ui-components-pagination",
									label: "Pagination",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.pagination"
								},
								{
									id: "menu-stark-ui-components-pretty-print",
									label: "Pretty print",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.pretty-print"
								},
								{
									id: "menu-stark-ui-components-slider",
									label: "Slider",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.slider"
								},
								{
									id: "menu-stark-ui-components-table",
									label: "Table",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.table"
								},
								{
									id: "menu-stark-ui-components-toast",
									label: "Toast notification",
									isVisible: true,
									isEnabled: true,
									targetState: "demo.toast"
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
									targetState: "demo.keyboard-directives"
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
					label: "Stark Core",
					menuGroups: [
						{
							id: "test-1",
							label: "Getting started",
							isVisible: true,
							isEnabled: true
						},
						{
							id: "test-1",
							label: "UI Components",
							isVisible: true,
							isEnabled: true
						}
					]
				},
				{
					label: "Style guide",
					menuGroups: [
						{
							id: "menu-style-card",
							label: "Card",
							isVisible: true,
							isEnabled: true,
							targetState: "demo.card"
						},
						{
							id: "menu-style-colors",
							label: "Colors",
							isVisible: true,
							isEnabled: true,
							targetState: "demo.colors"
						},
						{
							id: "menu-style-footer",
							label: "Footer",
							isVisible: true,
							isEnabled: true,
							targetState: "demo.stark-footer"
						},
						{
							id: "menu-style-header",
							label: "Header",
							isVisible: true,
							isEnabled: true,
							targetState: "demo.stark-header"
						},
						{
							id: "menu-style-typography",
							label: "Typography",
							isVisible: true,
							isEnabled: true,
							targetState: "demo.typography"
						}
					]
				}
			]
		};
	}
	/* tslint:enable */

	public toggleMenu(): void {
		this.sidebarService.toggleMenu();
	}

	public openLeftSidebar(): void {
		this.sidebarService.openLeft();
	}

	public openRightSidebar(): void {
		this.sidebarService.openRight();
	}

	public goHome(): void {
		this.routingService.navigateToHome();
	}
}
