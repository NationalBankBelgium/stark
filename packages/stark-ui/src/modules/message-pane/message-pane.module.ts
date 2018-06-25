import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { mergeTranslations, StarkLocale } from "@nationalbankbelgium/stark-core";

import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";

import { StarkMessagePaneComponent } from "./components";
import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneServiceImpl } from "./services";
import { starkMessagesReducers } from "./reducers";
import { StarkMessagePaneEffects } from "./effects";

@NgModule({
	declarations: [StarkMessagePaneComponent],
	imports: [
		CommonModule,
		TranslateModule,
		MatTooltipModule,
		MatIconModule,
		StoreModule.forFeature("StarkMessages", starkMessagesReducers),
		EffectsModule.forFeature([StarkMessagePaneEffects])
	],
	exports: [StarkMessagePaneComponent]
})
export class StarkMessagePaneModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @returns a module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkMessagePaneModule,
			providers: [{ provide: STARK_MESSAGE_PANE_SERVICE, useClass: StarkMessagePaneServiceImpl }]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * @link https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	 * @param parentModule - the parent module
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkMessagePaneModule,
		private translateService: TranslateService
	) {
		if (parentModule) {
			throw new Error("StarkSessionModule is already loaded. Import it in the AppModule only");
		}

		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeTranslations(this.translateService, english, french, dutch);
	}
}
