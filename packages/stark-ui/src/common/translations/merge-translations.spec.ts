import { inject, TestBed } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { mergeUiTranslations } from "./merge-translations";

describe("Translations: mergeUiTranslations", () => {
	const translateModule: TranslateModule = TranslateModule.forRoot();
	let translateService: TranslateService;

	const moduleTranslationsEn: any = {
		STARK: {
			TEST: {
				TEXT1: "Text1 from module",
				TEXT2: "Text2 from module"
			}
		}
	};

	const appTranslationsEn: any = {
		STARK: {
			TEST: {
				TEXT2: "Text2 from app",
				TEXT3: "Text3 from app"
			}
		}
	};

	const appTranslationsDe: any = {
		STARK: {
			TEST: {
				TEXT1: "Text1 aus der app",
				TEXT2: "Text2 aus der app",
				TEXT3: "Text3 aus der app"
			}
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [translateModule]
		});
	});

	// Inject module dependencies
	beforeEach(inject([TranslateService], (_translateService: TranslateService) => {
		translateService = _translateService;
		translateService.addLangs(["en", "fr", "nl", "de"]);
		translateService.setDefaultLang("en");
	}));

	describe("mergeUiTranslations", () => {
		it("should return the merged translations from common Core, common Ui, module and app", () => {
			// First the module is loaded
			const english: StarkLocale = { languageCode: "en", translations: moduleTranslationsEn };
			mergeUiTranslations(translateService, english);

			// then the app is loaded
			translateService.setTranslation("en", appTranslationsEn, true);
			translateService.use("en");

			const text1: string = translateService.instant("STARK.TEST.TEXT1");
			const text2: string = translateService.instant("STARK.TEST.TEXT2");
			const text3: string = translateService.instant("STARK.TEST.TEXT3");
			const languageFr: string = translateService.instant("STARK.LANGUAGES.FR");
			const closeItem: string = translateService.instant("STARK.ICONS.CLOSE_ITEM");

			expect(text1).toBe(moduleTranslationsEn.STARK.TEST.TEXT1);
			expect(text2).toBe(appTranslationsEn.STARK.TEST.TEXT2); // the app has the upper hand
			expect(text3).toBe(appTranslationsEn.STARK.TEST.TEXT3);
			expect(languageFr).toBe("Français"); // Common Core translations
			expect(closeItem).toBe("Close"); // Common Ui translations
		});

		it("should return the merged translations from common Core, common Ui, module and app when lazy loading modules", () => {
			// First the app is loaded
			translateService.setTranslation("en", appTranslationsEn, true);
			translateService.use("en");

			// Then the module is lazy loaded
			const english: StarkLocale = { languageCode: "en", translations: moduleTranslationsEn };
			mergeUiTranslations(translateService, english);

			const text1: string = translateService.instant("STARK.TEST.TEXT1");
			const text2: string = translateService.instant("STARK.TEST.TEXT2");
			const text3: string = translateService.instant("STARK.TEST.TEXT3");
			const languageFr: string = translateService.instant("STARK.LANGUAGES.FR");
			const closeItem: string = translateService.instant("STARK.ICONS.CLOSE_ITEM");

			expect(text1).toBe(moduleTranslationsEn.STARK.TEST.TEXT1);
			expect(text2).toBe(appTranslationsEn.STARK.TEST.TEXT2); // the app has the upper hand
			expect(text3).toBe(appTranslationsEn.STARK.TEST.TEXT3);
			expect(languageFr).toBe("Français"); // Common Core translations
			expect(closeItem).toBe("Close"); // Common Ui translations
		});

		it("should return the merged translations, where the app has an extra language", () => {
			translateService.setTranslation("en", appTranslationsEn, true);
			translateService.setTranslation("de", appTranslationsDe, true);
			translateService.use("de");

			const english: StarkLocale = { languageCode: "en", translations: moduleTranslationsEn };
			mergeUiTranslations(translateService, english);

			const text1: string = translateService.instant("STARK.TEST.TEXT1");
			const text2: string = translateService.instant("STARK.TEST.TEXT2");
			const text3: string = translateService.instant("STARK.TEST.TEXT3");
			const languageFr: string = translateService.instant("STARK.LANGUAGES.FR");
			const closeItem: string = translateService.instant("STARK.ICONS.CLOSE_ITEM");

			expect(text1).toBe("Text1 aus der app");
			expect(text2).toBe("Text2 aus der app");
			expect(text3).toBe("Text3 aus der app");
			expect(languageFr).toBe("Français"); // missing in the app => translated from the default language 'en'
			expect(closeItem).toBe("Close"); // missing in the app => translated from the default language 'en'
		});
	});
});
