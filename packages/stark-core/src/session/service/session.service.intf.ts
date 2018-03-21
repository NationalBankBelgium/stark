"use strict";

import {Observable} from "rxjs/Observable";
import {StarkUser} from "../user/index";

export const starkSessionServiceName: string = "StarkSessionService";

/**
 * Stark Session Service.
 * Service to get/set session settings (language, ...).
 */
export interface StarkSessionService {
	/**
	 * NBB-specific headers necessary for faking pre-authentication in non-production environments
	 * @returns A Map containing the fake pre-authentication headers
	 */
	readonly fakePreAuthenticationHeaders: Map<string, string>;

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
	 * Performs the login of the user. Internally, it performs all the necessary actions to initialize the session.
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
}
