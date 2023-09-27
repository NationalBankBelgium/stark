/* eslint-disable @angular-eslint/no-lifecycle-call */
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { StoreModule } from "@ngrx/store";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { HomePageComponent } from "./home-page.component";

describe(`Home`, () => {
	let comp: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;
	let logger: MockStarkLoggingService;

	/**
	 * async beforeEach.
	 */
	beforeEach(
		waitForAsync(() => {
			return (
				TestBed.configureTestingModule({
					declarations: [HomePageComponent],
					imports: [StoreModule.forRoot({}), HttpClientTestingModule],
					providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
				})

					/**
					 * Compile template and css.
					 */
					.compileComponents()
			);
		})
	);

	/**
	 * Synchronous beforeEach.
	 */
	beforeEach(() => {
		logger = TestBed.inject<MockStarkLoggingService>(STARK_LOGGING_SERVICE);

		fixture = TestBed.createComponent(HomePageComponent);
		comp = fixture.componentInstance;

		/**
		 * Trigger initial data binding.
		 */
		fixture.detectChanges();
		logger.debug.calls.reset();
	});

	it("should log ngOnInit", () => {
		expect(logger.debug).not.toHaveBeenCalled();

		comp.ngOnInit();
		expect(logger.debug).toHaveBeenCalled();
	});
});
