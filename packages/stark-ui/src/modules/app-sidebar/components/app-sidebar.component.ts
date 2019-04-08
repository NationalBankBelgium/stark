import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from "@angular/core";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { MatDrawerToggleResult, MatSidenav, MatSidenavContainer } from "@angular/material/sidenav";
import { from, Subscription } from "rxjs";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	StarkLoggingService,
	StarkRoutingService,
	StarkRoutingTransitionHook
} from "@nationalbankbelgium/stark-core";
import { STARK_APP_SIDEBAR_SERVICE, StarkAppSidebarOpenEvent, StarkAppSidebarService } from "../services";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

export type StarkAppSidebarLeftMode = "regular" | "menu" | undefined;

/**
 * Name of the component
 */
const componentName = "stark-app-sidebar";

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
export class StarkAppSidebarComponent extends AbstractStarkUiComponent implements OnDestroy, OnInit {
	/**
	 * When on smaller devices ( width < 1280px ) the sidebar is automatically closed after navigating.
	 * Can be set to false to prevent this behaviour.
	 * Default: true
	 */
	@Input()
	public closeOnNavigate = true;

	/**
	 * Reference to the MatSidenavContainer embedded in this component
	 */
	@ViewChild("appSidenavContainer")
	public appSidenavContainer!: MatSidenavContainer;

	/**
	 * Reference to the left MatSidenav embedded in this component
	 */
	@ViewChild("appSidenavLeft")
	public appSidenavLeft!: MatSidenav;

	/**
	 * Reference to the right MatSidenav embedded in this component
	 */
	@ViewChild("appSidenavRight")
	public appSidenavRight!: MatSidenav;

	/**
	 * Subscription to the close sidebar Observable
	 */
	public closeSidebarSubscription!: Subscription;

	/**
	 * Boolean that indicates if the left sidebar menu is currently shifting from larger to smaller desktop
	 * In this case, it should wait that the transition is finished before applying the smaller screen styles
	 */
	public isShiftingToSmaller = false;

	// TODO: move this media query to global variable that can be used through stark-ui
	/**
	 * Media query for big screens
	 */
	public mediaQueryGtLg = "(min-width: 1280px)";

	/**
	 * Subscription to the open sidebar Observable
	 */
	public openSidebarSubscription!: Subscription;

	/**
	 * Dynamic mode for the menu, should always show on large desktop screen
	 */
	public sidenavLeftType?: "menu" | "regular" = "menu";

	/**
	 * Dynamic mode for the left sidebar
	 */
	public sidenavLeftMode?: "over" | "push" | "side";

	/**
	 * Either the left sidebar is opened or not
	 */
	public sidenavLeftOpened = false;

	/**
	 * Subscription to the close sidebar Observable
	 */
	public toggleSidebarSubscription!: Subscription;

	/**
	 * Function to deregister the routing transition hook
	 */
	public deregisterTransitionHook!: Function;

	/**
	 * Class constructor
	 * @param logger - The sidebar service of the application
	 * @param sidebarService - The sidebar service of the application
	 * @param breakpointObserver - Utility for checking the matching state of @media queries
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_APP_SIDEBAR_SERVICE) public sidebarService: StarkAppSidebarService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		public breakpointObserver: BreakpointObserver,
		renderer: Renderer2,
		elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle OnInit hook
	 */
	public ngOnInit(): void {
		super.ngOnInit();
		this.logger.debug(componentName + ": component initialized");

		this.sidenavLeftOpened = this.breakpointObserver.isMatched([this.mediaQueryGtLg]);

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

		this.deregisterTransitionHook = this.routingService.addTransitionHook(StarkRoutingTransitionHook.ON_SUCCESS, {}, () => {
			this.onSuccessfulTransition();
		});
	}

	/**
	 * Component lifecycle OnDestroy hook
	 */
	public ngOnDestroy(): void {
		this.openSidebarSubscription.unsubscribe();
		this.closeSidebarSubscription.unsubscribe();
		this.toggleSidebarSubscription.unsubscribe();
		this.breakpointObserver.ngOnDestroy();
		this.deregisterTransitionHook();
	}

	/**
	 * Close one of the sidenavs
	 * @param sidenav - The sidebar to close
	 * @param successHandler - Handler function to be called when the sidenav closes
	 */
	public closeSidenav(sidenav: MatSidenav, successHandler: (value: MatDrawerToggleResult) => void): void {
		from(sidenav.close()).subscribe(successHandler, this.displayErrorCallback);
	}

	/**
	 * Callback function to be called when the sidenav opens
	 * @param result: MatDrawerToggleResult
	 */
	private displaySuccessCallback: (value: MatDrawerToggleResult) => void = (result: MatDrawerToggleResult) => {
		this.logger.debug(componentName + result);
	};

	/**
	 * Callback function to be called when the sidenav failed to open
	 * * @param error: Error
	 */
	private displayErrorCallback: (error: Error) => void = (error: Error) => {
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
					this.closeSidenav(this.appSidenavLeft, this.shiftLeftSidenavCallback);
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
		// Enter large desktop screen
		if (state.matches) {
			if (this.sidenavLeftType === "menu") {
				this.sidenavLeftMode = "side";
				if (!this.appSidenavLeft.opened) {
					this.openSidenav(this.appSidenavLeft);
				}
			}
		}
		// Enter smaller screens
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
	 * Navigation handler
	 */
	public onSuccessfulTransition(): void {
		if (this.closeOnNavigate && !this.breakpointObserver.isMatched(this.mediaQueryGtLg)) {
			this.sidebarService.close();
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
					this.closeSidenav(this.appSidenavLeft, this.displaySuccessCallback);
				} else {
					this.setComponentBehaviour();
					this.openSidenav(this.appSidenavLeft);
				}
				break;
			case "right":
				from(this.appSidenavRight.toggle()).subscribe(this.displaySuccessCallback, this.displayErrorCallback);
				break;
			default:
				break;
		}
	}

	/**
	 * Open one of the sidenavs
	 * @param sidenav - The sidebar to open
	 * @param successHandler - Handler function to be called when the sidenav closes
	 */
	public openSidenav(sidenav: MatSidenav, successHandler: (value: MatDrawerToggleResult) => void = this.displaySuccessCallback): void {
		from(sidenav.open()).subscribe(successHandler, this.displayErrorCallback);
	}

	/**
	 * Toggle the different classes when the sidenav is open or closed
	 * @param isOpen - Whether the sidebar is open
	 */
	public toggleClassesOnOpen(isOpen: boolean): void {
		if (isOpen) {
			this.renderer.addClass(this.elementRef.nativeElement, "sidebar-open");
			this.renderer.removeClass(this.elementRef.nativeElement, "sidebar-open-start");
			this.renderer.removeClass(this.elementRef.nativeElement, "sidebar-close");
		} else {
			this.renderer.addClass(this.elementRef.nativeElement, "sidebar-close");
			this.renderer.removeClass(this.elementRef.nativeElement, "sidebar-close-start");
			this.renderer.removeClass(this.elementRef.nativeElement, "sidebar-open");
		}
	}

	/**
	 * Set the corresponding class when the sidenav starts to open
	 */
	public setClassOnOpenStart(): void {
		this.renderer.addClass(this.elementRef.nativeElement, "sidebar-open-start");
	}

	/**
	 * Set the corresponding class when the sidenav starts to close
	 */
	public setClassOnCloseStart(): void {
		this.renderer.addClass(this.elementRef.nativeElement, "sidebar-close-start");
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
	 * Callback function when the left sidenav needs to shift type
	 * @param result: MatDrawerToggleResult
	 */
	public shiftLeftSidenavCallback: (result: MatDrawerToggleResult) => void = (result: MatDrawerToggleResult) => {
		this.logger.debug(componentName + ": sidenav " + result);
		this.sidenavLeftType = this.sidenavLeftType === "menu" ? "regular" : "menu";
		this.setComponentBehaviour();
		this.openSidenav(this.appSidenavLeft);
	};
}
