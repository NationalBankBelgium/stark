/* tslint:disable:completed-docs */
import { Subject } from "rxjs";
import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { async, fakeAsync, tick, ComponentFixture, TestBed } from "@angular/core/testing";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { MatSidenavModule } from "@angular/material/sidenav";
import { HookMatchCriteria, TransitionHookFn, TransitionStateHookFn } from "@uirouter/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkRoutingTransitionHook } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppSidebarComponent } from "./app-sidebar.component";
import { STARK_APP_SIDEBAR_SERVICE } from "../services";
import { MockStarkAppSidebarService } from "@nationalbankbelgium/stark-ui/testing";

// Definitions
/**
 * Defines the breakpoint set by the {@link StarkAppSidebarComponent}.
 */
const BREAKPOINT_STRING = "(min-width: 1280px)";
let _fakeBreakPointObservable: Subject<BreakpointState>;

/**
 * Use this function to mock the screen resizing (breakpoint triggering)
 * {@link BreakpointObserver}
 */
function simulateBreakPointStateChange(breakPointState: BreakpointState): void {
	_fakeBreakPointObservable.next(breakPointState);
}

/**
 * Placeholder for function set by the {@link StarkAppSidebarComponent} through `mockStarkRoutingService.addTransitionHook` function.
 * Use this to trigger the flow following a navigation.
 */
let mockNavigationTrigger: () => void;

let fixture: ComponentFixture<StarkAppSidebarComponent>;
let component: StarkAppSidebarComponent;

// Mocked services
let mockStarkLoggingService: MockStarkLoggingService;
let mockStarkAppSideBarService: MockStarkAppSidebarService;
let mockStarkRoutingService: MockStarkRoutingService;
let mockBreakPointObserver: jasmine.SpyObj<BreakpointObserver>;

describe("AppSidebarComponent", () => {
	beforeEach(() => {
		mockStarkLoggingService = new MockStarkLoggingService();
		mockStarkAppSideBarService = new MockStarkAppSidebarService();
		mockStarkRoutingService = new MockStarkRoutingService();
		// add functionality to the `addTransitionHook` Spy
		mockStarkRoutingService.addTransitionHook.and.callFake(
			(lifecycleHook: string, matchCriteria: HookMatchCriteria, callback: TransitionHookFn | TransitionStateHookFn): (() => void) => {
				expect(lifecycleHook).toBe(StarkRoutingTransitionHook.ON_SUCCESS);
				expect(matchCriteria).toEqual({});
				mockNavigationTrigger = <() => void>callback;
				return (): void => {
					/*Do Nothing*/
				};
			}
		);

		mockBreakPointObserver = jasmine.createSpyObj("BreakPointObserver", ["isMatched", "observe", "ngOnDestroy"]);
		// add functionality to the `observe` Spy
		mockBreakPointObserver.observe.and.callFake((value: string | string[]) => {
			expect([[BREAKPOINT_STRING], BREAKPOINT_STRING]).toContain(value);
			return _fakeBreakPointObservable;
		});
	});

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkAppSidebarComponent],
			imports: [CommonModule, MatSidenavModule, NoopAnimationsModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: mockStarkLoggingService },
				{ provide: STARK_APP_SIDEBAR_SERVICE, useValue: mockStarkAppSideBarService },
				{ provide: STARK_ROUTING_SERVICE, useValue: mockStarkRoutingService },
				{ provide: BreakpointObserver, useValue: mockBreakPointObserver }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkAppSidebarComponent);
		component = fixture.componentInstance;
		_fakeBreakPointObservable = new Subject<BreakpointState>();
		fixture.detectChanges();
	});

	describe("sidebar events handling", sidebarEventsHandlingTests);

	describe("screen size change handler", screenSizeChangeHandlingTests);

	describe("navigation handler", navigationHandlingTests);
});

function sidebarEventsHandlingTests(): void {
	describe("onCloseSidenavs should work as expected", () => {
		it("sidenavs should close", () => {
			component.appSidenavLeft.opened = true;
			component.appSidenavRight.opened = true;
			component.onCloseSidenavs();
			expect(component.appSidenavLeft.opened).toBe(false);
			expect(component.appSidenavRight.opened).toBe(false);
		});
	});

	describe("onOpenSidenav should work as expected", () => {
		it("sidenavs should not open when already opened", () => {
			spyOn(component, "openSidenav");
			component.appSidenavLeft.opened = true;
			fixture.detectChanges();
			component.onOpenSidenav({
				sidebar: "left",
				type: "regular"
			});
			expect(component.openSidenav).toHaveBeenCalledTimes(0);

			component.appSidenavRight.opened = true;
			fixture.detectChanges();
			component.onOpenSidenav({
				sidebar: "right"
			});
			expect(component.openSidenav).toHaveBeenCalledTimes(0);
		});

		it("sidenavs should open when closed", () => {
			spyOn(component, "openSidenav");
			component.appSidenavLeft.opened = false;
			fixture.detectChanges();
			component.onOpenSidenav({
				sidebar: "left",
				type: "regular"
			});
			expect(component.openSidenav).toHaveBeenCalledTimes(1);

			component.appSidenavRight.opened = false;
			fixture.detectChanges();
			component.onOpenSidenav({
				sidebar: "right"
			});
			expect(component.openSidenav).toHaveBeenCalledTimes(2);
		});

		it("left sidebar should display the menu correctly", () => {
			component.appSidenavLeft.opened = false;
			fixture.detectChanges();
			component.onOpenSidenav({
				sidebar: "left",
				type: "menu"
			});
			const sidenav: HTMLElement = fixture.nativeElement.querySelector(".stark-app-sidenav-menu");
			expect(sidenav).toBeDefined();
		});

		it("left sidebar should close and then open when left sidebar is opened and sidenavLeftType is changed", fakeAsync(() => {
			spyOn(component, "shiftLeftSidenavCallback").and.callThrough();
			spyOn(component, "closeSidenav").and.callThrough();
			component.sidenavLeftType = "menu";
			component.appSidenavLeft.opened = true;
			fixture.detectChanges();
			component.onOpenSidenav({
				sidebar: "left",
				type: "regular"
			});
			tick();
			expect(component.closeSidenav).toHaveBeenCalledTimes(1);
			expect(component.shiftLeftSidenavCallback).toHaveBeenCalledTimes(1);
			expect(component.sidenavLeftType).toBe("regular");
		}));
	});

	describe("onToggleSidenav should work as expected", () => {
		it("left sidenav should toggle", () => {
			spyOn(component, "closeSidenav");
			component.appSidenavLeft.opened = true;
			fixture.detectChanges();
			component.onToggleSidenav({
				sidebar: "left"
			});
			expect(component.closeSidenav).toHaveBeenCalledTimes(1);

			spyOn(component, "openSidenav");
			component.appSidenavLeft.opened = false;
			fixture.detectChanges();
			component.onToggleSidenav({
				sidebar: "left"
			});
			expect(component.openSidenav).toHaveBeenCalledTimes(1);
		});
	});
}

function screenSizeChangeHandlingTests(): void {
	describe("from large desktop screen to smaller", () => {
		const state: BreakpointState = {
			matches: false,
			breakpoints: {}
		};

		it("left sidebar should be 'over' mode", () => {
			component.sidenavLeftMode = "side";
			component.appSidenavLeft.opened = false;
			fixture.detectChanges();
			simulateBreakPointStateChange(state);
			expect(component.sidenavLeftMode).toBe("over");
		});

		it("left sidebar should close when open with type 'menu'", () => {
			spyOn(component, "closeSidenav");
			component.appSidenavLeft.opened = true;
			component.sidenavLeftType = "menu";
			fixture.detectChanges();
			simulateBreakPointStateChange(state);
			expect(component.closeSidenav).toHaveBeenCalledTimes(1);
		});

		// FIXME: this tslint disable flag is due to a bug in 'no-identical-functions' rule (https://github.com/SonarSource/SonarTS/issues/676). Remove it once it is solved
		/*tslint:disable-next-line:no-identical-functions*/
		it("left sidebar should not close when open with type 'regular'", () => {
			spyOn(component, "closeSidenav");
			component.appSidenavLeft.opened = true;
			component.sidenavLeftType = "regular";
			fixture.detectChanges();
			simulateBreakPointStateChange(state);
			expect(component.closeSidenav).toHaveBeenCalledTimes(0);
		});
	});

	describe("from smaller screen to large desktop", () => {
		const state: BreakpointState = {
			matches: true,
			breakpoints: {}
		};

		it("left sidebar should be side mode", () => {
			component.sidenavLeftMode = "over";
			fixture.detectChanges();
			simulateBreakPointStateChange(state);
			expect(component.sidenavLeftMode).toBe("side");
		});

		it("left sidebar should open with type menu when it is closed", () => {
			spyOn(component, "openSidenav");
			component.appSidenavLeft.opened = false;
			component.sidenavLeftType = "menu";
			fixture.detectChanges();
			simulateBreakPointStateChange(state);
			expect(component.openSidenav).toHaveBeenCalledTimes(1);
		});

		it("left sidebar should be displayed in side mode when already opened with type menu", () => {
			component.appSidenavLeft.opened = true;
			component.sidenavLeftType = "menu";
			component.sidenavLeftMode = "over";
			fixture.detectChanges();
			simulateBreakPointStateChange(state);
			expect(component.sidenavLeftMode).toBe("side");
		});
	});
}

function navigationHandlingTests(): void {
	describe("behaviour when automatic closing is enabled (/ default behaviour).", () => {
		beforeEach(() => {
			mockStarkAppSideBarService.close.calls.reset();
			fixture.detectChanges();
		});

		it("left sidebar should stay open on larger screen", () => {
			mockBreakPointObserver.isMatched.and.callFake((value: string | string[]) => {
				expect([[BREAKPOINT_STRING], BREAKPOINT_STRING]).toContain(value);
				return true; // screen is >= 1280px
			});
			mockNavigationTrigger();
			fixture.detectChanges();
			expect(mockStarkAppSideBarService.close).not.toHaveBeenCalled();
		});

		it("left sidebar should close on smaller screen", () => {
			mockBreakPointObserver.isMatched.and.callFake((value: string | string[]) => {
				expect([[BREAKPOINT_STRING], BREAKPOINT_STRING]).toContain(value);
				return false; // screen is >= 1280px
			});
			mockNavigationTrigger();
			fixture.detectChanges();

			expect(mockStarkAppSideBarService.close).toHaveBeenCalled();
		});
	});

	describe("behaviour when automatic closing is disabled", () => {
		beforeEach(() => {
			mockStarkAppSideBarService.close.calls.reset();
			component.closeOnNavigate = false;
			fixture.detectChanges();
		});

		// Function is duplicate, but in a different context (component.closeOnNavigate = false;)
		/*tslint:disable-next-line:no-identical-functions*/
		it("left sidebar should stay open on larger screen", () => {
			mockBreakPointObserver.isMatched.and.callFake((value: string | string[]) => {
				expect([[BREAKPOINT_STRING], BREAKPOINT_STRING]).toContain(value);
				return true; // screen is >= 1280px
			});
			mockNavigationTrigger();
			fixture.detectChanges();
			expect(mockStarkAppSideBarService.close).not.toHaveBeenCalled();
		});

		it("left sidebar should close on smaller screen", () => {
			mockBreakPointObserver.isMatched.and.callFake((value: string | string[]) => {
				expect([[BREAKPOINT_STRING], BREAKPOINT_STRING]).toContain(value);
				return false; // screen is >= 1280px
			});
			mockNavigationTrigger();
			fixture.detectChanges();

			expect(mockStarkAppSideBarService.close).not.toHaveBeenCalled();
		});
	});
}
