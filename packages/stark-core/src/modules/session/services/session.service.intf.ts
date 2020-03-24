import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { StarkUser } from "../../user/entities";

/**
 * @ignore
 */
export const starkSessionServiceName = "StarkSessionService";
/**
 * {@link https://v7.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkSessionService}
 */
export const STARK_SESSION_SERVICE: InjectionToken<StarkSessionService> = new InjectionToken<StarkSessionService>(starkSessionServiceName);

/**
 * Stark Session Service.
 * Service to get/set session settings (language, ...).
 */
export interface StarkSessionService {
	/**
	 * Authentication headers necessary for non-production environments
	 * @returns A Map containing the development authentication headers
	 */
	readonly devAuthenticationHeaders: Map<string, string | string[]>;

	/**
	 * Returns the session's current {@link StarkUser}
	 *
	 * @returns Observable that will emit the current user and the latest value whenever it changes
	 */
	getCurrentUser(): Observable<StarkUser | undefined>;

	/**
	 * Gets the session's current language (language Id)
	 *
	 * @returns Observable that will emit the currentLanguage and the latest value whenever it changes
	 */
	getCurrentLanguage(): Observable<string>;

	/**
	 * Sets the current session's language (language Id).
	 * It dispatches a CHANGE_LANGUAGE action to the NGRX-Store
	 *
	 * @param newLanguage - The language Id to be set
	 */
	setCurrentLanguage(newLanguage: string): void;

	/**
	 * Performs the login of the given {@link StarkUser}. Internally, it performs all the necessary actions to initialize the session.
	 *
	 * @param user - The user to log in.
	 */
	login(user: StarkUser): void;

	/**
	 * Performs the logout of the user. Internally, it performs all the necessary actions to destroy the session.
	 */
	logout(): void;

	/**
	 * Pauses the tracking of user activity.
	 * It dispatches a USER_ACTIVITY_TRACKING_PAUSE action to the NGRX-Store
	 */
	pauseUserActivityTracking(): void;

	/**
	 * Resumes the tracking of user activity.
	 * It dispatches a USER_ACTIVITY_TRACKING_RESUME action to the NGRX-Store
	 */
	resumeUserActivityTracking(): void;

	/**
	 * Add authentication headers to the session
	 * They are use by the http service to authenticate the user
	 */
	setDevAuthenticationHeaders(devAuthenticationHeaders: Map<string, string | string[]>): void;
}
