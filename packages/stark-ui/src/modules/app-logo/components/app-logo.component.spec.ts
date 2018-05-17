import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkAppLogoComponent } from "./app-logo.component";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("AppLogoComponent", () => {
	let comp: StarkAppLogoComponent;
	let fixture: ComponentFixture<StarkAppLogoComponent>;

	/**
	 * async beforeEach
	 */
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StarkAppLogoComponent],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService }
			],
			schemas: [NO_ERRORS_SCHEMA] // tells the Angular compiler to ignore unrecognized elements and attributes
		})
			/**
			 * Compile template and css
			 */
			.compileComponents();
	}));

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(() => {
		fixture = TestBed.createComponent(StarkAppLogoComponent);
		comp = fixture.componentInstance;

		fixture.detectChanges(); // trigger initial data binding
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(fixture).toBeDefined();
			expect(comp).toBeDefined();

			expect(comp.logger).not.toBeNull();
			expect(comp.logger).toBeDefined();
			expect(comp.routingService).not.toBeNull();
			expect(comp.routingService).toBeDefined();
		});

		it("should NOT have any inputs set", () => {
			expect(comp.homeStateParams).toBeUndefined();
		});
	});

	describe("logoClickHandler()", () => {
		it("should navigate to Home", () => {
			const dummyClickEvent: SpyObj<Event> = createSpyObj("dummyClickEvent", ["preventDefault"]);

			comp.homeStateParams = {
				someParam: "dummy param"
			};
			fixture.detectChanges();

			// routingService.navigateToHome is already an Spy
			(<Spy>comp.routingService.navigateToHome).calls.reset();
			comp.logoClickHandler(dummyClickEvent);
			expect(comp.routingService.navigateToHome).toHaveBeenCalledTimes(1);
			expect(comp.routingService.navigateToHome).toHaveBeenCalledWith(comp.homeStateParams);
		});
	});
});
