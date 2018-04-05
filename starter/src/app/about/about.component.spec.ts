import { ActivatedRoute, Data } from "@angular/router";
import { inject, TestBed } from "@angular/core/testing";

/**
 * Load the implementations that should be tested.
 */
import { AboutComponent } from "./about.component";
import {
	StarkLoggingModule,
	STARK_APP_CONFIG,
	StarkBackend,
	StarkApplicationConfig,
	StarkBackendAuthenticationTypes,
	StarkLoggingService,
	starkLoggingServiceName
} from "@nationalbankbelgium/stark-core";

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
			imports: [StarkLoggingModule],
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
				AboutComponent,
				{ provide: STARK_APP_CONFIG, useValue: mockStarkAppConfig }
			]
		})
	);

	it(
		"should log ngOnInit",
		inject([AboutComponent], (about: AboutComponent) => {
			logger = TestBed.get(starkLoggingServiceName);

			spyOn(logger, "debug");
			expect(logger.debug).not.toHaveBeenCalled();

			about.ngOnInit();
			expect(logger.debug).toHaveBeenCalled();
		})
	);
});
