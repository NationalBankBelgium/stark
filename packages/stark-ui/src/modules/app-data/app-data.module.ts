import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { StarkAppDataComponent } from "./components";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { translationsFr } from "./assets/translations/fr";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";
import { translationsEn } from "./assets/translations/en";
import { translationsNl } from "./assets/translations/nl";
import { StarkLocale } from "@nationalbankbelgium/stark-core";

@NgModule({
	declarations: [StarkAppDataComponent],
	imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule],
	exports: [StarkAppDataComponent]
})
export class StarkAppDataModule {
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
