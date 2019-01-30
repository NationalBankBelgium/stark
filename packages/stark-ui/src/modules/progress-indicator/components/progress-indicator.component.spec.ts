// tslint:disable:completed-docs
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkProgressIndicatorComponent } from "./progress-indicator.component";
import { By } from "@angular/platform-browser";

/* tslint:disable:no-big-function */
describe("ProgressIndicatorComponent", () => {
	let component: StarkProgressIndicatorComponent;
	let hostFixture: ComponentFixture<StarkProgressIndicatorComponent>;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkProgressIndicatorComponent],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
		}).compileComponents();
	}));

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

	describe("display Progress Indicator", () => {
		it("should not display the progress indicator if isShown is set to false", () => {
			component.isShown = false;
			expect(hostFixture.debugElement.query(By.css(".div"))).toBeNull();
		});

		it("should display the progress indicator if isShown is set to true", () => {
			component.isShown = true;
			expect(hostFixture.debugElement.query(By.css(".div"))).toBeDefined();
		});
	});
});
