import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { STARK_USER_SERVICE, StarkUserServiceImpl } from "./services";
import { STARK_USER_REPOSITORY, StarkUserRepositoryImpl } from "./repository";

@NgModule({})
export class StarkUserModule {
	// instantiate the services only once since they should be singletons
	// so the forRoot() should be called only by the AppModule
	// see https://angular.io/guide/singleton-services#forroot
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: StarkUserModule,
			providers: [
				{ provide: STARK_USER_SERVICE, useClass: StarkUserServiceImpl },
				{ provide: STARK_USER_REPOSITORY, useClass: StarkUserRepositoryImpl }
			]
		};
	}

	// prevent this module from being re-imported
	// see https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkUserModule
	) {
		if (parentModule) {
			throw new Error("StarkUserModule is already loaded. Import it in the AppModule only");
		}
	}
}
