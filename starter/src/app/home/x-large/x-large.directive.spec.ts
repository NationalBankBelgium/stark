import { By } from "@angular/platform-browser";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Component } from "@angular/core";

/**
 * Load the implementations that should be tested.
 */
import { XLargeDirective } from "./x-large.directive";

describe("x-large directive", () => {
	/**
	 * Create a test component to test directives.
	 */
	@Component({
		selector: "test",
		template: "<div x-large>Content</div>"
	})
	class TestComponent {}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [XLargeDirective, TestComponent]
		});
	});

	it(
		"should sent font-size to x-large",
		fakeAsync(() => {
			TestBed.compileComponents().then(
				() => {
					const fixture: any = TestBed.createComponent(TestComponent);
					fixture.detectChanges();
					tick();
					const element: any = fixture.debugElement.query(By.css("div"));

					expect(element.nativeElement.style.fontSize).toBe("x-large");
				},
				(reason: any) => fail(reason)
			);
		})
	);
});
