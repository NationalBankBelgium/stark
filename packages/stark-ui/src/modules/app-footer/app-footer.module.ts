import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { StarkAppFooterComponent } from "./components";
import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";

@NgModule({
	declarations: [StarkAppFooterComponent],
	imports: [CommonModule, TranslateModule],
	exports: [StarkAppFooterComponent]
})
export class StarkAppFooterModule {
	/**
	 * Class constructor
	 * @param translateService - The `TranslateService` instance of the application.
	 */
	public constructor(translateService: TranslateService) {
		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeUiTranslations(translateService, english, french, dutch);
	}
}
