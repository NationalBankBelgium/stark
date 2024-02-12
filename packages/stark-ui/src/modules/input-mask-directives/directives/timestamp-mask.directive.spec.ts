import { Component, DebugElement } from "@angular/core";
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { Observer } from "rxjs";
import { StarkTimestampMaskDirective } from "./timestamp-mask.directive";
import { StarkTimestampMaskConfig } from "./timestamp-mask-config.intf";

describe("TimestampMaskDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;
	let inputElement: DebugElement;

	const timestampMaskConfig: StarkTimestampMaskConfig = {
		format: "DD/MM/YYYY"
	};

	@Component({
		selector: "test-component",
		template: getTemplate("[starkTimestampMask]='timestampMaskConfig'")
	})
	class TestComponent {
		public timestampMaskConfig: StarkTimestampMaskConfig = timestampMaskConfig;
		public ngModelValue = "";
		public formControl = new UntypedFormControl("");
	}

	function getTemplate(timestampMaskDirective: string): string {
		return "<input " + "type='text' " + timestampMaskDirective + ">";
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
			declarations: [StarkTimestampMaskDirective, TestComponent],
			imports: [FormsModule, ReactiveFormsModule],
			providers: []
		});
	});

	describe("uncontrolled", () => {
		beforeEach(fakeAsync(() =>
			// compile template and css
			TestBed.compileComponents()));

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkTimestampMask directive
		});

		it("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("12/3_/____");
			}

			const invalidEvents: string[] = ["blur", "keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("123"); // no mask shown
			}
		});

		it("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["a", " ", "whatever"];

			for (const value of invalidValues) {
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("");
			}
		});

		it("should refresh the mask whenever the configuration changes", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12/3_/____");

			hostComponent.timestampMaskConfig = { ...timestampMaskConfig, format: "DD-MM" };
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12-3_");
		});

		it("should remove the mask when the config is undefined", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12/3_/____");

			hostComponent.timestampMaskConfig = <any>undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "whatever");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("whatever"); // no mask at all
		});

		it("should allow to enter February 29 manually in the input field when a year is foreseen but is not yet entered", () => {
			changeInputValue(inputElement, "2902");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("29/02/____");

			// FIXME: currently the text-mask library throws if the value is not cleared before changing the config
			// in fact the model in not changed after changing the config. which is not implemented yet in text-mask and still being discussed
			// see: https://github.com/text-mask/text-mask/issues/657
			// the error is thrown as long as the entered value is not valid according to the new config
			changeInputValue(inputElement, "");
			fixture.detectChanges();

			hostComponent.timestampMaskConfig = { ...timestampMaskConfig, format: "MM-DD-YY" };
			fixture.detectChanges();

			changeInputValue(inputElement, "0229");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("02-29-__");
		});
	});

	describe("with ngModel", () => {
		beforeEach(fakeAsync(() => {
			const newTemplate: string = getTemplate("[(ngModel)]='ngModelValue' [starkTimestampMask]='timestampMaskConfig'");

			TestBed.overrideTemplate(TestComponent, newTemplate);

			// compile template and css
			return TestBed.compileComponents();
		}));

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkTimestampMask directive
		});

		it("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.ngModelValue).toBe("");

				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				expect(hostComponent.ngModelValue).toBe("12/3_/____");
			}

			const invalidEvents: string[] = ["blur", "keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.ngModelValue).toBe("");

				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				// IMPORTANT: the ngModel is not changed with invalid events, just with "input" events
				expect(hostComponent.ngModelValue).toBe(""); // no mask shown
			}
		});

		it("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["a", " ", "whatever"];

			for (const value of invalidValues) {
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(hostComponent.ngModelValue).toBe("");
			}
		});

		// FIXME NG0100: ExpressionChangedAfterItHasBeenCheckedError - #2860 https://github.com/NationalBankBelgium/stark/issues/2860
		xit("should refresh the mask whenever the configuration changes", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12/3_/____");

			hostComponent.timestampMaskConfig = { ...timestampMaskConfig, format: "DD-MM" };
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12-3_");
		});

		it("should remove the mask when the config is undefined", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12/3_/____");

			hostComponent.timestampMaskConfig = <any>undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "whatever");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("whatever"); // no mask at all
		});

		it("should allow to enter February 29 manually in the input field when a year is foreseen but is not yet entered", () => {
			changeInputValue(inputElement, "2902");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("29/02/____");

			// FIXME: currently the text-mask library throws if the value is not cleared before changing the config
			// in fact the model in not changed after changing the config. which is not implemented yet in text-mask and still being discussed
			// see: https://github.com/text-mask/text-mask/issues/657
			// the error is thrown as long as the entered value is not valid according to the new config
			changeInputValue(inputElement, "");
			fixture.detectChanges();

			hostComponent.timestampMaskConfig = { ...timestampMaskConfig, format: "MM-DD-YY" };
			fixture.detectChanges();

			changeInputValue(inputElement, "0229");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("02-29-__");
		});
	});

	describe("with FormControl", () => {
		let mockValueChangeObserver: jasmine.SpyObj<Observer<any>>;

		beforeEach(fakeAsync(() => {
			const newTemplate: string = getTemplate("[formControl]='formControl' [starkTimestampMask]='timestampMaskConfig'");

			TestBed.overrideTemplate(TestComponent, newTemplate);

			// compile template and css
			return TestBed.compileComponents();
		}));

		beforeEach(() => {
			initializeComponentFixture();

			mockValueChangeObserver = jasmine.createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			hostComponent.formControl.valueChanges.subscribe(mockValueChangeObserver);
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkTimestampMask directive
		});

		it("should update the input value and show the mask only when a valid event is triggered in the input field", () => {
			// Angular2 text-mask directive handles only the "input" event
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.formControl.value).toBe("");
				// FIXME Check why it is called twice instead of once
				expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

				mockValueChangeObserver.next.calls.reset();
				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				expect(hostComponent.formControl.value).toBe("12/3_/____");
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
				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				// IMPORTANT: the formControl is not changed with invalid events, just with "input" events
				expect(hostComponent.formControl.value).toBe(""); // no mask shown
				expect(mockValueChangeObserver.next).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
				expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
			}
		});

		it("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["a", " ", "whatever"];

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

		it("should refresh the mask whenever the configuration changes", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("12/3_/____");
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

			mockValueChangeObserver.next.calls.reset();
			hostComponent.timestampMaskConfig = { ...timestampMaskConfig, format: "DD-MM" };
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("12-3_");
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
		});

		it("should remove the mask when the config is undefined", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("12/3_/____");
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);

			mockValueChangeObserver.next.calls.reset();
			hostComponent.timestampMaskConfig = <any>undefined;
			fixture.detectChanges();
			expect(mockValueChangeObserver.next).not.toHaveBeenCalled(); // no value change, the mask was just disabled

			mockValueChangeObserver.next.calls.reset();
			changeInputValue(inputElement, "whatever");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("whatever"); // no mask at all
			// FIXME Check why it is called twice instead of once
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(2);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalled();
		});

		it("should allow to enter February 29 manually in the input field when a year is foreseen but is not yet entered", () => {
			changeInputValue(inputElement, "2902");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("29/02/____");

			// FIXME: currently the text-mask library throws if the value is not cleared before changing the config
			// in fact the model in not changed after changing the config. which is not implemented yet in text-mask and still being discussed
			// see: https://github.com/text-mask/text-mask/issues/657
			// the error is thrown as long as the entered value is not valid according to the new config
			changeInputValue(inputElement, "");
			fixture.detectChanges();

			hostComponent.timestampMaskConfig = { ...timestampMaskConfig, format: "MM-DD-YY" };
			fixture.detectChanges();

			changeInputValue(inputElement, "0229");
			fixture.detectChanges();

			expect(hostComponent.formControl.value).toBe("02-29-__");
		});
	});
});
