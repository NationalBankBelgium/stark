import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { starkSessionReducers } from "./reducers";
import { STARK_SESSION_SERVICE, StarkSessionServiceImpl } from "./services";

@NgModule({
	imports: [StoreModule.forFeature("StarkSession", starkSessionReducers)]
})
export class StarkSessionModule {
	// instantiate the services only once since they should be singletons
	// so the forRoot() should be called only by the AppModule
	// see https://angular.io/guide/singleton-services#forroot
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkSessionModule,
			providers: [{ provide: STARK_SESSION_SERVICE, useClass: StarkSessionServiceImpl }]
		};
	}

	// prevent this module from being re-imported
	// see https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkSessionModule
	) {
		if (parentModule) {
			throw new Error("StarkSessionModule is already loaded. Import it in the AppModule only");
		}
	}
}
