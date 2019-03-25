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
import { STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarService, StarkMenuConfig } from "@nationalbankbelgium/stark-ui";
import * as moment from "moment";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { filter } from "rxjs/operators";
import { APP_MENU_CONFIG } from "./app-menu.config";

/**
 * App Component
 * Top Level Component
 */
@Component({
	selector: "app",
	templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
	public mainMenu: StarkMenuConfig = APP_MENU_CONFIG;
	public user?: StarkUser;
	public time: string = moment().format("lll");
	/**
	 * Media query for mobile and tablet screens
	 */
	public mediaQueryMdSm = "(max-width: 960px)";
	/**
	 * If the app data menu mode is to be used instead of the dropdown mode
	 */
	public isMenuModeActive = false;

	// tslint:disable:no-big-function
	public constructor(
		@Inject(STARK_APP_METADATA) public appMetadata: StarkApplicationMetadata,
		@Inject(STARK_APP_SIDEBAR_SERVICE) public sidebarService: StarkAppSidebarService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Inject(STARK_USER_SERVICE) public userService: StarkUserService,
		public breakpointObserver: BreakpointObserver
	) {}

	public ngOnInit(): void {
		this.logger.debug("app: component loaded");

		this.userService
			.fetchUserProfile()
			.pipe(filter<StarkUser | undefined, StarkUser>((user?: StarkUser): user is StarkUser => typeof user !== "undefined"))
			.subscribe((user: StarkUser) => {
				this.user = user;
			});

		this.isMenuModeActive = this.breakpointObserver.isMatched([this.mediaQueryMdSm]);

		this.breakpointObserver.observe([this.mediaQueryMdSm]).subscribe((state: BreakpointState) => {
			this.isMenuModeActive = state.matches;
		});
	}

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
