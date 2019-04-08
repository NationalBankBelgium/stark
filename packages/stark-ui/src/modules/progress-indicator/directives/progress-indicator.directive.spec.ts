// tslint:disable:completed-docs
import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import {
	STARK_PROGRESS_INDICATOR_SERVICE,
	StarkProgressIndicatorConfig,
	StarkProgressIndicatorDirective,
	StarkProgressIndicatorType
} from "@nationalbankbelgium/stark-ui";
import { MockStarkProgressIndicatorService } from "../testing/progress-indicator.mock";
import { StarkProgressIndicatorComponent } from "../components/progress-indicator.component";

@Component({
	selector: "test-component",
	template: `
		<div [starkProgressIndicator]="starkProgressIndicatorConfig"></div>
	`
})
class TestComponent {
	public starkProgressIndicatorConfig?: StarkProgressIndicatorConfig;
}

describe("StarkProgressIndicator", () => {
	let hostFixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;

	const mockStarkProgressIndicatorService = new MockStarkProgressIndicatorService();

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			imports: [],
			declarations: [TestComponent, StarkProgressIndicatorComponent, StarkProgressIndicatorDirective],
			providers: [
				{ provide: STARK_PROGRESS_INDICATOR_SERVICE, useValue: mockStarkProgressIndicatorService },
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }
			]
		})
			.overrideModule(BrowserDynamicTestingModule, {
				// FIXME review after https://github.com/angular/angular/issues/10760
				// add entryComponent to TestingModule (suggested in https://github.com/angular/angular/issues/10760#issuecomment-250522300)
				set: { entryComponents: [StarkProgressIndicatorComponent] }
			})
			.compileComponents();
	}));

	beforeEach(() => {
		mockStarkProgressIndicatorService.isVisible.and.returnValue(new Observable());

		hostFixture = TestBed.createComponent(TestComponent);
		hostComponent = hostFixture.componentInstance;
	});

	it("should throw error when StarkProgressIndicatorConfig is not set", () => {
		hostComponent.starkProgressIndicatorConfig = undefined;

		expect(() => hostFixture.detectChanges()).toThrowError(
			"StarkProgressIndicatorDirective: a StarkProgressIndicatorConfig is required."
		);
	});

	it("should not throw error when StarkProgressIndicatorConfig is set", () => {
		hostComponent.starkProgressIndicatorConfig = { topic: "something", type: StarkProgressIndicatorType.SPINNER };
		expect(() => hostFixture.detectChanges()).not.toThrowError();
	});
});
