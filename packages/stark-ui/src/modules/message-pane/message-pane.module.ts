import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StarkLocale } from "@nationalbankbelgium/stark-core";

import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";

import { StarkMessagePaneComponent } from "./components";
import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneServiceImpl } from "./services";
import { starkMessagesReducers } from "./reducers";
import { StarkMessagePaneEffects } from "./effects";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";
import { starkMessagePaneStoreKey } from "./constants";

@NgModule({
	declarations: [StarkMessagePaneComponent],
	imports: [
		CommonModule,
		TranslateModule,
		MatTooltipModule,
		MatIconModule,
		StoreModule.forFeature(starkMessagePaneStoreKey, starkMessagesReducers),
		EffectsModule.forFeature([StarkMessagePaneEffects])
	],
	exports: [StarkMessagePaneComponent]
})
export class StarkMessagePaneModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v12.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The `forRoot()` pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders<StarkMessagePaneModule> {
		return {
			ngModule: StarkMessagePaneModule,
			providers: [{ provide: STARK_MESSAGE_PANE_SERVICE, useClass: StarkMessagePaneServiceImpl }]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * See {@link https://v12.angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule|Angular docs: Prevent reimport of a root module}
	 * @param translateService - The `TranslateService` instance of the application.
	 * @param parentModule - The parent module
	 */
	public constructor(
		translateService: TranslateService,
		@Optional()
		@SkipSelf()
		parentModule?: StarkMessagePaneModule
	) {
		if (parentModule) {
			throw new Error("StarkMessagePaneModule is already loaded. Import it in the AppModule only");
		}

		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeUiTranslations(translateService, english, french, dutch);
	}
}
