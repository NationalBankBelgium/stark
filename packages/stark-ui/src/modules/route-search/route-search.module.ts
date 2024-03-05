import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from "@angular/material/legacy-autocomplete";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyOptionModule as MatOptionModule } from "@angular/material/legacy-core";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { StarkRouteSearchComponent } from "./components";

import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";

@NgModule({
	declarations: [StarkRouteSearchComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatOptionModule,
		MatSelectModule,
		MatTooltipModule,
		TranslateModule
	],
	exports: [StarkRouteSearchComponent]
})
export class StarkRouteSearchModule {
	/**
	 * Prevents this module from being re-imported
	 * See {@link https://v12.angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule|Angular docs: Prevent reimport of a root module}
	 * @param translateService - The `TranslateService` instance of the application.
	 */
	public constructor(translateService: TranslateService) {
		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeUiTranslations(translateService, english, french, dutch);
	}
}
