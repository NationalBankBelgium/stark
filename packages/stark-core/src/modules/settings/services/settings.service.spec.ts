import { Store } from "@ngrx/store";

import { StarkLoggingService } from "../../logging/services";
import { MockStarkLoggingService } from "../../logging/testing";
import {
	StarkApplicationConfig,
	StarkApplicationConfigImpl,
	StarkApplicationMetadata,
	StarkApplicationMetadataImpl,
	StarkLanguages
} from "../../../configuration/entities";
import { StarkCoreApplicationState } from "../../../common/store";
import { StarkSettingsServiceImpl } from "./settings.service";
import { SetPreferredLanguage } from "../actions";
import { StarkUser } from "../../user";
import { of } from "rxjs";
import Spy = jasmine.Spy;

describe("Service: StarkSettingsService", () => {
	let mockStore: Store<StarkCoreApplicationState>;
	let mockLogger: StarkLoggingService;
	let appConfig: StarkApplicationConfig;
	let appMetadata: StarkApplicationMetadata;
	let settingsService: StarkSettingsServiceImpl;
	let mockUser: StarkUser;
	let browserLanguageCode: string;

	beforeEach(() => {
		mockLogger = new MockStarkLoggingService();
		mockStore = jasmine.createSpyObj("store", ["dispatch", "pipe"]);
		appConfig = new StarkApplicationConfigImpl();
		appConfig.defaultLanguage = "en";
		appMetadata = new StarkApplicationMetadataImpl();
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

		(<Spy>mockStore.pipe).and.returnValue(of(mockUser));

		settingsService = new StarkSettingsServiceImpl(mockLogger, mockStore, appMetadata, appConfig);
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
		});

		it("should set user language as preferred language", () => {
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(<string>mockUser.language);
		});

		it("should set browser language as preferred language if user language is undefined OR null", () => {
			/* tslint:disable:no-null-keyword */
			mockUser.language = <any>null;
			/* tslint:enable */
			(<Spy>mockStore.pipe).and.returnValue(of(mockUser));
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(browserLanguageCode);

			mockUser.language = undefined;
			(<Spy>mockStore.pipe).and.returnValue(of(mockUser));
			settingsService.initializeSettings();
			expect(settingsService.preferredLanguage).toEqual(browserLanguageCode);
		});

		it("should set browser language as preferred language if user language is NOT in supported languages", () => {
			mockUser.language = "NL";
			(<Spy>mockStore.pipe).and.returnValue(of(mockUser));
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
			expect(settingsService.preferredLanguage).toEqual("NL");
		});
	});
});
