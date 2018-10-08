import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { starkSessionReducers } from "./reducers";
import { StarkSessionConfig, STARK_SESSION_CONFIG } from "./entities";
import { STARK_SESSION_SERVICE, StarkSessionServiceImpl } from "./services";
import { StarkUserModule } from "../user/user.module";
import { starkAppExitStateName, starkAppInitStateName } from "./routes";

/**
 * Validates and creates the StarkSessionConfig to be provided for the Stark Session Service
 * @param customConfig - Custom configuration object passed via the StarkSessionModule.forRoot() method
 * @returns The StarkSessionConfig to be provided for the Stark Session Service.
 * @throws In case the configuration object passed via the StarkSessionModule.forRoot() method is not valid
 */
export function starkSessionConfigFactory(customConfig: StarkSessionConfig): StarkSessionConfig {
	const invalidConfigErrorPrefix: string = "StarkSessionModule: invalid StarkSessionConfig object. ";
	const invalidConfigErrorAppInitSuffix: string =
		" should have the prefix '" + starkAppInitStateName + ".' in order to be configured correctly as an application initial state";
	const invalidConfigErrorAppExitSuffix: string =
		" should have the prefix '" + starkAppExitStateName + ".' in order to be configured correctly as an application exit state";

	// validate config to ensure that the init/exit states have the correct StarkAppInit or StarkAppExit parent
	if (customConfig.loginStateName && !customConfig.loginStateName.startsWith(starkAppInitStateName)) {
		throw new Error(invalidConfigErrorPrefix + "'loginStateName' value" + invalidConfigErrorAppInitSuffix);
	}
	if (customConfig.preloadingStateName && !customConfig.preloadingStateName.startsWith(starkAppInitStateName)) {
		throw new Error(invalidConfigErrorPrefix + "'preloadingStateName' value" + invalidConfigErrorAppInitSuffix);
	}
	if (customConfig.sessionExpiredStateName && !customConfig.sessionExpiredStateName.startsWith(starkAppExitStateName)) {
		throw new Error(invalidConfigErrorPrefix + "'sessionExpiredStateName' value" + invalidConfigErrorAppExitSuffix);
	}
	if (customConfig.sessionLogoutStateName && !customConfig.sessionLogoutStateName.startsWith(starkAppExitStateName)) {
		throw new Error(invalidConfigErrorPrefix + "'sessionLogoutStateName' value" + invalidConfigErrorAppExitSuffix);
	}

	return customConfig;
}

@NgModule({
	imports: [StoreModule.forFeature("StarkSession", starkSessionReducers), StarkUserModule]
})
export class StarkSessionModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @param sessionConfig - Object containing the configuration (if any) for the Session service
	 * @returns a module with providers
	 */
	public static forRoot(sessionConfig?: StarkSessionConfig): ModuleWithProviders {
		return {
			ngModule: StarkSessionModule,
			providers: [
				{ provide: STARK_SESSION_SERVICE, useClass: StarkSessionServiceImpl },
				sessionConfig ? { provide: STARK_SESSION_CONFIG, useValue: starkSessionConfigFactory(sessionConfig) } : []
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
		parentModule: StarkSessionModule
	) {
		if (parentModule) {
			throw new Error("StarkSessionModule is already loaded. Import it in the AppModule only");
		}
	}
}
