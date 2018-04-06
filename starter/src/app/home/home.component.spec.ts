import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

/**
 * Load the implementations that should be tested.
 */
import { AppState } from "../app.service";
import { HomeComponent } from "./home.component";
import { Title } from "./title";
import {
	StarkHttpModule,
	StarkLoggingModule,
	STARK_APP_CONFIG,
	StarkApplicationConfig,
	StarkBackend,
	StarkBackendAuthenticationTypes,
	StarkLoggingService,
	starkLoggingServiceName
} from "@nationalbankbelgium/stark-core";

describe(`Home`, () => {
	let comp: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let logger: StarkLoggingService;

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
	beforeEach(
		async(() => {
			return (
				TestBed.configureTestingModule({
					declarations: [HomeComponent],
					schemas: [NO_ERRORS_SCHEMA],
					imports: [HttpClientTestingModule, StarkHttpModule, StarkLoggingModule],
					providers: [AppState, Title, { provide: STARK_APP_CONFIG, useValue: mockStarkAppConfig }]
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
		logger = TestBed.get(starkLoggingServiceName);

		fixture = TestBed.createComponent(HomeComponent);
		comp = fixture.componentInstance;

		/**
		 * Trigger initial data binding.
		 */
		fixture.detectChanges();
	});

	it("should have default data", () => {
		expect(comp.localState).toEqual({ value: " " });
	});

	it("should have a title", () => {
		expect(!!comp.title).toEqual(true);
	});

	it("should log ngOnInit", () => {
		spyOn(logger, "debug");
		expect(logger.debug).not.toHaveBeenCalled();

		comp.ngOnInit();
		expect(logger.debug).toHaveBeenCalled();
	});
});
