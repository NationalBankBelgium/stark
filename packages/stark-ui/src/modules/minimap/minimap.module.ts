import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StarkMinimapComponent } from "./components/minimap.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { mergeTranslations, StarkLocale } from "@nationalbankbelgium/stark-core";

@NgModule({
	declarations: [StarkMinimapComponent],
	imports: [
		CommonModule,
		BrowserAnimationsModule,
		FormsModule,
		MatButtonModule,
		MatCheckboxModule,
		MatIconModule,
		MatTooltipModule,
		TranslateModule
	],
	exports: [StarkMinimapComponent]
})
export class StarkMinimapModule {
	public constructor(private translateService: TranslateService) {
		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeTranslations(this.translateService, english, french, dutch);
	}
}
