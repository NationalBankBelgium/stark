import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { starkSettingsReducers } from "./reducers";
import { starkSettingsStoreKey } from "./constants";
import { STARK_SETTINGS_SERVICE, StarkSettingsServiceImpl } from "./services";
import { StarkSettingsEffects } from "./effects";

@NgModule({
	imports: [StoreModule.forFeature(starkSettingsStoreKey, starkSettingsReducers), EffectsModule.forFeature([StarkSettingsEffects])]
})
export class StarkSettingsModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v7.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The forRoot() pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders<StarkSettingsModule> {
		return {
			ngModule: StarkSettingsModule,
			providers: [{ provide: STARK_SETTINGS_SERVICE, useClass: StarkSettingsServiceImpl }]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * See {@link https://v7.angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule|Angular docs: Prevent reimport of a root module}
	 * @param parentModule - The parent module
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule?: StarkSettingsModule
	) {
		if (parentModule) {
			throw new Error("StarkSettingsModule is already loaded. Import it in the AppModule only");
		}
	}
}
