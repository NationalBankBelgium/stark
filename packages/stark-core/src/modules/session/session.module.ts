import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { starkSessionReducers } from "./reducers";
import { STARK_SESSION_SERVICE, StarkSessionServiceImpl } from "./services";

@NgModule({
	imports: [StoreModule.forFeature("StarkSession", starkSessionReducers)]
})
export class StarkSessionModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @returns a module with providers
	 */
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkSessionModule,
			providers: [{ provide: STARK_SESSION_SERVICE, useClass: StarkSessionServiceImpl }]
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
		parentModule: StarkSessionModule
	) {
		if (parentModule) {
			throw new Error("StarkSessionModule is already loaded. Import it in the AppModule only");
		}
	}
}
