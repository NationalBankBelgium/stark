import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { starkLoggingReducers } from "./reducers";
import { STARK_LOGGING_SERVICE, StarkLoggingServiceImpl } from "./services";

@NgModule({
	imports: [StoreModule.forFeature("StarkLogging", starkLoggingReducers)]
})
export class StarkLoggingModule {
	// instantiate the services only once since they should be singletons
	// so the forRoot() should be called only by the AppModule
	// see https://angular.io/guide/singleton-services#forroot
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkLoggingModule,
			providers: [{ provide: STARK_LOGGING_SERVICE, useClass: StarkLoggingServiceImpl }]
		};
	}

	// prevent this module from being re-imported
	// see https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkLoggingModule
	) {
		if (parentModule) {
			throw new Error("StarkLoggingModule is already loaded. Import it in the AppModule only");
		}
	}
}
