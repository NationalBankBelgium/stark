import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppLogoModule } from "@nationalbankbelgium/stark-ui/src/modules/app-logo";
import { StarkSessionCardComponent } from "./session-card.component";

@Component({
	selector: "test-component",
	template: `
		<stark-session-card [cardTitle]="cardTitle">
			<div>TEST</div>
		</stark-session-card>
	`
})
class TestComponent {
	public cardTitle = "";
}

describe("SessionCardComponent", () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			imports: [CommonModule, StarkAppLogoModule, TranslateModule.forRoot(), MatCardModule],
			declarations: [TestComponent, StarkSessionCardComponent],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_ROUTING_SERVICE, useValue: new MockStarkRoutingService() } // needed by AppLogo component
			]
		}).compileComponents()));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
	});

	it("Component should render", () => {
		const expected = "TEST";

		const sessionCard: HTMLElement | null = fixture.nativeElement.querySelector("stark-session-card");
		if (!sessionCard) {
			fail("Session Card element not found");
			return;
		}

		expect(sessionCard.textContent).toEqual(expected);
	});

	it("Title should not render when falsy", () => {
		component.cardTitle = "";
		fixture.detectChanges();

		const titleElement: HTMLElement | null = fixture.nativeElement.querySelector("stark-session-card mat-card-header mat-card-title");
		expect(titleElement).toBeNull();
	});

	it("Title should render when given", () => {
		component.cardTitle = "Testing-title";
		fixture.detectChanges();

		const expected = "Testing-title";

		const titleElement: HTMLElement | null = fixture.nativeElement.querySelector("stark-session-card mat-card-header mat-card-title");
		if (!titleElement) {
			fail("Title element not found.");
			return;
		}

		expect(titleElement.textContent).toEqual(expected);
	});
});
