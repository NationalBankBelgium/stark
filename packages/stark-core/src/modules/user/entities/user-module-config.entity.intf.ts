import { InjectionToken } from "@angular/core";

/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the [StarkUserModuleConfig userProfileResourcePath]{@link StarkUserModuleConfig#userProfileResourcePath}
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
