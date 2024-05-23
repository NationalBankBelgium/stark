import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { StarkAppLogoutComponent } from "./components";
import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";

@NgModule({
	declarations: [StarkAppLogoutComponent],
	exports: [StarkAppLogoutComponent],
	imports: [MatIconModule, TranslateModule, MatTooltipModule, MatButtonModule]
})
export class StarkAppLogoutModule {
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
