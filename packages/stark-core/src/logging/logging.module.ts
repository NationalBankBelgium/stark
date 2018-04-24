import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { ActionReducerMap, StoreModule } from "@ngrx/store";

import { loggingReducer, StarkLoggingState } from "./reducers";
import { StarkLoggingActions } from "./actions";
import { StarkLoggingServiceImpl, STARK_LOGGING_SERVICE } from "./services";

const reducers: ActionReducerMap<StarkLoggingState, StarkLoggingActions> = {
	logging: loggingReducer
};

@NgModule({
	imports: [StoreModule.forFeature("StarkLogging", reducers)]
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
