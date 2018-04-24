import { StarkLanguage } from "../../../configuration/entities/language/language.entity.intf";
import { StarkLanguages } from "../../../configuration/entities/language/language.constants";

export const starkIsSupportedLanguageValidatorName: string = "starkIsSupportedLanguage";

export function starkIsSupportedLanguage(isoCode: string): boolean {
	if (typeof isoCode === "string") {
		const languageConstant: StarkLanguage = StarkLanguages[isoCode.toUpperCase().replace("-", "_")];
		if (languageConstant) {
			return true;
		}
	}

	return false;
}
