"use strict";
import {StarkLanguage} from "./language.entity.intf";

export class StarkLanguages {
	public static EN_US: StarkLanguage = {
		isoCode: "en-US",
		translationKey: "STARK.LANGUAGES.EN",
		code: "en",
		region: "US"
	};
	public static FR_BE: StarkLanguage = {
		isoCode: "fr-BE",
		translationKey: "STARK.LANGUAGES.FR",
		code: "fr",
		region: "BE"
	};
	public static NL_BE: StarkLanguage = {
		isoCode: "nl-BE",
		translationKey: "STARK.LANGUAGES.NL",
		code: "nl",
		region: "BE"
	};
	public static DE_DE: StarkLanguage = {
		isoCode: "de-DE",
		translationKey: "STARK.LANGUAGES.DE",
		code: "de",
		region: "DE"
	};
}
