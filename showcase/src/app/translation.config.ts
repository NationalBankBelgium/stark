import moment from "moment";
// eslint-disable-next-line import/no-unassigned-import
import "moment/locale/fr";
// eslint-disable-next-line import/no-unassigned-import
import "moment/locale/nl-be";
// no need to load the English locale since we use US English and Moment default language is just that one (see https://momentjs.com/docs/#/i18n/changing-locale/)

import { TranslateService } from "@ngx-translate/core";
import { DateAdapter } from "@angular/material/core";
import { mergeTranslations, StarkLocale } from "@nationalbankbelgium/stark-core";

const translationsEn: object = require("../assets/translations/en.json");
const translationsFr: object = require("../assets/translations/fr.json");
const translationsNl: object = require("../assets/translations/nl.json");

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function initializeTranslation(translateService: TranslateService, dateAdapter: DateAdapter<any>): void {
	translateService.addLangs(["en", "fr", "nl"]);
	translateService.setDefaultLang("en");
	translateService.use("en");

	// set the Moment language, otherwise it is set by the last imported locale!
	moment.locale("en"); // in fact Moment default language is US English
	dateAdapter.setLocale("en"); // US English locale in Moment is just "en"

	const english: StarkLocale = { languageCode: "en", translations: translationsEn };
	const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
	const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };

	mergeTranslations(translateService, english, french, dutch);
}
