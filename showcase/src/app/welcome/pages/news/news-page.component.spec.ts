/* eslint-disable @angular-eslint/no-lifecycle-call */
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { NewsPageComponent } from "./news-page.component";
import SpyObj = jasmine.SpyObj;

describe(`News`, () => {
	let comp: NewsPageComponent;
	let fixture: ComponentFixture<NewsPageComponent>;
	let logger: SpyObj<StarkLoggingService>;

	/**
	 * async beforeEach.
	 */
	beforeEach(
		waitForAsync(() => {
			return (
				TestBed.configureTestingModule({
					declarations: [NewsPageComponent],
					schemas: [NO_ERRORS_SCHEMA], // to avoid errors due to "mat-icon" directive not known (which we don't want to add in these tests)
					imports: [HttpClientTestingModule],
					providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }, provideMockStore()]
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
		logger = TestBed.get(STARK_LOGGING_SERVICE);

		fixture = TestBed.createComponent(NewsPageComponent);
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
