import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { StarkTextMaskConfig } from "./text-mask-config.intf";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { IMaskModule } from "angular-imask";
import { StarkTextMaskDirective } from "./text-mask.directive";

// tslint:disable-next-line:no-big-function
describe("TextMaskDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let hostComponent: TestComponent;
	let inputElement: DebugElement;

	const textMaskConfig: StarkTextMaskConfig = {
		mask: "X0/00",
		definitions: {
			X: /[0-1]/
		},
		guide: true,
		eager: true
	};

	@Component({
		selector: "test-component",
		template: getTemplate("[starkTextMask]='textMaskConfig'")
	})
	class TestComponent {
		public textMaskConfig: StarkTextMaskConfig = textMaskConfig;
		public ngModelValue = "";
		public formControl = new FormControl();
	}

	function getTemplate(textMaskDirective: string): string {
		return "<input " + "type='text' " + textMaskDirective + ">";
	}

	function initializeComponentFixture(): void {
		fixture = TestBed.createComponent<TestComponent>(TestComponent);
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
			declarations: [StarkTextMaskDirective, TestComponent],
			imports: [FormsModule, ReactiveFormsModule, IMaskModule],
			providers: []
		});
	});

	describe("uncontrolled", () => {
		beforeEach(fakeAsync(() => {
			return TestBed.compileComponents();
		}));

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkTextMask directive
		});

		it("should update the input value and show the mask when a valid event is triggered in the input field", () => {
			//
			const validEvents: string[] = ["input"];

			for (const eventType of validEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).withContext(eventType).toBe("12/3_");
			}
		});

		it("shouldn't update input value when an invalid event is triggered in the input field", () => {
			const invalidEvents: string[] = ["keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(inputElement.nativeElement.value).toBe("");

				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).withContext(eventType).toBe("123"); // no mask shown
			}
		});

		it("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["4", "a", " ", "whatever"];

			for (const value of invalidValues) {
				changeInputValue(inputElement, value);
				fixture.detectChanges();

				expect(inputElement.nativeElement.value).toBe("");
			}
		});

		it("should refresh the mask whenever the configuration changes", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12/3_");

			hostComponent.textMaskConfig = {
				...textMaskConfig,
				mask: "0/0/00",
				definitions: undefined,
				placeholderChar: "-"
			};
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("1/2/3-");
		});

		it("should show/hide the mask placeholders depending of the value of the 'guide' option", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12/3_");

			hostComponent.textMaskConfig = { ...textMaskConfig, guide: false };
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12/3");
		});

		it("should remove the mask when the config is undefined or the mask property is set to false", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("12/3_");

			hostComponent.textMaskConfig = <any>undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "whatever");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("whatever"); // no mask at all

			hostComponent.textMaskConfig = { mask: false };
			fixture.detectChanges();

			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(inputElement.nativeElement.value).toBe("123"); // no mask at all
		});
	});

	describe("with ngModel", () => {
		beforeEach(fakeAsync(() => {
			const newTemplate: string = getTemplate("[(ngModel)]='ngModelValue' [starkTextMask]='textMaskConfig'");

			TestBed.overrideTemplate(TestComponent, newTemplate);

			// compile template and css
			return TestBed.compileComponents();
		}));

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should render the appropriate content", () => {
			expect(inputElement.attributes["ng-reflect-mask-config"]).toBeDefined(); // starkTextMask directive
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

				expect(hostComponent.ngModelValue).toBe("12/3_");
			}
		});

		it("shouldn't update input value when an invalid event is triggered in the input field", () => {
			const invalidEvents: string[] = ["keyup", "change", "focus", "keydown", "keypress", "click"];

			for (const eventType of invalidEvents) {
				changeInputValue(inputElement, "");
				fixture.detectChanges();
				expect(hostComponent.ngModelValue).toBe("");

				changeInputValue(inputElement, "123", eventType);
				fixture.detectChanges();

				// IMPORTANT: the ngModel is not changed with invalid events, just with "input" events
				expect(hostComponent.ngModelValue).withContext(eventType).toBe(""); // no mask shown
			}
		});

		it("should prevent invalid values to be entered in the input field when the value is changed manually", () => {
			const invalidValues: string[] = ["4", "a", " ", "whatever"];

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

			expect(hostComponent.ngModelValue).toBe("12/3_");

			hostComponent.textMaskConfig = { ...textMaskConfig, mask: "0/0/00", placeholderChar: "-" };
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("1/2/3-");
		});

		// FIXME NG0100: ExpressionChangedAfterItHasBeenCheckedError - #2860 https://github.com/NationalBankBelgium/stark/issues/2860
		xit("should show/hide the mask placeholders depending of the value of the 'guide' option", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12/3_");

			hostComponent.textMaskConfig = { ...textMaskConfig, guide: false };
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12/3");
		});

		// FIXME when the mask is remove we get an event Object for in the model
		xit("should remove the mask when the config is undefined or the mask property is set to false", () => {
			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("12/3_");

			hostComponent.textMaskConfig = <any>undefined;
			fixture.detectChanges();

			changeInputValue(inputElement, "whatever");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("whatever"); // no mask at all

			hostComponent.textMaskConfig = { mask: false };
			fixture.detectChanges();

			changeInputValue(inputElement, "123");
			fixture.detectChanges();

			expect(hostComponent.ngModelValue).toBe("123"); // no mask at all
		});
	});
});
