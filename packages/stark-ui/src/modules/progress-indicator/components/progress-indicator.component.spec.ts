import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkProgressIndicatorComponent } from "./progress-indicator.component";
import { By } from "@angular/platform-browser";

describe("ProgressIndicatorComponent", () => {
	let component: StarkProgressIndicatorComponent;
	let hostFixture: ComponentFixture<StarkProgressIndicatorComponent>;

	beforeEach(
		waitForAsync(() =>
			TestBed.configureTestingModule({
				declarations: [StarkProgressIndicatorComponent],
				providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
			}).compileComponents()
		)
	);

	beforeEach(() => {
		hostFixture = TestBed.createComponent(StarkProgressIndicatorComponent);
		component = hostFixture.componentInstance;
		hostFixture.detectChanges();
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});
	});

	describe("progress indicator", () => {
		it("should be correctly displayed", () => {
			const progressIndicator = hostFixture.debugElement.query(By.css("div.stark-loading-icon"));
			expect(progressIndicator).toBeTruthy();
		});
	});
});
