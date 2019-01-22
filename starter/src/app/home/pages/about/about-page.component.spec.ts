/*tslint:disable:completed-docs*/
import { ActivatedRoute, Data } from "@angular/router";
import { inject, TestBed } from "@angular/core/testing";
import { StoreModule } from "@ngrx/store";
import {
	STARK_APP_CONFIG,
	STARK_LOGGING_SERVICE,
	StarkApplicationConfig,
	StarkBackend,
	StarkBackendAuthenticationTypes,
	StarkLoggingService
} from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { AboutPageComponent } from "./about-page.component";

describe("About", () => {
	/**
	 * Provide our implementations or mocks to the dependency injector
	 */
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

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [StoreModule.forRoot({})],
			providers: [
				/**
				 * Provide a better mock.
				 */
				{
					provide: ActivatedRoute,
					useValue: {
						data: {
							subscribe: (fn: (value: Data) => void) =>
								fn({
									yourData: "yolo"
								})
						}
					}
				},
				AboutPageComponent,
				{ provide: STARK_APP_CONFIG, useValue: mockStarkAppConfig },
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }
			]
		})
	);

	it("should log ngOnInit", inject([AboutPageComponent], (about: AboutPageComponent) => {
		logger = TestBed.get(STARK_LOGGING_SERVICE);

		expect(logger.debug).not.toHaveBeenCalled();

		about.ngOnInit();
		expect(logger.debug).toHaveBeenCalled();
	}));
});
