import { TranslateService } from "@ngx-translate/core";
import { mergeTranslations } from "../../../packages/stark-core/src/common/translations/translations";
import { StarkLocale } from "../../../packages/stark-core/src/common/translations/locale.intf";

const translationsEn: object = require("../assets/translations/en.json");
const translationsFr: object = require("../assets/translations/fr.json");
const translationsNl: object = require("../assets/translations/nl.json");

export function initializeTranslation(translateService: TranslateService): void {
	translateService.addLangs(["en", "fr", "nl"]);
	translateService.setDefaultLang("en");
	translateService.use("nl");

	const english: StarkLocale = { languageCode: "en", translations: translationsEn };
	const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
	const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };

	mergeTranslations(translateService, english, french, dutch);
}
