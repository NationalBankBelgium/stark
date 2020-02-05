// tslint:disable:completed-docs
import { StarkMinimapComponent } from "./minimap.component";
import { StarkMinimapItemProperties } from "./item-properties.intf";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HAMMER_LOADER } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Component, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Subject } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";
import { OverlayContainer } from "@angular/cdk/overlay";

@Component({
	selector: `host-component`,
	template: `
		<stark-minimap [visibleItems]="visibleItems" [items]="items" [mode]="mode" (showHideItem)="onShowHideItem($event)"></stark-minimap>
	`
})
class TestHostComponent {
	@ViewChild(StarkMinimapComponent, { static: true })
	public minimapComponent!: StarkMinimapComponent;
	public items?: StarkMinimapItemProperties[];
	public visibleItems?: string[];
	public mode?: string;

	public onShowHideItem(_item: StarkMinimapItemProperties): void {
		/*noop*/
	}
}

describe("MinimapComponent", () => {
	let component: StarkMinimapComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	// Rendered menu context
	let overlayContainer: OverlayContainer;
	let overlayContainerElement: HTMLElement;
	// Values
	const items: StarkMinimapItemProperties[] = [
		{ name: "column1", label: "Column 1" },
		{ name: "column2", label: "Column 2" },
		{ name: "column3", label: "Column 3" },
		{ name: "column4", label: "Column 4" }
	];
	const visibleItems: string[] = ["column1", "column2"];

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [FormsModule, MatCheckboxModule, MatTooltipModule, MatMenuModule, NoopAnimationsModule, TranslateModule.forRoot()],
			declarations: [StarkMinimapComponent, TestHostComponent],
			providers: [
				TranslateService,
				{
					// See https://github.com/NationalBankBelgium/stark/issues/1088
					provide: HAMMER_LOADER,
					useValue: (): Promise<any> => new Subject<any>().toPromise()
				}
			],
			schemas: [NO_ERRORS_SCHEMA] // to avoid errors due to "mat-icon" directive not known (which we don't want to add in these tests)
		}).compileComponents();
	}));

	beforeEach(() => {
		// OverlayContainer needs to be injected to get the context for the rendered menu dropdown
		inject([OverlayContainer], (oc: OverlayContainer) => {
			overlayContainer = oc;
			overlayContainerElement = overlayContainer.getContainerElement();
		})();

		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostFixture.detectChanges();

		component = hostComponent.minimapComponent;
	});

	// Prepare hostComponent
	beforeEach(() => {
		hostComponent.items = items;
		hostComponent.visibleItems = visibleItems;
		spyOn(hostComponent, "onShowHideItem");
		hostFixture.detectChanges();
	});

	describe("Configuration", () => {
		let menuElement: HTMLElement | null;
		let menuItemLabels: NodeListOf<HTMLLabelElement>;

		beforeEach(() => {
			// Open Menu
			const button: HTMLButtonElement = hostFixture.nativeElement.querySelector("button");
			button.click();
			hostFixture.detectChanges();

			menuElement = overlayContainerElement.querySelector(".mat-menu-panel");
			menuItemLabels = overlayContainerElement.querySelectorAll(".mat-menu-panel .mat-menu-content .mat-menu-item label");
		});

		it("clicking button should open menu", () => {
			expect(menuElement).toBeTruthy("menu should have opened");
			expect(menuItemLabels.length).toBe(items.length, "menu should show a label for all items");
		});

		it("correct items should be checked", () => {
			expect(menuItemLabels.length).toBe(items.length);
			menuItemLabels.forEach((labelElement: HTMLLabelElement) => {
				const textContainer: HTMLElement | null = labelElement.querySelector(".mat-checkbox-label");
				expect(textContainer).toBeTruthy("mat-checkbox-label should exist");
				const text: string = ((textContainer && textContainer.textContent) || "").trim();

				const inputElement: HTMLInputElement | null = labelElement.querySelector("input");
				expect(inputElement).toBeTruthy("input element should exist");
				const isChecked: boolean = (inputElement && inputElement.checked) || false;

				const item: StarkMinimapItemProperties | undefined = items.find(({ label }: StarkMinimapItemProperties) => label === text);
				expect(item).toBeTruthy("text content should match a label");
				const name: string = (item && item.name) || "";

				const isVisible: boolean = visibleItems.includes(name);

				expect(isChecked).toBe(isVisible, `input for "${name}" should${isVisible ? " " : " not "}be checked.`);
			});
		});

		it("full view should render by default", () => {
			expect(component.mode).toBeFalsy();

			const dotsElement: HTMLElement | null = hostFixture.nativeElement.querySelector("stark-minimap .stark-minimap-dots");
			expect(dotsElement).toBeTruthy("should have dots");
			if (!dotsElement) {
				return;
			}

			const dotElements: NodeListOf<HTMLElement> = dotsElement.querySelectorAll(".stark-minimap-dot");
			expect(dotElements.length).toBe(items.length);
		});

		it("compact view should be rendered", () => {
			hostComponent.mode = "compact";
			hostFixture.detectChanges();

			const dotsElement: HTMLElement | null = hostFixture.nativeElement.querySelector("stark-minimap .stark-minimap-dots");
			expect(dotsElement).toBeNull("compact view should not have dots");
		});
	});

	describe("isItemVisible", () => {
		let defaultItem: StarkMinimapItemProperties;

		beforeEach(() => {
			component.items = [];
			component.visibleItems = [];
			defaultItem = { name: "item" };
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

	describe("Events", () => {
		let menuItemLabels: NodeListOf<HTMLLabelElement>;

		beforeEach(() => {
			(<jasmine.Spy>hostComponent.onShowHideItem).calls.reset();

			// Open Menu
			const button: HTMLButtonElement = hostFixture.nativeElement.querySelector("button");
			button.click();
			hostFixture.detectChanges();

			menuItemLabels = overlayContainerElement.querySelectorAll(" .mat-menu-panel .mat-menu-content .mat-menu-item label");
		});

		it("event should be triggered with correct item for each label click", () => {
			expect(menuItemLabels.length).toBe(items.length);

			menuItemLabels.forEach((labelElement: HTMLLabelElement) => {
				const textContainer: HTMLElement | null = labelElement.querySelector(".mat-checkbox-label");
				expect(textContainer).toBeTruthy("mat-checkbox-label should exist");
				const text: string = ((textContainer && textContainer.textContent) || "").trim();
				const expectedItem: StarkMinimapItemProperties | undefined = items.find(
					({ label }: StarkMinimapItemProperties) => label === text
				);
				labelElement.click();
				expect(expectedItem).toBeDefined();
				expect(hostComponent.onShowHideItem).toHaveBeenCalledWith(<StarkMinimapItemProperties>expectedItem);
			});

			expect(hostComponent.onShowHideItem).toHaveBeenCalledTimes(items.length);
		});
	});
});
