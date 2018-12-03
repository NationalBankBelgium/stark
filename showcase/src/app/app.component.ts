/**
 * Angular 2 decorators and services
 */
import { Component, Inject, OnInit } from "@angular/core";
import {
	STARK_APP_METADATA,
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_SESSION_SERVICE,
	STARK_USER_SERVICE,
	StarkApplicationMetadata,
	StarkLoggingService,
	StarkRoutingService,
	StarkSessionService,
	StarkUser,
	StarkUserService
} from "@nationalbankbelgium/stark-core";
import { StarkMenuConfig, STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarService } from "@nationalbankbelgium/stark-ui";
import * as moment from "moment";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { filter } from "rxjs/operators";
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
	public user?: StarkUser;
	public time: string;
	/**
	 * Media query for mobile and tablet screens
	 */
	public mediaQueryMdSm: string = "(max-width: 960px)";
	/**
	 * If the app data menu mode is to be used instead of the dropdown mode
	 */
	public isMenuModeActive: boolean;

	//tslint:disable:no-big-function
	public constructor(
		@Inject(STARK_APP_SIDEBAR_SERVICE) public sidebarService: StarkAppSidebarService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		@Inject(STARK_USER_SERVICE) public userService: StarkUserService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Inject(STARK_APP_METADATA) public appMetadata: StarkApplicationMetadata,
		public breakpointObserver: BreakpointObserver
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
							targetState: "getting-started"
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
									targetState: "demo-ui.action-bar"
								},
								{
									id: "menu-stark-ui-components-app-data",
									label: "App Data",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.app-data"
								},
								{
									id: "menu-stark-ui-components-logout",
									label: "App logout",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.logout"
								},
								{
									id: "menu-stark-ui-components-menu",
									label: "App menu",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.menu"
								},
								{
									id: "menu-stark-ui-components-sidebar",
									label: "App sidebar",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.sidebar"
								},
								{
									id: "menu-stark-ui-components-breadcrumb",
									label: "Breadcrumb",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.breadcrumb"
								},
								{
									id: "menu-stark-ui-components-collapsible",
									label: "Collapsible",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.collapsible"
								},
								{
									id: "menu-stark-ui-components-date-picker",
									label: "Date picker",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.date-picker"
								},
								{
									id: "menu-stark-ui-components-date-range-picker",
									label: "Date range picker",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.date-range-picker"
								},
								{
									id: "menu-stark-ui-components-dropdown",
									label: "Dropdown",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.dropdown"
								},
								{
									id: "menu-style-footer",
									label: "Footer",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.stark-footer"
								},
								{
									id: "menu-stark-ui-components-language-selector",
									label: "Language selector",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.language-selector"
								},
								{
									id: "menu-stark-ui-components-message-pane",
									label: "Message pane",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.message-pane"
								},
								{
									id: "menu-stark-ui-components-minimap",
									label: "Minimap",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.minimap"
								},
								{
									id: "menu-stark-ui-components-pagination",
									label: "Pagination",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.pagination"
								},
								{
									id: "menu-stark-ui-components-pretty-print",
									label: "Pretty print",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.pretty-print"
								},
								{
									id: "menu-stark-ui-components-slider",
									label: "Slider",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.slider"
								},
								{
									id: "menu-stark-ui-components-route-search",
									label: "Route Search",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.route-search"
								},
								{
									id: "menu-stark-ui-components-table",
									label: "Table",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.table"
								},
								{
									id: "menu-stark-ui-components-toast",
									label: "Toast notification",
									isVisible: true,
									isEnabled: true,
									targetState: "demo-ui.toast"
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
							id: "menu-stark-ui-components-button",
							label: "Button",
							isVisible: true,
							isEnabled: true,
							targetState: "styleguide.button"
						},
						{
							id: "menu-style-card",
							label: "Card",
							isVisible: true,
							isEnabled: true,
							targetState: "styleguide.card"
						},
						{
							id: "menu-style-colors",
							label: "Colors",
							isVisible: true,
							isEnabled: true,
							targetState: "styleguide.colors"
						},
						{
							id: "menu-style-header",
							label: "Header",
							isVisible: true,
							isEnabled: true,
							targetState: "styleguide.stark-header"
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

		this.userService
			.fetchUserProfile()
			.pipe(filter<StarkUser | undefined, StarkUser>((user?: StarkUser): user is StarkUser => typeof user !== "undefined"))
			.subscribe((user: StarkUser) => {
				this.user = user;
			});

		this.time = moment().format("lll");

		this.isMenuModeActive = this.breakpointObserver.isMatched([this.mediaQueryMdSm]);

		this.breakpointObserver.observe([this.mediaQueryMdSm]).subscribe((state: BreakpointState) => {
			this.isMenuModeActive = state.matches;
		});
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
