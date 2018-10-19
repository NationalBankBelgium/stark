import { InjectionToken } from "@angular/core";

/**
 * The InjectionToken version of the config name
 */
export const STARK_SESSION_CONFIG: InjectionToken<StarkSessionConfig> = new InjectionToken<StarkSessionConfig>("StarkSessionConfig");

/**
 * Definition of the configuration object for the Stark Session service
 */
export interface StarkSessionConfig {
	/**
	 * Router state for the Login page where the user can choose a profile and use it to impersonate himself as someone else.
	 * This state is only used in DEVELOPMENT.
	 */
	loginStateName?: string;

	/**
	 * Router state for the Preloading page where the user profile is fetched and used to automatically log the user in.
	 * This state is only used in PRODUCTION.
	 */
	preloadingStateName?: string;

	/**
	 * Router state for the Session Expired page to be shown when the user has been automatically logged out.
	 * Such automatic logout occurs when the timeout of the session expiration timer (triggered due to user inactivity) is reached.
	 * This state is used in PRODUCTION and DEVELOPMENT.
	 */
	sessionExpiredStateName?: string;

	/**
	 * Router state for the Session Logout Page that will be shown when the user intentionally logs out from the application.
	 * This state is used in PRODUCTION and DEVELOPMENT.
	 */
	sessionLogoutStateName?: string;
}
