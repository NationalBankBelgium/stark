/* tslint:disable:completed-docs no-duplicate-string no-identical-functions no-big-function */
import { Component, DebugElement } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Observer } from "rxjs";
import { BooleanInput } from "@angular/cdk/coercion";
import { StarkEmailMaskDirective } from "./email-mask.directive";
import { IMaskModule } from "angular-imask";

describe("EmailMaskDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;
	let inputElement: DebugElement;

	@Component({
		selector: "test-component",
		template: getTemplate("[starkEmailMask]='emailMaskConfig'")
	})
	class TestComponent {
		public emailMaskConfig: BooleanInput = true;
		public ngModelValue = "";
		public formControl = new FormControl("");
	}

	function getTemplate(emailMaskNewDirective: string): string {
		return "<input " + "type='text' " + emailMaskNewDirective + ">";
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
			declarations: [StarkEmailMaskDirective, TestComponent],
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
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkEmailMask directive
		});

		it("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "my-email@", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("my-email@.");
			}

			const invalidEvents: string[] = ["blur", "keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "my-email", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("my-email"); // no mask shown
			}
		});

		xit("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["@@", "@.a.", " @ .", "what@.ever@."];

			for (const value of invalidValues) {
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("@.");
			}
		});

		xit("should remove the mask only when the config is set to false", () => {
			changeInputValue(inputElement, "my-email@");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("my-email@.");

			hostComponent.emailMaskConfig = undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "what@.ever@.");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("my-email@."); // the mask is enabled by default

			hostComponent.emailMaskConfig = ""; // use case when the directive is used with no inputs: <input type='text' starkEmailMask>
			fixture.detectChanges();

			changeInputValue(inputElement, "what@.ever@.");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("my-email@ ."); // the mask is enabled by default

			hostComponent.emailMaskConfig = false;
			fixture.detectChanges();

			changeInputValue(inputElement, "what@@.ever@.");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("what@@.ever@."); // no mask at all
		});
	});

	describe("with ngModel", () => {
		beforeEach(
			waitForAsync(() => {
				const newTemplate: string = getTemplate("[(ngModel)]='ngModelValue' [starkEmailMask]='emailMaskConfig'");

				TestBed.overrideTemplate(TestComponent, newTemplate);

				// compile template and css
				return TestBed.compileComponents();
			})
		);

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkEmailMask directive
		});

		xit("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.ngModelValue).toBe("");

				changeInputValue(inputElement, "my-email@", eventType);
				fixture.detectChanges();

				expect(hostComponent.ngModelValue).toBe("my-email@ .");
			}

			const invalidEvents: string[] = ["blur", "keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.ngModelValue).toBe("");

				changeInputValue(inputElement, "my-email@", eventType);
				fixture.detectChanges();

				// IMPORTANT: the ngModel is not changed with invalid events, just with "input" events
				expect(hostComponent.ngModelValue).toBe(""); // no mask shown
			}
		});

		xit("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["@@", "@.a.", " @ .", "what@.ever@."];

			for (const value of invalidValues) {
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(hostComponent.ngModelValue).toBe("");
			}
		});

		xit("should remove the mask only when the config is set to false", () => {
			changeInputValue(inputElement, "my-email@");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("my-email@ .");

			hostComponent.emailMaskConfig = undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "what@.ever@.");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("my-email@ ."); // the mask is enabled by default

			hostComponent.emailMaskConfig = ""; // use case when the directive is used with no inputs: <input type='text' [(ngModel)]='ngModelValue' starkEmailMask>
			fixture.detectChanges();

			changeInputValue(inputElement, "what@.ever@.");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("my-email@ ."); // the mask is enabled by default

			hostComponent.emailMaskConfig = false;
			fixture.detectChanges();

			changeInputValue(inputElement, "what@@.ever@.");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("what@@.ever@."); // no mask at all
		});
	});

	describe("with FormControl", () => {
		let mockValueChangeObserver: jasmine.SpyObj<Observer<any>>;

		beforeEach(
			waitForAsync(() => {
				const newTemplate: string = getTemplate("[formControl]='formControl' [starkEmailMask]='emailMaskConfig'");

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
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkEmailMask directive
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
				changeInputValue(inputElement, "my-email@", eventType);
				fixture.detectChanges();

				expect(hostComponent.formControl.value).toBe("my-email@ .");
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
				changeInputValue(inputElement, "my-email@", eventType);
				fixture.detectChanges();

				// IMPORTANT: the formControl is not changed with invalid events, just with "input" events
				expect(hostComponent.formControl.value).toBe(""); // no mask shown
				expect(mockValueChangeObserver.next).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
			}
		});

		xit("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["@@", "@.a.", " @ .", "what@.ever@."];

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
		});

		xit("should remove the mask when the config is undefined", () => {
			changeInputValue(inputElement, "my-email@");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("my-email@ .");
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

			mockValueChangeObserver.next.calls.reset();
			hostComponent.emailMaskConfig = undefined;
			fixture.detectChanges();
			expect(mockValueChangeObserver.next).not.toHaveBeenCalled(); // no value change, the mask is enabled by default

			mockValueChangeObserver.next.calls.reset();
			changeInputValue(inputElement, "what@.ever@.");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("my-email@ ."); // the mask is enabled by default
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

			mockValueChangeObserver.next.calls.reset();
			hostComponent.emailMaskConfig = ""; // use case when the directive is used with no inputs: <input type='text' [formControl]='formControl' starkEmailMask>
			fixture.detectChanges();
			expect(mockValueChangeObserver.next).not.toHaveBeenCalled(); // no value change, the mask is enabled by default

			mockValueChangeObserver.next.calls.reset();
			changeInputValue(inputElement, "what@.ever@.");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("my-email@ ."); // the mask is enabled by default
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

			mockValueChangeObserver.next.calls.reset();
			hostComponent.emailMaskConfig = false;
			fixture.detectChanges();
			expect(mockValueChangeObserver.next).not.toHaveBeenCalled(); // no value change, the mask was just disabled

			mockValueChangeObserver.next.calls.reset();
			changeInputValue(inputElement, "what@@.ever@.");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("what@@.ever@."); // no mask at all
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
		});
	});
});
