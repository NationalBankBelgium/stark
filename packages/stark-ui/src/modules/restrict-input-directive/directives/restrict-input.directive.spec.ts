/*tslint:disable:completed-docs*/
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkRestrictInputDirective } from "./restrict-input.directive";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

// tslint:disable-next-line:no-big-function
describe("RestrictInputDirective", () => {
	@Component({
		selector: "test-component",
		template: getTemplate("starkRestrictInput")
	})
	class TestComponent {
		public onEnterKeyHandler: Spy = createSpy("onEnterKeyHandlerSpy");
	}

	let fixture: ComponentFixture<TestComponent>;

	function getTemplate(restrictInputDirective: string): string {
		return "<input " + "type='text' " + restrictInputDirective + ">";
	}

	function initializeComponentFixture(): void {
		fixture = TestBed.createComponent(TestComponent);
		// trigger initial data binding
		fixture.detectChanges();
	}

	/**
	 * Return whether the triggered event was cancelled (default prevented)
	 */
	function triggerKeyPressEvent(inputElement: DebugElement, value: string): boolean {
		(<HTMLInputElement>inputElement.nativeElement).value = value;

		const keypressEvent: Event = document.createEvent("Event");
		keypressEvent.initEvent("keypress", true, true);
		keypressEvent["char"] = value;
		keypressEvent["key"] = value;
		// dispatchEvent() returns false if any of the event handlers which handled this event called Event.preventDefault()
		return !(<HTMLInputElement>inputElement.nativeElement).dispatchEvent(keypressEvent);
	}
	
	/**
	 * Return whether the triggered event was cancelled (default prevented)
	 */
	function triggerPasteEvent(inputElement: DebugElement, value: string): boolean {
		const clipboardData: DataTransfer = new DataTransfer();
		clipboardData.setData("text/plain", value);
		const eventInit:any = { clipboardData: clipboardData, cancelable: true };
		const pasteEvent: ClipboardEvent = new ClipboardEvent("paste", eventInit);

		return !(<HTMLInputElement>inputElement.nativeElement).dispatchEvent(pasteEvent);
	}

	/**
	 * Return whether the triggered event was cancelled (default prevented)
	 */
	function triggerDropEvent(inputElement: DebugElement, value: string): boolean {
		const dataTransfer: DataTransfer = new DataTransfer();
		dataTransfer.setData("text/plain", value);
		const dragEvent: DragEvent = new DragEvent("drop", { dataTransfer: dataTransfer, cancelable: true });

		return !(<HTMLInputElement>inputElement.nativeElement).dispatchEvent(dragEvent);
	}

	function triggerAndAssert(
		inputElement: DebugElement,
		values: string[],
		shouldBeValid: boolean,
		triggerFunction: (inputElement: DebugElement, value: string) => boolean
	): void {
		for (const value of values) {
			const eventDefaultPrevented = triggerFunction(inputElement, value);
			expect(eventDefaultPrevented).toBe(shouldBeValid);
		}
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [StarkRestrictInputDirective, TestComponent],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
		});
	});

	describe("when input restriction is not defined", () => {
		beforeEach(fakeAsync(() => {
			// compile template and css
			return TestBed.compileComponents();
		}));

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should NOT prevent any value from being typed in the input when no input restriction was provided", () => {
			expect(fixture).toBeDefined();
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));

			triggerAndAssert(inputElement, ["1", "a", "-"], false, triggerKeyPressEvent);
		});

		it("should NOT prevent any value from being pasted in the input when no input restriction was provided", () => {
			expect(fixture).toBeDefined();
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));

			triggerAndAssert(inputElement, ["1", "a", "-"], false, triggerPasteEvent);
		});

		it("should NOT prevent any value from being drop in the input when no input restriction was provided", () => {
			expect(fixture).toBeDefined();
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));

			triggerAndAssert(inputElement, ["1", "a", "-"], false, triggerDropEvent);
		});
	});

	describe("when input restriction is given", () => {
		// overriding the components's template
		beforeEach(fakeAsync(() => {
			// the directive should not be used with square brackets "[]" because the input is a string literal!
			const newTemplate: string = getTemplate("starkRestrictInput='\\d'");

			TestBed.overrideTemplate(TestComponent, newTemplate);

			// compile template and css
			return TestBed.compileComponents();
		}));

		beforeEach(() => {
			initializeComponentFixture();
		});

		it("should prevent any value other than the given ones in the configuration from being typed in the input", () => {
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));

			triggerAndAssert(inputElement, ["a", "B", "-"], true, triggerKeyPressEvent);
		});

		it("should NOT prevent any of the values given in the configuration from being typed in the input", () => {
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));

			triggerAndAssert(inputElement, ["9", "1", "0"], false, triggerKeyPressEvent);
		});

		it("should prevent any of the values given in the configuration from being pasted in the input", () => {
			expect(fixture).toBeDefined();
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));

			triggerAndAssert(inputElement, ["a", "B", "-"], true, triggerPasteEvent);
		});

		// tslint:disable-next-line:no-identical-functions
		it("should NOT prevent any of the values given in the configuration from being pasted in the input", () => {
			expect(fixture).toBeDefined();
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));
			triggerAndAssert(inputElement, ["9", "1", "0"], false, triggerPasteEvent);
		});

		it("should prevent any of the values given in the configuration from being drop in the input", () => {
			expect(fixture).toBeDefined();
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));
			triggerAndAssert(inputElement, ["a", "B", "-"], true, triggerDropEvent);
		});

		// tslint:disable-next-line:no-identical-functions
		it("should NOT prevent any of the values given in the configuration from being drop in the input", () => {
			expect(fixture).toBeDefined();
			const inputElement: DebugElement = fixture.debugElement.query(By.css("input"));
			triggerAndAssert(inputElement, ["9", "1", "0"], false, triggerDropEvent);
		});
	});
});
