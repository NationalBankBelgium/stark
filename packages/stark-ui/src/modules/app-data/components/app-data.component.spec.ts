/* tslint:disable:completed-docs component-max-inline-declarations no-lifecycle-call */
import { StarkAppDataComponent, StarkAppDataComponentMode } from "./app-data.component";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { async, fakeAsync, inject, tick, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HAMMER_LOADER } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { OverlayContainer } from "@angular/cdk/overlay";

@Component({
	selector: `host-component`,
	template: `
		<stark-app-data [mode]="mode">
			<div class="summary-slot">This is the summary</div>
			<div class="detail-slot">This is the detail</div>
		</stark-app-data>
	`
})
class TestHostComponent {
	@ViewChild(StarkAppDataComponent)
	public appDataComponent!: StarkAppDataComponent;
	public mode?: StarkAppDataComponentMode;
}

// tslint:disable:no-big-function no-identical-functions
describe("AppDataComponent", () => {
	let component: StarkAppDataComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	// Rendered menu context
	let overlayContainer: OverlayContainer;
	let overlayContainerElement: HTMLElement;

	const detailSlotContent = "This is the detail";
	const summarySlotContent = "This is the summary";

	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkAppDataComponent, TestHostComponent],
			imports: [
				CommonModule,
				MatButtonModule,
				MatIconModule,
				MatMenuModule,
				MatTooltipModule,
				NoopAnimationsModule,
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger },
				{
					// See https://github.com/NationalBankBelgium/stark/issues/1088
					provide: HAMMER_LOADER,
					useValue: (): Promise<any> => new Subject<any>().toPromise()
				},
				TranslateService
			],
			schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes (svgIcon)
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

		component = hostComponent.appDataComponent;
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(hostComponent).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});
	});

	describe("using 'dropdown' mode", () => {
		// Prepare hostComponent
		beforeEach(() => {
			hostComponent.mode = "dropdown";
			hostFixture.detectChanges();
		});

		describe("summary", () => {
			it("should display the summary content", () => {
				const summary: HTMLElement = hostFixture.nativeElement.querySelector(".stark-app-data-summary");
				expect(summary).toBeDefined();
				expect(summary.innerText).toContain(summarySlotContent);
			});
		});

		describe("detail", () => {
			it("detail information should NOT be displayed on init", () => {
				expect(overlayContainerElement.textContent).toBe("");
			});

			describe("open detail", () => {
				beforeEach(() => {
					// Open Detail
					const button: HTMLButtonElement = hostFixture.nativeElement.querySelector(".stark-app-data.dropdown button");
					button.click();
					hostFixture.detectChanges();
				});

				it("clicking button should display detail information", () => {
					expect(overlayContainerElement.textContent).toBe(detailSlotContent);
					const matPanelElement = <HTMLElement>overlayContainerElement.querySelector(".mat-menu-panel");
					expect(matPanelElement.classList).toContain("stark-app-data");
					expect(matPanelElement.classList).toContain("dropdown-detail");
				});

				it("clicking outside the mat-menu-panel should close the detail", fakeAsync(() => {
					const backdrop = <HTMLElement>overlayContainerElement.querySelector(".cdk-overlay-backdrop");
					backdrop.click();
					hostFixture.detectChanges();
					tick(500);

					expect(overlayContainerElement.textContent).toBe("");
				}));

				it("clicking inside the mat-menu-panel should NOT close the detail", fakeAsync(() => {
					const detail = <HTMLElement>overlayContainerElement.querySelector(".stark-app-data-detail");
					expect(detail).not.toBeNull();
					detail.click();
					hostFixture.detectChanges();
					tick(500);

					expect(overlayContainerElement.textContent).toBe(detailSlotContent);
				}));
			});
		});
	});

	describe("using 'menu' mode", () => {
		// Prepare hostComponent
		beforeEach(() => {
			hostComponent.mode = "menu";
			hostFixture.detectChanges();
		});

		describe("summary", () => {
			it("should NOT display the summary content", () => {
				const summary: HTMLElement | null = hostFixture.nativeElement.querySelector(".stark-app-data-summary");
				expect(summary).toBeNull();
			});
		});

		describe("detail", () => {
			it("detail information should NOT be displayed on init", () => {
				expect(overlayContainerElement.textContent).toBe("");
			});

			describe("open detail", () => {
				beforeEach(() => {
					// Open Detail
					const button: HTMLButtonElement = hostFixture.nativeElement.querySelector(".stark-app-data.menu button");
					button.click();
					hostFixture.detectChanges();
				});

				it("clicking button should display detail information", () => {
					expect(overlayContainerElement.textContent).toBe(detailSlotContent);
					const matPanelElement = <HTMLElement>overlayContainerElement.querySelector(".mat-menu-panel");
					expect(matPanelElement.classList).toContain("stark-app-data");
					expect(matPanelElement.classList).toContain("menu-detail");
				});

				it("clicking outside the mat-menu-panel should close the detail", fakeAsync(() => {
					const backdrop = <HTMLElement>overlayContainerElement.querySelector(".cdk-overlay-backdrop");
					backdrop.click();
					hostFixture.detectChanges();
					tick(500);

					expect(overlayContainerElement.textContent).toBe("");
				}));

				it("clicking inside the mat-menu-panel should NOT close the detail", fakeAsync(() => {
					expect(overlayContainerElement.textContent).toBe(detailSlotContent);

					const detail = <HTMLElement>overlayContainerElement.querySelector(".stark-app-data-detail");
					expect(detail).not.toBeNull();
					detail.click();
					hostFixture.detectChanges();
					tick(500);

					expect(overlayContainerElement.textContent).toBe(detailSlotContent);
				}));
			});
		});
	});
});
