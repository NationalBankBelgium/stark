import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatListModule } from "@angular/material/list";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppMenuItemComponent } from "./app-menu-item.component";
import { StarkMenuGroup } from "./app-menu-group.intf";

describe("AppMenuItemComponent", () => {
	@Component({
		selector: "host-component",
		template: ` <stark-app-menu-item [level]="level" [menuGroup]="menuGroup"></stark-app-menu-item> `
	})
	class TestHostComponent {
		@ViewChild(StarkAppMenuItemComponent, { static: true })
		public starkAppMenuItem!: StarkAppMenuItemComponent;

		public level?: number;
		public menuGroup: StarkMenuGroup = {
			id: "id-item",
			label: "Label",
			isVisible: true,
			isEnabled: true,
			targetState: "test"
		};
	}

	// IMPORTANT: The official way to test components using ChangeDetectionStrategy.OnPush is to wrap it with a test host component
	// see https://github.com/angular/angular/issues/12313#issuecomment-444623173
	let hostComponent: TestHostComponent;
	let component: StarkAppMenuItemComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	const mockRoutingService: MockStarkRoutingService = new MockStarkRoutingService();

	/**
	 * async beforeEach
	 */
	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkAppMenuItemComponent, TestHostComponent],
			imports: [MatExpansionModule, MatIconModule, MatIconTestingModule, MatListModule, NoopAnimationsModule, UIRouterModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_ROUTING_SERVICE, useValue: mockRoutingService }
			]
		})
			/**
			 * Compile template and css
			 */
			.compileComponents()));

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(() => {
		mockRoutingService.addTransitionHook.calls.reset();
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostComponent.level = 1;
		hostFixture.detectChanges();
		component = hostComponent.starkAppMenuItem;
		mockRoutingService.navigateTo.calls.reset();
		mockRoutingService.isCurrentUiStateIncludedIn.calls.reset();
		mockRoutingService.isCurrentUiState.calls.reset();
	});

	describe("simple menu item", () => {
		it("id should be set", () => {
			const item: HTMLElement = hostFixture.nativeElement.querySelector("#" + hostComponent.menuGroup.id);
			expect(item).toBeDefined();
		});

		it("should trigger a navigation when clicked", () => {
			const item: HTMLElement = hostFixture.nativeElement.querySelector("#" + hostComponent.menuGroup.id);
			item.click();
			hostFixture.detectChanges();

			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
		});

		it("should have the 'stark-disabled' class set when 'isEnabled' is false", () => {
			hostComponent.menuGroup = { ...hostComponent.menuGroup, isEnabled: false };
			hostFixture.detectChanges();

			const item: HTMLElement = hostFixture.nativeElement.querySelector("#" + hostComponent.menuGroup.id);
			item.click();
			hostFixture.detectChanges();

			expect(item.classList).toContain("stark-disabled");
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(0);
		});

		it("should have the 'active' class when 'isActive' is true", () => {
			const item: HTMLElement = hostFixture.nativeElement.querySelector("#" + hostComponent.menuGroup.id);
			expect(item.classList).not.toContain("active");

			component.isActive = true;
			hostFixture.detectChanges();

			expect(item.classList).toContain("active");

			component.isActive = false;
			hostFixture.detectChanges();

			expect(item.classList).not.toContain("active");
		});

		it("should be displayed when 'isVisible' is true", () => {
			hostComponent.menuGroup = { ...hostComponent.menuGroup, isVisible: false };
			hostFixture.detectChanges();

			let item: HTMLElement = hostFixture.nativeElement.querySelector("#" + hostComponent.menuGroup.id);
			expect(item).toBeFalsy();

			hostComponent.menuGroup = { ...hostComponent.menuGroup, isVisible: true };
			hostFixture.detectChanges();

			item = hostFixture.nativeElement.querySelector("#" + hostComponent.menuGroup.id);
			expect(item).toBeTruthy();
		});

		it("should dispatch 'activated' event when 'isActive' is true", () => {
			spyOn(component.activated, "emit");
			component.isActive = true;
			hostFixture.detectChanges();

			expect(component.activated.emit).toHaveBeenCalledTimes(1);
		});

		it("should dispatch 'deactivated' event when 'isActive' is false", () => {
			spyOn(component.deactivated, "emit");
			component.isActive = false;
			hostFixture.detectChanges();

			expect(component.deactivated.emit).toHaveBeenCalledTimes(1);
		});

		it("should activate when child state is selected and do not have child menu", () => {
			hostFixture.detectChanges();
			// `stateChange` is attached to `routingTransitionSuccessCallback` in `StarkAppMenuItemComponent`
			const stateChange = <() => void>mockRoutingService.addTransitionHook.calls.first().args[2];
			mockRoutingService.isCurrentUiStateIncludedIn.withArgs("test").and.returnValue(true);
			stateChange();
			expect(component.isActive).toBeTrue();
			expect(mockRoutingService.isCurrentUiStateIncludedIn).toHaveBeenCalledWith("test");
			expect(mockRoutingService.isCurrentUiState).not.toHaveBeenCalledWith("test");
		});
	});

	describe("menu item with children", () => {
		beforeEach(() => {
			hostComponent.menuGroup.entries = [
				{
					id: "id-child-1",
					label: "Child 1",
					isVisible: true,
					isEnabled: true,
					targetState: "child-1-route"
				},
				{
					id: "id-child-2",
					label: "Child 2",
					isVisible: true,
					isEnabled: true,
					targetState: "child-2-route"
				}
			];
			hostFixture.detectChanges();
		});

		it("should have an expansion panel", () => {
			const expansionPanel: HTMLElement = hostFixture.nativeElement.querySelector(".mat-expansion-panel");
			expect(expansionPanel).toBeDefined();
		});

		it("should not activate when child state is selected and do not have child menu", () => {
			hostFixture.detectChanges();
			// `stateChange` is attached to `routingTransitionSuccessCallback` in `StarkAppMenuItemComponent`
			const stateChange = <() => void>mockRoutingService.addTransitionHook.calls.first().args[2];
			mockRoutingService.isCurrentUiState.withArgs("test").and.returnValue(false);
			stateChange();
			expect(component.isActive).toBeFalse();
			expect(mockRoutingService.isCurrentUiStateIncludedIn).not.toHaveBeenCalledWith("test");
			expect(mockRoutingService.isCurrentUiState).toHaveBeenCalledWith("test");
		});
	});
});
