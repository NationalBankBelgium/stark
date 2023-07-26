import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StarkInputTransformationType, StarkTransformInputDirective } from "./transform-input.directive";
import { Observer } from "rxjs";

/**
 * Mocks an InputEvent on the element with the given value.
 * @param value - The value to set the element to.
 * @param element - The HTMLInputElement to mock the event on
 */
function mockInputEvent(value: string, element: HTMLInputElement | HTMLTextAreaElement): void {
	const inputEvent: Event = document.createEvent("Event");
	inputEvent.initEvent("input", true, true);

	element.value = value;
	element.dispatchEvent(inputEvent);
}

/**
 * Returns a function which replaces a specific word with a corresponding number of '*'.
 * @param word - The word to filter
 */
function wordFilter(word: string): (v: string) => string {
	return (v: string): string =>
		v.replace(word, (match: string) =>
			match
				.split("")
				.map(() => "*")
				.join("")
		);
}

describe("TransformInputDirective", () => {
	describe("with ngModel", () => {
		@Component({
			selector: "test-component",
			template: "<input [(ngModel)]='value' [starkTransformInput]='starkTransformInputValue'/>"
		})
		class TestComponent {
			public starkTransformInputValue: StarkInputTransformationType = () => {
				/* noop*/
			};
			public value = "";
		}

		let fixture: ComponentFixture<TestComponent>;
		let component: TestComponent;
		let htmlInputElement: HTMLInputElement;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [StarkTransformInputDirective, TestComponent],
				imports: [FormsModule]
			});

			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			htmlInputElement = fixture.nativeElement.querySelector("input");

			// trigger initial data binding
			fixture.detectChanges();

			expect(component.value).withContext("field 'value' should start as empty string ").toBe("");
		});

		it("should set value to uppercase", () => {
			const input = "upper";
			const expected = "UPPER";

			// Set directive to correct implementation
			component.starkTransformInputValue = "uppercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(component.value).toBe(expected);
		});

		it("should set value to lowercase", () => {
			const input = "LOWER";
			const expected = "lower";

			// Set directive to correct implementation
			component.starkTransformInputValue = "lowercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(component.value).toBe(expected);
		});

		it("should replace dirty word", () => {
			const input = "fudge you!";
			const expected = "***** you!";

			// Set directive to correct implementation
			component.starkTransformInputValue = (v: string): string =>
				v.replace("fudge", (match: string) =>
					match
						.split("")
						.map(() => "*")
						.join("")
				);
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(component.value).toBe(expected);
		});
	});

	describe("with formControl", () => {
		@Component({
			selector: "test-component",
			template: "<input [formControl]='formControl' [starkTransformInput]='starkTransformInputValue'/>"
		})
		class TestComponent {
			public starkTransformInputValue: StarkInputTransformationType = () => {
				/* noop*/
			};
			public formControl = new FormControl("");
		}

		let fixture: ComponentFixture<TestComponent>;
		let component: TestComponent;
		let mockValueChangeObserver: jasmine.SpyObj<Observer<any>>;
		let htmlInputElement: HTMLInputElement;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [StarkTransformInputDirective, TestComponent],
				imports: [ReactiveFormsModule]
			});

			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			htmlInputElement = fixture.nativeElement.querySelector("input");

			// Register mock subscription
			mockValueChangeObserver = jasmine.createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
			component.formControl.valueChanges.subscribe(mockValueChangeObserver);

			// trigger initial data binding
			fixture.detectChanges();

			expect(component.formControl.value).withContext("field 'value' should start as empty string ").toBe("");
		});

		it("should set value to uppercase", () => {
			const input = "upper";
			const expected = "UPPER";

			// Set directive to correct implementation
			component.starkTransformInputValue = "uppercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(component.formControl.value).toBe(expected);
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(1);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalledTimes(1);
		});

		it("should set value to lowercase", () => {
			const input = "LOWER";
			const expected = "lower";

			// Set directive to correct implementation
			component.starkTransformInputValue = "lowercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(component.formControl.value).toBe(expected);
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(1);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalledTimes(1);
		});

		it("should replace dirty word", () => {
			const input = "fudge you!";
			const expected = "***** you!";

			// Set directive to correct implementation
			component.starkTransformInputValue = wordFilter("fudge");
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(component.formControl.value).toBe(expected);
			expect(mockValueChangeObserver.next).toHaveBeenCalledTimes(1);
			expect(mockValueChangeObserver.error).not.toHaveBeenCalled();
			expect(mockValueChangeObserver.complete).not.toHaveBeenCalledTimes(1);
		});
	});

	describe("uncontrolled", () => {
		@Component({
			selector: "test-component",
			template: "<input [starkTransformInput]='starkTransformInputValue'/>"
		})
		class TestComponent {
			public starkTransformInputValue: StarkInputTransformationType = () => {
				/* noop*/
			};
		}

		let fixture: ComponentFixture<TestComponent>;
		let component: TestComponent;
		let htmlInputElement: HTMLInputElement;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [StarkTransformInputDirective, TestComponent]
			});

			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			htmlInputElement = fixture.nativeElement.querySelector("input");
			htmlInputElement.value = "";

			// trigger initial data binding
			fixture.detectChanges();

			expect(htmlInputElement.value).withContext("field 'value' should start as empty string ").toBe("");
		});

		it("should set value to uppercase", () => {
			const input = "upper";
			const expected = "UPPER";

			// Set directive to correct implementation
			component.starkTransformInputValue = "uppercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(htmlInputElement.value).toBe(expected);
		});

		it("should set value to lowercase", () => {
			const input = "LOWER";
			const expected = "lower";

			// Set directive to correct implementation
			component.starkTransformInputValue = "lowercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(htmlInputElement.value).toBe(expected);
		});

		it("should replace dirty word", () => {
			const input = "fudge you!";
			const expected = "***** you!";

			// Set directive to correct implementation
			component.starkTransformInputValue = wordFilter("fudge");
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(htmlInputElement.value).toBe(expected);
		});
	});

	describe("on textarea", () => {
		@Component({
			selector: "test-component",
			template: "<textarea [starkTransformInput]='starkTransformInputValue'></textarea>"
		})
		class TestComponent {
			public starkTransformInputValue: StarkInputTransformationType = () => {
				/* noop*/
			};
		}

		let fixture: ComponentFixture<TestComponent>;
		let component: TestComponent;
		let htmlInputElement: HTMLTextAreaElement;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [StarkTransformInputDirective, TestComponent]
			});

			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			htmlInputElement = fixture.nativeElement.querySelector("textarea");
			htmlInputElement.value = "";

			// trigger initial data binding
			fixture.detectChanges();

			expect(htmlInputElement.value).withContext("field 'value' should start as empty string ").toBe("");
		});

		it("should set value to uppercase", () => {
			const input = "upper";
			const expected = "UPPER";

			// Set directive to correct implementation
			component.starkTransformInputValue = "uppercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(htmlInputElement.value).toBe(expected);
		});

		it("should set value to lowercase", () => {
			const input = "LOWER";
			const expected = "lower";

			// Set directive to correct implementation
			component.starkTransformInputValue = "lowercase";
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(htmlInputElement.value).toBe(expected);
		});

		it("should replace dirty word", () => {
			const input = "fudge you!";
			const expected = "***** you!";

			// Set directive to correct implementation
			component.starkTransformInputValue = wordFilter("fudge");
			fixture.detectChanges();

			mockInputEvent(input, htmlInputElement);
			fixture.detectChanges();

			expect(htmlInputElement.value).toBe(expected);
		});
	});

	describe("invalid input", () => {
		@Component({
			selector: "test-component",
			template: "<input [starkTransformInput]='invalidInput'/>"
		})
		class TestComponent {
			public invalidInput = "INVALID_INPUT";
		}

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [StarkTransformInputDirective, TestComponent]
			});
		});

		it("should throw an error", () => {
			const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
			// trigger initial data binding
			expect(() => fixture.detectChanges()).toThrowError(/StarkInputTransformationType/);

			fixture.componentInstance.invalidInput = "uppercase";
			expect(() => fixture.detectChanges()).not.toThrowError();

			fixture.componentInstance.invalidInput = "INVALID_INPUT";
			expect(() => fixture.detectChanges()).toThrowError(/StarkInputTransformationType/);
		});
	});
});
