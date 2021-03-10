/* tslint:disable:completed-docs no-lifecycle-call */
import { Observable, of, Subject } from "rxjs";
import { Component, ViewChild } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkProgressIndicatorType, StarkProgressIndicatorConfig } from "../entities";
import { StarkProgressIndicatorDirective } from "../directives";
import { STARK_PROGRESS_INDICATOR_SERVICE } from "../services";
import { MockStarkProgressIndicatorService } from "@nationalbankbelgium/stark-ui/testing";
import { StarkProgressIndicatorComponent } from "../components";

@Component({
	selector: "test-component",
	template: ` <div id="host-element" [starkProgressIndicator]="starkProgressIndicatorConfig"></div> `
})
class TestComponent {
	public starkProgressIndicatorConfig?: StarkProgressIndicatorConfig;

	@ViewChild(StarkProgressIndicatorDirective)
	public progressIndicatorDirective!: StarkProgressIndicatorDirective;
}

describe("ProgressIndicatorDirective", () => {
	let hostFixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;
	const hostElementSelector = "#host-element";
	const mockConfig: StarkProgressIndicatorConfig = { topic: "some-topic", type: StarkProgressIndicatorType.SPINNER };

	let mockStarkProgressIndicatorService!: MockStarkProgressIndicatorService;

	beforeEach(async(() => {
		mockStarkProgressIndicatorService = new MockStarkProgressIndicatorService();

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

	describe("on initialization", () => {
		describe("failure", () => {
			it("should throw error when StarkProgressIndicatorConfig is not set", () => {
				hostComponent.starkProgressIndicatorConfig = undefined;

				expect(() => hostFixture.detectChanges()).toThrowError(
					"StarkProgressIndicatorDirective: a StarkProgressIndicatorConfig is required."
				);
			});
		});

		describe("success", () => {
			beforeEach(() => {
				mockStarkProgressIndicatorService.isVisible.and.returnValue(of(false));
				hostComponent.starkProgressIndicatorConfig = mockConfig;

				hostFixture.detectChanges();
			});

			it("should register itself to the service", () => {
				expect(mockStarkProgressIndicatorService.register).toHaveBeenCalledTimes(1);
				expect(mockStarkProgressIndicatorService.register).toHaveBeenCalledWith(
					mockConfig.topic,
					<StarkProgressIndicatorType>(<unknown>StarkProgressIndicatorType[mockConfig.type])
				);
			});

			it("should subscribe to the service to be notified when the indicator for the given topic should be visible/hidden", () => {
				expect(mockStarkProgressIndicatorService.isVisible).toHaveBeenCalledTimes(1);
				expect(mockStarkProgressIndicatorService.isVisible).toHaveBeenCalledWith(mockConfig.topic);
			});
		});
	});

	describe("show/hide", () => {
		let isVisible$: Subject<boolean>;

		beforeEach(() => {
			isVisible$ = new Subject();
			mockStarkProgressIndicatorService.isVisible.and.returnValue(isVisible$);
			hostComponent.starkProgressIndicatorConfig = mockConfig;

			hostFixture.detectChanges();
		});

		it("should show/hide the host element and simultaneously hide/show the progress indicator", () => {
			expect(mockStarkProgressIndicatorService.register).toHaveBeenCalledTimes(1);

			let progressIndicatorComponent = hostFixture.debugElement.query(By.directive(StarkProgressIndicatorComponent));
			const hostElement = hostFixture.debugElement.query(By.css(hostElementSelector));

			expect(hostElement).toBeTruthy();
			expect(hostElement.classes).toEqual({}); // host element should be shown
			expect(progressIndicatorComponent).toBeFalsy(); // progress indicator should be hidden

			isVisible$.next(true); // show
			progressIndicatorComponent = hostFixture.debugElement.query(By.directive(StarkProgressIndicatorComponent));

			expect(hostElement.classes).toEqual({ "stark-hide": true }); // host element should be hidden
			expect(progressIndicatorComponent).toBeTruthy(); // progress indicator should be shown

			isVisible$.next(false); // hide again
			progressIndicatorComponent = hostFixture.debugElement.query(By.directive(StarkProgressIndicatorComponent));

			expect(hostElement.classes).toEqual({ "stark-hide": false }); // host element should be shown
			expect(progressIndicatorComponent).toBeFalsy(); // progress indicator should be hidden
		});
	});

	describe("ngOnDestroy", () => {
		beforeEach(() => {
			mockStarkProgressIndicatorService.isVisible.and.returnValue(of(true));
			hostComponent.starkProgressIndicatorConfig = mockConfig;

			hostFixture.detectChanges();
		});

		it("should destroy the progress indicator and leave only the host element", () => {
			let progressIndicatorComponent = hostFixture.debugElement.query(By.directive(StarkProgressIndicatorComponent));
			let hostElement = hostFixture.debugElement.query(By.css(hostElementSelector));

			expect(hostElement).toBeTruthy();
			expect(progressIndicatorComponent).toBeTruthy(); // progress indicator should be shown

			hostComponent.progressIndicatorDirective.ngOnDestroy();

			hostElement = hostFixture.debugElement.query(By.css(hostElementSelector));
			expect(hostElement).toBeTruthy();
			progressIndicatorComponent = hostFixture.debugElement.query(By.directive(StarkProgressIndicatorComponent));
			expect(progressIndicatorComponent).toBeFalsy(); // progress indicator should be removed
		});

		it("should de-register itself from the service", () => {
			hostComponent.progressIndicatorDirective.ngOnDestroy();

			expect(mockStarkProgressIndicatorService.deregister).toHaveBeenCalledTimes(1);
			expect(mockStarkProgressIndicatorService.deregister).toHaveBeenCalledWith(mockConfig.topic);
		});
	});
});
