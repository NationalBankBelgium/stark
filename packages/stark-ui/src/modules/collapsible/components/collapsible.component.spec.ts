import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkCollapsibleComponent } from "./collapsible.component";

describe("CollapsibleComponent", () => {
	let component: StarkCollapsibleComponent;
	let fixture: ComponentFixture<StarkCollapsibleComponent>;

	/**
	 * async beforeEach
	 */
	beforeEach(
		waitForAsync(() =>
			TestBed.configureTestingModule({
				imports: [MatExpansionModule, MatIconModule, MatIconTestingModule, NoopAnimationsModule],
				declarations: [StarkCollapsibleComponent],
				providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
			})
				/**
				 * Compile template and css
				 */
				.compileComponents()
		)
	);

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(() => {
		fixture = TestBed.createComponent(StarkCollapsibleComponent);
		component = fixture.componentInstance;

		// inputs
		component.htmlId = "toto";
		component.titleLabel = "titre";

		fixture.detectChanges(); // trigger initial data binding
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(fixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();

			expect(component.htmlId).not.toBeNull();
			expect(component.htmlId).toBeDefined();
			expect(component.htmlId).toBe("toto");

			expect(component.isExpanded).not.toBeNull();
			expect(component.isExpanded).toBeDefined();
			expect(component.isExpanded).toBe(false);

			expect(component.titleLabel).not.toBeNull();
			expect(component.titleLabel).toBeDefined();
			expect(component.titleLabel).toBe("titre");

			expect(component._isDefaultIcon).toBe(true);
		});
	});

	describe("@Input()", () => {
		it("should have modified the view accordingly", () => {
			const actionBar: HTMLElement = fixture.nativeElement.querySelector("#" + component.htmlId);
			expect(actionBar).toBeDefined();

			const matIcon: HTMLElement = fixture.nativeElement.querySelector("mat-icon");
			expect(matIcon.className).toContain("spin");
		});
	});

	describe("toggleCollapsible()", () => {
		it("should change the isExpanded value and send it as output", () => {
			const exp: boolean = component.isExpanded;

			// Test output
			component.isExpandedChange.subscribe((value: boolean) => {
				expect(value).toBe(!exp);
			});

			component.toggleCollapsible();

			expect(component.isExpanded).toBe(!exp);
		});
	});
});
