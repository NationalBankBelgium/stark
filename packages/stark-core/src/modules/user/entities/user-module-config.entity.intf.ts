import { InjectionToken } from "@angular/core";

/**
 * The InjectionToken version of the config value
 */
export const STARK_USER_PROFILE_RESOURCE_PATH = new InjectionToken<StarkUserModuleConfig["userProfileResourcePath"]>(
	"StarkUserProfileResourcePath"
);

/**
 * Definition of the configuration object for the Stark User Module
 */
export interface StarkUserModuleConfig {
	/**
	 * Base path to be used in the Http requests to fetch the user profile resource
	 */
	userProfileResourcePath: string;
}
