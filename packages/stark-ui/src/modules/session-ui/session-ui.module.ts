import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { EffectsModule } from "@ngrx/effects";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { StarkLocale } from "@nationalbankbelgium/stark-core";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { StarkAppLogoModule } from "@nationalbankbelgium/stark-ui/src/modules/app-logo";
import { mergeUiTranslations } from "@nationalbankbelgium/stark-ui/src/common";
import { STARK_SESSION_UI_CONFIG, StarkSessionUiConfig } from "./entities";
import { SESSION_UI_STATES } from "./routes";
import {
	StarkLoginPageComponent,
	StarkPreloadingPageComponent,
	StarkSessionExpiredPageComponent,
	StarkSessionLogoutPageComponent
} from "./pages";
import { translationsEn } from "./assets/translations/en";
import { translationsFr } from "./assets/translations/fr";
import { translationsNl } from "./assets/translations/nl";
import { StarkSessionTimeoutWarningDialogEffects } from "./effects";
import { StarkSessionCardComponent } from "./components/session-card/session-card.component";
import { StarkSessionTimeoutWarningDialogComponent } from "./components/session-timeout-warning-dialog/session-timeout-warning-dialog.component";

@NgModule({
	declarations: [
		StarkLoginPageComponent,
		StarkPreloadingPageComponent,
		StarkSessionExpiredPageComponent,
		StarkSessionLogoutPageComponent,
		StarkSessionTimeoutWarningDialogComponent,
		StarkSessionCardComponent
	],
	exports: [
		StarkLoginPageComponent,
		StarkPreloadingPageComponent,
		StarkSessionExpiredPageComponent,
		StarkSessionLogoutPageComponent,
		StarkSessionTimeoutWarningDialogComponent
	],
	imports: [
		CommonModule,
		UIRouterModule.forChild({
			states: SESSION_UI_STATES
		}),
		MatButtonModule,
		MatDialogModule,
		MatCardModule,
		MatDividerModule,
		MatListModule,
		TranslateModule,
		EffectsModule.forFeature([StarkSessionTimeoutWarningDialogEffects]),
		StarkAppLogoModule
	]
})
export class StarkSessionUiModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v12.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The `forRoot()` pattern}
	 * @param starkSessionUiConfig - `StarkSessionUiConfig` object
	 * @returns A module with providers
	 */
	public static forRoot(starkSessionUiConfig?: StarkSessionUiConfig): ModuleWithProviders<StarkSessionUiModule> {
		return {
			ngModule: StarkSessionUiModule,
			providers: [starkSessionUiConfig ? { provide: STARK_SESSION_UI_CONFIG, useValue: starkSessionUiConfig } : []]
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
		parentModule?: StarkSessionUiModule
	) {
		if (parentModule) {
			throw new Error("StarkSessionUiModule is already loaded. Import it in the AppModule only");
		}

		const english: StarkLocale = { languageCode: "en", translations: translationsEn };
		const french: StarkLocale = { languageCode: "fr", translations: translationsFr };
		const dutch: StarkLocale = { languageCode: "nl", translations: translationsNl };
		mergeUiTranslations(translateService, english, french, dutch);
	}
}
