import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSidenavModule } from "@angular/material/sidenav";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppSidebarComponent } from "./app-sidebar.component";
import { MockAppSidebarService } from "../testing/app-sidebar.mock";
import { STARK_APP_SIDEBAR_SERVICE } from "../services/app-sidebar.service.intf";
import { BreakpointState } from "@angular/cdk/layout";

describe("AppSidebarComponent", () => {
	let fixture: ComponentFixture<StarkAppSidebarComponent>;
	let component: StarkAppSidebarComponent;

	beforeEach(async(() => {
		const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();
		return TestBed.configureTestingModule({
			declarations: [StarkAppSidebarComponent],
			imports: [CommonModule, MatSidenavModule, NoopAnimationsModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger },
				{ provide: STARK_APP_SIDEBAR_SERVICE, useValue: new MockAppSidebarService() }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StarkAppSidebarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe("Screen size change handler", () => {
		describe("From large desktop screen to smaller", () => {
			const state: BreakpointState = {
				matches: false,
				breakpoints: {}
			};

			it("left sidebar should be over mode", () => {
				component.sidenavLeftMode = "side";
				component.appSidenavLeft.opened = false;
				fixture.detectChanges();
				component.onObserveBreakpoints(state);
				expect(component.sidenavLeftMode).toBe("over");
			});

			it("left sidebar should close when is open with type menu", () => {
				spyOn(component, "closeSidenav");
				component.appSidenavLeft.opened = true;
				component.sidenavLeftType = "menu";
				fixture.detectChanges();
				component.onObserveBreakpoints(state);
				expect(component.closeSidenav).toHaveBeenCalledTimes(1);
			});

			it("left sidebar should not close when is open with type regular", () => {
				component.appSidenavLeft.opened = true;
				spyOn(component, "closeSidenav");
				component.sidenavLeftType = "regular";
				fixture.detectChanges();
				component.onObserveBreakpoints(state);
				expect(component.closeSidenav).toHaveBeenCalledTimes(0);
			});
		});

		describe("From smaller screen to large desktop", () => {
			const state: BreakpointState = {
				matches: true,
				breakpoints: {}
			};

			it("left sidebar should be side mode", () => {
				component.sidenavLeftMode = "over";
				fixture.detectChanges();
				component.onObserveBreakpoints(state);
				expect(component.sidenavLeftMode).toBe("side");
			});

			it("left sidebar should open with type menu when it is closed", () => {
				spyOn(component, "openSidenav");
				component.appSidenavLeft.opened = false;
				component.sidenavLeftType = "menu";
				fixture.detectChanges();
				component.onObserveBreakpoints(state);
				expect(component.openSidenav).toHaveBeenCalledTimes(1);
			});

			it("left sidebar should be displayed in side mode when already opened with type menu", () => {
				component.appSidenavLeft.opened = true;
				component.sidenavLeftType = "menu";
				component.sidenavLeftMode = "over";
				fixture.detectChanges();
				component.onObserveBreakpoints(state);
				expect(component.sidenavLeftMode).toBe("side");
			});
		});
	});

	describe("App sidebar events handling", () => {
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

			it("left sidebar should close and then open when left sidebar is opened and sidenavLeftType is changed", () => {
				spyOn(component, "shiftLeftSidenavCallback").and.callThrough();
				spyOn(component, "closeSidenav").and.callFake(component.shiftLeftSidenavCallback);
				component.sidenavLeftType = "menu";
				component.appSidenavLeft.opened = true;
				fixture.detectChanges();
				component.onOpenSidenav({
					sidebar: "left",
					type: "regular"
				});
				expect(component.closeSidenav).toHaveBeenCalledTimes(1);
				expect(component.shiftLeftSidenavCallback).toHaveBeenCalledTimes(1);
				expect(component.sidenavLeftType).toBe("regular");
			});
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
	});
});
