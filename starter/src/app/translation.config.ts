import { TranslateService } from "@ngx-translate/core";
import { mergeTranslations, StarkLocale } from "@nationalbankbelgium/stark-core";

/**
 * This object will contain all English translation for the application
 */
const translationsEn: object = require("../assets/translations/en.json");
/**
 * This object will contain all French translation for the application
 */
const translationsFr: object = require("../assets/translations/fr.json");
/**
 * This object will contain all Dutch translation for the application
 */
const translationsNl: object = require("../assets/translations/nl.json");

/**
 * Method that will initialize the translation of the application
 * @param translateService: the translation service is use
 */
export function initializeTranslation(translateService: TranslateService): void {
	translateService.addLangs(["en", "fr", "nl"]);
	translateService.setDefaultLang("en");
	translateService.use("nl");

	/**
	 * The English StarkLocale, composed of the "en" language code
	 * and an object that retrieves all the English translations for the application in a json file
	 */
	const english: StarkLocale = { languageCode: "en", translations: translationsEn };
	/**
	 * The French StarkLocale, composed of the "fr" language code
	 * and an object that retrieves all the French translations for the application in a json file
	 */
	const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
	/**
	 * The Dutch StarkLocale, composed of the "nl" language code
	 * and an object that retrieves all the Dutch translations for the application in a json file
	 */
	const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };

	mergeTranslations(translateService, english, french, dutch);
}
