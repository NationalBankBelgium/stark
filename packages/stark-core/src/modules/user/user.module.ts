import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { STARK_USER_PROFILE_RESOURCE_PATH, StarkUserModuleConfig } from "./entities";
import { STARK_USER_SERVICE, StarkUserServiceImpl } from "./services";
import { STARK_USER_REPOSITORY, StarkUserRepositoryImpl } from "./repository";

@NgModule({})
export class StarkUserModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @param userModuleConfig - Object containing the configuration (if any) for the User Module
	 * @returns a module with providers
	 */
	public static forRoot(userModuleConfig?: StarkUserModuleConfig): ModuleWithProviders {
		return {
			ngModule: StarkUserModule,
			providers: [
				{ provide: STARK_USER_SERVICE, useClass: StarkUserServiceImpl },
				{ provide: STARK_USER_REPOSITORY, useClass: StarkUserRepositoryImpl },
				userModuleConfig ? { provide: STARK_USER_PROFILE_RESOURCE_PATH, useValue: userModuleConfig.userProfileResourcePath } : []
			]
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
		parentModule: StarkUserModule
	) {
		if (parentModule) {
			throw new Error("StarkUserModule is already loaded. Import it in the AppModule only");
		}
	}
}
