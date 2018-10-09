//tslint:disable:no-commented-code completed-docs
import { StarkMinimapComponent } from "./minimap.component";
import { StarkMinimapItemProperties } from "./item-properties.intf";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { Component, EventEmitter, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ItemVisibility } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: `host-component`,
	template: `<stark-minimap [visibleItems]="visibleItems" [items]="items"></stark-minimap>`
})
class TestHostComponent {
	@ViewChild(StarkMinimapComponent)
	public minimapComponent: StarkMinimapComponent;
	public items: StarkMinimapItemProperties[];
	public visibleItems: string[];
}

/* tslint:disable:no-big-function */
describe("MinimapComponent", () => {
	let component: StarkMinimapComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	let defaultItem: StarkMinimapItemProperties;
	let defaultItemVisibility: ItemVisibility;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [FormsModule, MatCheckboxModule, MatTooltipModule, NoopAnimationsModule, TranslateModule.forRoot()],
			declarations: [StarkMinimapComponent, TestHostComponent],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, TranslateService],
			schemas: [NO_ERRORS_SCHEMA] // to avoid errors due to "mat-icon" directive not known (which we don't want to add in these tests)
		}).compileComponents();
	}));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostFixture.detectChanges();

		component = hostComponent.minimapComponent;
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
			expect(component.items).toBeUndefined();
			expect(component.visibleItems).toBeUndefined();
		});
	});

	describe("toggleDropdownMenu", () => {
		it("should set TRUE if customMenu is displayed", () => {
			component.isDisplayedMenu = false;
			component.toggleDropdownMenu();
			expect(component.isDisplayedMenu).toBe(true);
		});

		it("should set FALSE if customMenu is hidden", () => {
			component.isDisplayedMenu = true;
			component.toggleDropdownMenu();
			expect(component.isDisplayedMenu).toBe(false);
		});
	});

	describe("getItemLabel", () => {
		it("should return the label of item when it is declared in minimapItemsProperties", () => {
			const getItemLabel: string = component.getItemLabel({ name: "column1", label: "Test label" });
			expect(getItemLabel).toEqual("Test label");
		});

		it("should return the item name of item when it is not declared in minimapItemsProperties", () => {
			const getItemLabel: string = component.getItemLabel({ name: "column2" });
			expect(getItemLabel).toEqual("column2");
		});
	});

	describe("isItemVisible", () => {
		beforeEach(() => {
			component.items = [];
			component.visibleItems = [];
			defaultItem = {
				name: "item"
			};
		});

		it("should return FALSE if item is NOT present in visibleItems array", () => {
			const isVisibleColumn: boolean = component.isItemVisible(defaultItem);
			expect(isVisibleColumn).toBe(false);
		});

		it("should return TRUE if item is present in visibleItems array", () => {
			component.visibleItems.push(defaultItem.name);
			const isVisibleColumn: boolean = component.isItemVisible(defaultItem);
			expect(isVisibleColumn).toBe(true);
		});
	});

	describe("triggerShowHideItem", () => {
		beforeEach(() => {
			defaultItem = {
				name: "item"
			};
			defaultItemVisibility = {
				isVisible: true,
				item: {
					name: "item"
				}
			};
		});

		it("should trigger the callback showHideItem method with item as argument if callback is defined", () => {
			const showHideItemSpy: SpyObj<EventEmitter<any>> = createSpyObj("showHideItem", ["emit"]);
			component.items = [];
			component.visibleItems = [];
			component.showHideItem = <any>showHideItemSpy;
			component.triggerShowHideItem(defaultItem);

			expect(showHideItemSpy.emit).toHaveBeenCalledTimes(1);
			expect(showHideItemSpy.emit).toHaveBeenCalledWith(defaultItemVisibility);
		});
	});
});
