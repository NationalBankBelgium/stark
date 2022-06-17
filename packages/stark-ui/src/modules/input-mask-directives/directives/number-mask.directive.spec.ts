/* tslint:disable:completed-docs no-duplicate-string no-identical-functions no-big-function */
import { Component, DebugElement } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Observer } from "rxjs";
import { StarkNumberMaskDirective } from "./number-mask.directive";
import { StarkNumberMaskConfig } from "./number-mask-config.intf";
import { IMaskModule } from "angular-imask";

describe("NumberMaskDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;
	let inputElement: DebugElement;

	const numberMaskConfig: StarkNumberMaskConfig = {
		prefix: "",
		suffix: ""
	};

	@Component({
		selector: "test-component",
		template: getTemplate("[starkNumberMaskNew]='numberMaskConfig'")
	})
	class TestComponent {
		public numberMaskConfig: StarkNumberMaskConfig = numberMaskConfig;
		public ngModelValue = "";
		public formControl = new FormControl("");
	}

	function getTemplate(numberMaskDirective: string): string {
		return "<input " + "type='text' " + numberMaskDirective + ">";
	}

	function initializeComponentFixture(): void {
		fixture = TestBed.createComponent(TestComponent);
		hostComponent = fixture.componentInstance;
		inputElement = fixture.debugElement.query(By.css("input"));
		// trigger initial data binding
		fixture.detectChanges();
	}

	function changeInputValue(inputDebugElement: DebugElement, value: string, eventType: string = "input"): void {
		(<HTMLInputElement>inputDebugElement.nativeElement).value = value;

		// more verbose way to create and trigger an event (the only way it works in IE)
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
		const ev: Event = document.createEvent("Event");
		ev.initEvent(eventType, true, true);
		(<HTMLInputElement>inputDebugElement.nativeElement).dispatchEvent(ev);
	}

	// Inject module dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [StarkNumberMaskDirective, TestComponent],
			imports: [FormsModule, ReactiveFormsModule, IMaskModule],
			providers: []
		});
	});

	describe("uncontrolled", () => {
		beforeEach(
			waitForAsync(() => {
				// compile template and css
				return TestBed.compileComponents();
			})
		);

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkNumberMask directive
		});

		xit("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "12345", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("12,345");
			}

			const invalidEvents: string[] = ["blur", "keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "12345", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("12345"); // no mask shown
			}
		});

		xit("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["a", " ", "/*-+,."];

			for (const value of invalidValues) {
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("");
			}

			const invalidNumericValues: string[] = ["1-2-3.4.5", "+1*23-4/5", ".1.234,5"];

			for (const numericValue of invalidNumericValues) {
				changeInputValue(inputElement, numericValue);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("12,345");
			}
		});

		xit("should refresh the mask whenever the configuration changes", () => {
			changeInputValue(inputElement, "12345");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12,345");

			hostComponent.numberMaskConfig = {
				...numberMaskConfig,
				prefix: "%",
				suffix: " percent",
				thousandsSeparatorSymbol: "-"
			};
			fixture.detectChanges();

			changeInputValue(inputElement, "12345");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("%12-345 percent");
		});

		it("should remove the mask when the config is undefined", () => {
			changeInputValue(inputElement, "12345");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12,345");

			hostComponent.numberMaskConfig = <any>undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "whatever+1*23-4/5");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("whatever+1*23-4/5"); // no mask at all
		});
	});

	describe("with ngModel", () => {
		beforeEach(
			waitForAsync(() => {
				const newTemplate: string = getTemplate("[(ngModel)]='ngModelValue' [starkNumberMaskNew]='numberMaskConfig'");

				TestBed.overrideTemplate(TestComponent, newTemplate);

				// compile template and css
				return TestBed.compileComponents();
			})
		);

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkNumberMask directive
		});

		xit("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.ngModelValue).toBe("");

				changeInputValue(inputElement, "12345", eventType);
				fixture.detectChanges();

				expect(hostComponent.ngModelValue).toBe("12,345");
			}

			const invalidEvents: string[] = ["blur", "keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.ngModelValue).toBe("");

				changeInputValue(inputElement, "12345", eventType);
				fixture.detectChanges();

				// IMPORTANT: the ngModel is not changed with invalid events, just with "input" events
				expect(hostComponent.ngModelValue).toBe(""); // no mask shown
			}
		});

		xit("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["a", " ", "/*-+,."];

			for (const value of invalidValues) {
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(hostComponent.ngModelValue).toBe("");
			}

			const invalidNumericValues: string[] = ["1-2-3.4.5", "+1*23-4/5", ".1.234,5"];

			for (const numericValue of invalidNumericValues) {
				changeInputValue(inputElement, numericValue);
				fixture.detectChanges();

				expect(hostComponent.ngModelValue).toBe("12,345");
			}
		});

		// FIXME NG0100: ExpressionChangedAfterItHasBeenCheckedError - #2860 https://github.com/NationalBankBelgium/stark/issues/2860
		xit("should refresh the mask whenever the configuration changes", () => {
			changeInputValue(inputElement, "12345");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12,345");

			hostComponent.numberMaskConfig = {
				...numberMaskConfig,
				prefix: "%",
				suffix: " percent",
				thousandsSeparatorSymbol: "-"
			};
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("%12-345 percent");
		});

		xit("should remove the mask when the config is undefined", () => {
			changeInputValue(inputElement, "12345");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12,345");

			hostComponent.numberMaskConfig = <any>undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "whatever+1*23-4/5");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("whatever+1*23-4/5"); // no mask at all
		});
	});

	describe("with FormControl", () => {
		let mockValueChangeObserver: jasmine.SpyObj<Observer<any>>;

		beforeEach(
			waitForAsync(() => {
				const newTemplate: string = getTemplate("[formControl]='formControl' [starkNumberMaskNew]='numberMaskConfig'");

				TestBed.overrideTemplate(TestComponent, newTemplate);

				// compile template and css
				return TestBed.compileComponents();
			})
		);

		beforeEach(() => {
			initializeComponentFixture();

			mockValueChangeObserver = jasmine.createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			hostComponent.formControl.valueChanges.subscribe(mockValueChangeObserver);
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkNumberMask directive
		});

		xit("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.formControl.value).toBe("");
				// FIXME Check why it is called twice instead of once
				expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

				mockValueChangeObserver.next.calls.reset();
				changeInputValue(inputElement, "12345", eventType);
				fixture.detectChanges();

				expect(hostComponent.formControl.value).toBe("12,345");
				// FIXME Check why it is called twice instead of once
				expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
				expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
			}

			mockValueChangeObserver.next.calls.reset();
			const invalidEvents: string[] = ["blur", "keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.formControl.value).toBe("");
				// FIXME Check why it is called twice instead of once
				expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

				mockValueChangeObserver.next.calls.reset();
				changeInputValue(inputElement, "12345", eventType);
				fixture.detectChanges();

				// IMPORTANT: the formControl is not changed with invalid events, just with "input" events
				expect(hostComponent.formControl.value).toBe(""); // no mask shown
				expect(mockValueChangeObserver.next).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
			}
		});

		xit("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["a", " ", "/*-+,."];

			for (const value of invalidValues) {
				mockValueChangeObserver.next.calls.reset();
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(hostComponent.formControl.value).toBe("");
				// FIXME Check why it is called twice instead of once
				expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
				expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
			}

			const invalidNumericValues: string[] = ["1-2-3.4.5", "+1*23-4/5", ".1.234,5"];

			for (const numericValue of invalidNumericValues) {
				mockValueChangeObserver.next.calls.reset();
				changeInputValue(inputElement, numericValue);
				fixture.detectChanges();

				expect(hostComponent.formControl.value).toBe("12,345");
				// FIXME Check why it is called twice instead of once
				expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
				expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
			}
		});

		xit("should refresh the mask whenever the configuration changes", () => {
			changeInputValue(inputElement, "12345");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("12,345");
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

			mockValueChangeObserver.next.calls.reset();
			hostComponent.numberMaskConfig = {
				...numberMaskConfig,
				prefix: "%",
				suffix: " percent",
				thousandsSeparatorSymbol: "-"
			};
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("%12-345 percent");
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
		});

		xit("should remove the mask when the config is undefined", () => {
			changeInputValue(inputElement, "12345");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("12,345");
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

			mockValueChangeObserver.next.calls.reset();
			hostComponent.numberMaskConfig = <any>undefined;
			fixture.detectChanges();
			expect(mockValueChangeObserver.next).not.toHaveBeenCalled(); // no value change, the mask was just disabled

			mockValueChangeObserver.next.calls.reset();
			changeInputValue(inputElement, "whatever+1*23-4/5");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("whatever+1*23-4/5"); // no mask at all
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
		});
	});
});
