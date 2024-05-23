/* eslint-disable @angular-eslint/component-max-inline-declarations, @angular-eslint/no-lifecycle-call */
import { StarkAppDataComponent, StarkAppDataComponentMode } from "./app-data.component";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { fakeAsync, inject, tick, ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ViewChild, Component } from "@angular/core";
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
	@ViewChild(StarkAppDataComponent, { static: true })
	public appDataComponent!: StarkAppDataComponent;
	public mode?: StarkAppDataComponentMode;
}

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

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkAppDataComponent, TestHostComponent],
			imports: [
				CommonModule,
				MatButtonModule,
				MatIconModule,
				MatIconTestingModule,
				MatMenuModule,
				MatTooltipModule,
				NoopAnimationsModule,
				TranslateModule.forRoot()
			],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: mockLogger }, TranslateService]
		}).compileComponents()));

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
