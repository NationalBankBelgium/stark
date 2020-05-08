import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { starkLoggingReducers } from "./reducers";
import { STARK_LOGGING_SERVICE, StarkLoggingServiceImpl } from "./services";

@NgModule({
	imports: [StoreModule.forFeature("StarkLogging", starkLoggingReducers)]
})
export class StarkLoggingModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v7.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The forRoot() pattern}
	 * @returns A module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkLoggingModule,
			providers: [{ provide: STARK_LOGGING_SERVICE, useClass: StarkLoggingServiceImpl }]
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
		parentModule?: StarkLoggingModule
	) {
		if (parentModule) {
			throw new Error("StarkLoggingModule is already loaded. Import it in the AppModule only");
		}
	}
}
