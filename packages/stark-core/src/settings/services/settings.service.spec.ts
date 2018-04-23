import { Store } from "@ngrx/store";

import { StarkLoggingService } from "../../logging/services/index";
import { MockStarkLoggingService } from "../../logging/testing/index";
import { StarkApplicationConfig, StarkApplicationConfigImpl } from "../../configuration/entities/application/index";
import { StarkApplicationMetadata, StarkApplicationMetadataImpl } from "../../configuration/entities/metadata/index";
import { StarkLanguages } from "../../configuration/entities/language/index";
import Spy = jasmine.Spy;
import { StarkCoreApplicationState } from "../../common/store/index";
import { StarkSettingsServiceImpl } from "./settings.service";
import { SetPreferredLanguage } from "../actions/index";
import { StarkUser } from "../../user/index";
import { of } from "rxjs/observable/of";

describe("Service: StarkSettingsService", () => {
	let mockStore: Store<StarkCoreApplicationState>;
	let mockLogger: StarkLoggingService;
	let appConfig: StarkApplicationConfig;
	let appMetadata: StarkApplicationMetadata;
	let settingsService: SettingsServiceHelper;
	let mockUser: StarkUser;
	let browserLanguageCode: string;

	beforeEach(() => {
		mockLogger = new MockStarkLoggingService();
		mockStore = jasmine.createSpyObj("store", ["dispatch", "pipe", "select"]);
		appConfig = new StarkApplicationConfigImpl();
		appConfig.sessionTimeout = 123;
		appConfig.sessionTimeoutWarningPeriod = 13;
		appConfig.keepAliveInterval = 45;
		appConfig.keepAliveUrl = "http://my.backend/keepalive";
		appConfig.logoutUrl = "http://localhost:5000/logout";
		appConfig.rootStateUrl = "";
		appConfig.rootStateName = "";
		appConfig.homeStateName = "";
		appConfig.errorStateName = "";
		appConfig.angularDebugInfoEnabled = false;
		appConfig.debugLoggingEnabled = false;
		appConfig.loggingFlushDisabled = true;
		appConfig.defaultLanguage = "en";
		appConfig.baseUrl = "/";
		appConfig.publicApp = false;
		appConfig.routerLoggingEnabled = false;
		appConfig.addBackend({
			name: "logging",
			url: "http://localhost:5000",
			authenticationType: 1,
			fakePreAuthenticationEnabled: true,
			fakePreAuthenticationRolePrefix: "",
			loginResource: "logging",
			token: ""
		});
		appMetadata = new StarkApplicationMetadataImpl();
		appMetadata.name = "metadataTest";
		appMetadata.description = "App Metadata used for settings module tests";
		appMetadata.version = "";
		appMetadata.environment = "";
		appMetadata.buildTimestamp = "";
		appMetadata.deploymentTimestamp = "";
		appMetadata.supportedLanguages = [StarkLanguages.FR_BE, StarkLanguages.EN_US];

		mockUser = {
			uuid: "1",
			username: "tenretc",
			roles: [],
			firstName: "Corentin",
			lastName: "Tenret",
			language: "FR",
			email: "tenretc@nbb.be",
			referenceNumber: "1234"
		};

		(<Spy>mockStore.select).and.returnValue(of(mockUser));

		settingsService = new SettingsServiceHelper(mockLogger, mockStore, appMetadata, appConfig);
		// reset the calls counter because there is a log in the constructor
		(<Spy>mockStore.dispatch).calls.reset();
	});
	describe("on initialization", () => {
		it("preferredLanguage should be undefined", () => {
			expect(settingsService.preferredLanguage).toBe(appConfig.defaultLanguage);
		});
	});

	describe("initializeSettings", () => {
		beforeEach(() => {
			Object.defineProperty(navigator, "language", {
				get: () => "fr-be"
			});
			browserLanguageCode = "fr";

			spyOn(settingsService, "setPreferredLanguage").and.callFake((language: string) => {
				settingsService.preferredLanguage = language;
			});
		});

		it("should set user language as preferred language", () => {
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(<string>mockUser.language);
		});

		it("should set browser language as preferred language if user language is undefined OR null", () => {
			/* tslint:disable:no-null-keyword */
			mockUser.language = <any>null;
			/* tslint:enable */
			(<Spy>mockStore.select).and.returnValue(of(mockUser));
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(browserLanguageCode);

			mockUser.language = undefined;
			(<Spy>mockStore.select).and.returnValue(of(mockUser));
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(browserLanguageCode);
		});

		it("should set browser language as preferred language if user language is NOT in supported languages", () => {
			mockUser.language = "NL";
			(<Spy>mockStore.select).and.returnValue(of(mockUser));
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(browserLanguageCode);
		});

		it("should set defaultLanguage if browserLanguage not supported", () => {
			appMetadata.supportedLanguages = [];
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(appConfig.defaultLanguage);
		});
	});

	describe("getPreferredLanguage", () => {
		it("should return the preferred language", () => {
			const getPreferredLanguage: string = settingsService.getPreferredLanguage();
			expect(getPreferredLanguage).toEqual(appConfig.defaultLanguage);
		});
	});

	describe("setPreferredLanguage", () => {
		it("should change the language successfully and dispatch the SUCCESS action", () => {
			settingsService.setPreferredLanguage("NL");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect((<Spy>mockStore.dispatch).calls.argsFor(0)[0]).toEqual(new SetPreferredLanguage("NL"));
		});
	});
});

class SettingsServiceHelper extends StarkSettingsServiceImpl {
	public constructor(
		logger: StarkLoggingService,
		store: Store<StarkCoreApplicationState>,
		appMetadata: StarkApplicationMetadata,
		appConfig: StarkApplicationConfig
	) {
		super(logger, store, appMetadata, appConfig);
	}

	public initializeSettings(): void {
		super.initializeSettings();
	}

	public persistPreferredLanguage(): void {
		super.persistPreferredLanguage();
	}

	public getPreferredLanguage(): string {
		return super.getPreferredLanguage();
	}

	public setPreferredLanguage(language: string): void {
		super.setPreferredLanguage(language);
	}
}
