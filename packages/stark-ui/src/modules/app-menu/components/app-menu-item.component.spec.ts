/*tslint:disable:completed-docs*/
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/compiler/src/core";
import { UIRouterModule } from "@uirouter/angular";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppMenuItemComponent } from "./app-menu-item.component";
import Spy = jasmine.Spy;

describe("StarkAppMenuItemComponent", () => {
	let component: StarkAppMenuItemComponent;
	let fixture: ComponentFixture<StarkAppMenuItemComponent>;
	const mockRoutingService: MockStarkRoutingService = new MockStarkRoutingService();

	/**
	 * async beforeEach
	 */
	beforeEach(async(() => {
		return (
			TestBed.configureTestingModule({
				declarations: [StarkAppMenuItemComponent],
				imports: [MatExpansionModule, MatListModule, NoopAnimationsModule, UIRouterModule],
				providers: [
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					{ provide: STARK_ROUTING_SERVICE, useValue: mockRoutingService }
				],
				schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes (svgIcon)
			})
				/**
				 * Compile template and css
				 */
				.compileComponents()
		);
	}));

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(() => {
		fixture = TestBed.createComponent(StarkAppMenuItemComponent);
		component = fixture.componentInstance;
		component.menuGroup = {
			id: "id-item",
			label: "Label",
			isVisible: true,
			isEnabled: true,
			targetState: "test"
		};
		component.level = 1;
		fixture.detectChanges();
		(<Spy>mockRoutingService.navigateTo).calls.reset();
	});

	describe("Simple menu item", () => {
		it("id should be set", () => {
			const item: HTMLElement = fixture.nativeElement.querySelector("#" + component.menuGroup.id);
			expect(item).toBeDefined();
		});

		it("should navigate", () => {
			const item: HTMLElement = fixture.nativeElement.querySelector("#" + component.menuGroup.id);
			item.click();
			fixture.detectChanges();
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(1);
		});

		it("should be set to disabled", () => {
			component.menuGroup.isEnabled = false;
			const item: HTMLElement = fixture.nativeElement.querySelector("#" + component.menuGroup.id);
			fixture.detectChanges();
			item.click();
			fixture.detectChanges();
			expect(item.classList).toContain("stark-disabled");
			expect(mockRoutingService.navigateTo).toHaveBeenCalledTimes(0);
		});

		it("should be set to visible", () => {
			component.menuGroup.isVisible = false;
			fixture.detectChanges();
			const item: HTMLElement = fixture.nativeElement.querySelector("#" + component.menuGroup.id);
			expect(item).toBeNull();

			component.menuGroup.isVisible = true;
			fixture.detectChanges();
			expect(item).toBeDefined();
		});

		it("should dispatch activated event", () => {
			spyOn(component.activated, "emit");
			component.isActive = true;
			fixture.detectChanges();
			expect(component.activated.emit).toHaveBeenCalledTimes(1);
		});

		it("should dispatch deactivated event", () => {
			spyOn(component.deactivated, "emit");
			component.isActive = false;
			fixture.detectChanges();
			expect(component.deactivated.emit).toHaveBeenCalledTimes(1);
		});
	});

	describe("Menu item with children", () => {
		beforeEach(() => {
			component.menuGroup.entries = [
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
			fixture.detectChanges();
		});

		it("should have an expension panel", () => {
			const expansionPanel: HTMLElement = fixture.nativeElement.querySelector(".mat-expansion-panel");
			expect(expansionPanel).toBeDefined();
		});
	});
});
