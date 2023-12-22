/* eslint-disable @angular-eslint/no-lifecycle-call */
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideMockStore } from "@ngrx/store/testing";
import {
	STARK_APP_CONFIG,
	STARK_HTTP_SERVICE,
	STARK_LOGGING_SERVICE,
	StarkApplicationConfig,
	StarkBackend,
	StarkBackendAuthenticationTypes,
	StarkLoggingService
} from "@nationalbankbelgium/stark-core";
import { MockStarkHttpService, MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { HomePageComponent } from "./home-page.component";
import SpyObj = jasmine.SpyObj;

describe(`Home`, () => {
	let comp: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;
	let logger: SpyObj<StarkLoggingService>;

	const mockBackend: Partial<StarkBackend> = {
		authenticationType: StarkBackendAuthenticationTypes.PUBLIC,
		name: "logging",
		url: "dummy/url"
	};

	const mockStarkAppConfig: Partial<StarkApplicationConfig> = {
		angularDebugInfoEnabled: true,
		debugLoggingEnabled: true,
		getBackend: jasmine.createSpy("getBackendSpy").and.returnValue(mockBackend)
	};

	/**
	 * async beforeEach.
	 */
	beforeEach(waitForAsync(() => {
		return (
			TestBed.configureTestingModule({
				declarations: [HomePageComponent],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [HttpClientTestingModule, TranslateModule.forRoot()],
				providers: [
					{ provide: STARK_APP_CONFIG, useValue: mockStarkAppConfig },
					{ provide: STARK_HTTP_SERVICE, useValue: MockStarkHttpService },
					{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
					provideMockStore()
				]
			})

				/**
				 * Compile template and css.
				 */
				.compileComponents()
		);
	}));

	/**
	 * Synchronous beforeEach.
	 */
	beforeEach(() => {
		logger = TestBed.get(STARK_LOGGING_SERVICE);

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
