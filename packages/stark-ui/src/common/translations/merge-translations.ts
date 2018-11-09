import { TranslateService } from "@ngx-translate/core";
import { StarkLocale, mergeTranslations } from "@nationalbankbelgium/stark-core";
import { commonUiTranslations } from "./common-translations";

/**
 *  @ignore
 */
const _merge: Function = require("lodash/merge");

/**
 * This function can be used by Stark UI modules to merge their translations into existing translations,
 * without losing any existing translations.
 *
 * See {@link mergeTranslations} docs for more information about how the translations are merged.
 *
 * @param translateService - A reference to the translateService instance
 * @param localesToMerge - A list of StarkLocales that contain the translations for a specific language
 *
 * @example:
 *   mergeTranslations(this.translateService, english, french, dutch);
 */
export function mergeUiTranslations(translateService: TranslateService, ...localesToMerge: StarkLocale[]): void {
	const allLocalesToMerge: StarkLocale[] = [];

	// the common UI translations are merged with the given locales before calling the mergeTranslations from Stark-Core
	for (const locale of localesToMerge) {
		allLocalesToMerge.push({
			languageCode: locale.languageCode,
			translations: _merge({}, commonUiTranslations[locale.languageCode], locale.translations)
		});
	}

	// finally the mergeTranslations from Stark-Core merges all the locales (common UI + given locales)
	mergeTranslations(translateService, ...allLocalesToMerge);
}
