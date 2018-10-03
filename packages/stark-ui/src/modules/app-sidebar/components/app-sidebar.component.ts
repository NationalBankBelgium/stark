import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { from, Subscription } from "rxjs";
import { MatSidenav, MatSidenavContainer, MatDrawerToggleResult } from "@angular/material/sidenav";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkAppSidebarOpenEvent, StarkAppSidebarService, STARK_APP_SIDEBAR_SERVICE } from "../services";

export type StarkAppSidebarLeftMode = "regular" | "menu" | undefined;

/**
 * Name of the component
 */
const componentName: string = "stark-app-sidebar";

/**
 * Component to display the application's sidebar
 * Only 2 sidebars are allowed: https://github.com/angular/material2/issues/1514
 */
@Component({
	selector: "stark-app-sidebar",
	templateUrl: "./app-sidebar.component.html",
	encapsulation: ViewEncapsulation.None,
	host: {
		class: componentName
	}
})
export class StarkAppSidebarComponent implements OnDestroy, OnInit {
	/**
	 * Reference to the MatSidenavContainer embedded in this component
	 */
	@ViewChild("appSidenavContainer")
	public appSidenavContainer: MatSidenavContainer;

	/**
	 * Reference to the left MatSidenav embedded in this component
	 */
	@ViewChild("appSidenavLeft")
	public appSidenavLeft: MatSidenav;

	/**
	 * Reference to the right MatSidenav embedded in this component
	 */
	@ViewChild("appSidenavRight")
	public appSidenavRight: MatSidenav;

	/**
	 * Subscription to the close sidebar Observable
	 */
	public closeSidebarSubscription: Subscription;

	/**
	 * Boolean that indicates if the left sidebar menu is currently shifting from larger to smaller desktop
	 * In this case, it should wait that the transition is finished before applying the smaller screen styles
	 */
	public isShiftingToSmaller: boolean = false;

	//TODO: move this media query to global variable that can be used through stark-ui
	/**
	 * Media query for big screens
	 */
	public mediaQueryGtLg: string = "(min-width: 1280px)";

	/**
	 * Subscription to the open sidebar Observable
	 */
	public openSidebarSubscription: Subscription;

	/**
	 * Dynamic mode for the menu, should always show on large desktop screen
	 */
	public sidenavLeftType?: "menu" | "regular" = "menu";

	/**
	 * Dynamic mode for the left sidebar
	 */
	public sidenavLeftMode: string;

	/**
	 * Either the left sidebar is opened or not
	 */
	public sidenavLeftOpened: boolean;

	/**
	 * Subscription to the close sidebar Observable
	 */
	public toggleSidebarSubscription: Subscription;

	/**
	 * Class constructor
	 * @param sidebarService - The sidebar service of the application
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_APP_SIDEBAR_SERVICE) public sidebarService: StarkAppSidebarService,
		public breakpointObserver: BreakpointObserver
	) {}

	/**
	 * Component lifecycle OnInit hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");

		if (this.breakpointObserver.isMatched([this.mediaQueryGtLg])) {
			this.sidenavLeftOpened = true;
		} else {
			this.sidenavLeftOpened = false;
		}

		this.openSidebarSubscription = this.sidebarService.openSidebar$.subscribe((event: StarkAppSidebarOpenEvent) => {
			this.onOpenSidenav(event);
		});

		this.closeSidebarSubscription = this.sidebarService.closeSidebar$.subscribe(() => {
			this.onCloseSidenavs();
		});

		this.toggleSidebarSubscription = this.sidebarService.toggleSidebar$.subscribe((event: StarkAppSidebarOpenEvent) => {
			this.onToggleSidenav(event);
		});

		this.breakpointObserver.observe([this.mediaQueryGtLg]).subscribe((state: BreakpointState) => {
			this.onObserveBreakpoints(state);
		});
	}

	/**
	 * Component lifecycle OnDestroy hook
	 * Prevent memory leak when component destroyed
	 */
	public ngOnDestroy(): void {
		this.openSidebarSubscription.unsubscribe();
		this.closeSidebarSubscription.unsubscribe();
	}

	/**
	 * Close one of the sidenavs
	 * @param sidenav - The sidebar to close
	 */
	public closeSidenav(sidenav: MatSidenav, successHandler: ((value: MatDrawerToggleResult) => void)): void {
		from(sidenav.close()).subscribe(successHandler, this.displayErrorFallback);
	}

	/**
	 * Fallback function when the sidenav has opened with success
	 * @param result: MatDrawerToggleResult
	 */
	private displaySuccessFallback: ((value: MatDrawerToggleResult) => void) = (result: MatDrawerToggleResult) => {
		this.logger.debug(componentName + result);
	};

	/**
	 * Fallback function when the sidenav opening raise an error
	 * * @param error: Error
	 */
	private displayErrorFallback: ((error: Error) => void) = (error: Error) => {
		this.logger.warn(componentName + ": ", error);
	};

	/**
	 * Close sidenav handler
	 */
	public onCloseSidenavs(): void {
		this.appSidenavContainer.close();
	}

	/**
	 * Open sidenav handler
	 */
	public onOpenSidenav(event: StarkAppSidebarOpenEvent): void {
		switch (event.sidebar) {
			case "left":
				if (this.sidenavLeftType !== event.type && this.appSidenavLeft.opened) {
					this.closeSidenav(this.appSidenavLeft, this.shiftLeftSidenavFallback);
				} else if (!this.appSidenavLeft.opened) {
					this.sidenavLeftType = event.type;
					this.setComponentBehaviour();
					this.openSidenav(this.appSidenavLeft);
				}
				break;
			case "right":
				if (!this.appSidenavRight.opened) {
					this.openSidenav(this.appSidenavRight);
				}
				break;
			default:
				break;
		}
	}

	/**
	 * Breakpoints change handler
	 */
	public onObserveBreakpoints(state: BreakpointState): void {
		//Enter large desktop screen
		if (state.matches) {
			if (this.sidenavLeftType === "menu") {
				this.sidenavLeftMode = "side";
				if (!this.appSidenavLeft.opened) {
					this.openSidenav(this.appSidenavLeft);
				}
			}
		}
		//Enter smaller screens
		else {
			if (this.sidenavLeftType === "menu") {
				if (this.appSidenavLeft.opened) {
					this.isShiftingToSmaller = true;
					this.closeSidenav(this.appSidenavLeft, (result: MatDrawerToggleResult) => {
						this.logger.debug(componentName + ": sidenav " + result);
						this.isShiftingToSmaller = false;
					});
				} else {
					this.sidenavLeftMode = "over";
				}
			}
		}
	}

	/**
	 * Toggle sidenav handler
	 */
	public onToggleSidenav(event: StarkAppSidebarOpenEvent): void {
		switch (event.sidebar) {
			case "left":
				this.sidenavLeftType = event.type;
				if (this.appSidenavLeft.opened) {
					this.closeSidenav(this.appSidenavLeft, this.displaySuccessFallback);
				} else {
					this.setComponentBehaviour();
					this.openSidenav(this.appSidenavLeft);
				}
				break;
			case "right":
				from(this.appSidenavRight.toggle()).subscribe(this.displaySuccessFallback, this.displayErrorFallback);
				break;
			default:
				break;
		}
	}

	/**
	 * Open one of the sidenavs
	 * @param sidenav - The sidebar to open
	 */
	public openSidenav(sidenav: MatSidenav, successHandler: ((value: MatDrawerToggleResult) => void) = this.displaySuccessFallback): void {
		from(sidenav.open()).subscribe(successHandler, this.displayErrorFallback);
	}

	/**
	 * Set the component with the right settings before opening
	 */
	public setComponentBehaviour(): void {
		if (this.sidenavLeftType === "regular") {
			this.sidenavLeftMode = "over";
		} else {
			if (this.breakpointObserver.isMatched([this.mediaQueryGtLg])) {
				this.sidenavLeftMode = "side";
			} else {
				this.sidenavLeftMode = "over";
			}
		}
	}

	/**
	 * Fallback function when the left sidenav needs to shift type
	 * @param result: MatDrawerToggleResult
	 */
	public shiftLeftSidenavFallback: ((value: MatDrawerToggleResult) => void) = (result: MatDrawerToggleResult) => {
		this.logger.debug(componentName + ": sidenav " + result);
		this.sidenavLeftType = this.sidenavLeftType === "menu" ? "regular" : "menu";
		this.setComponentBehaviour();
		this.openSidenav(this.appSidenavLeft);
	};
}
