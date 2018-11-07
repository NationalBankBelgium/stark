import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerModule } from "../date-picker";
import { StarkDateRangePickerComponent } from "./components";
import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { mergeUiTranslations } from "../../common/translations";

@NgModule({
	declarations: [StarkDateRangePickerComponent],
	imports: [CommonModule, StarkDatePickerModule, TranslateModule],
	exports: [StarkDateRangePickerComponent]
})
export class StarkDateRangePickerModule {
	/**
	 * Class constructor
	 * @param translateService - the translation service of the application
	 */
	public constructor(translateService: TranslateService) {
		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeUiTranslations(translateService, english, french, dutch);
	}
}
