import { createAction, props, union } from "@ngrx/store";
import { StarkUser } from "../../user/entities";
import { starkSessionStoreKey } from "../constants";

/**
 * Triggered when the [StarkSessionService setCurrentLanguage()]{@link StarkSessionService#setCurrentLanguage} method is called,
 * just before changing the current session's language.
 *
 * Parameter:
 *   - languageId - The target language to change to.
 */
export const changeLanguage = createAction(`[${starkSessionStoreKey}] Change Language`, props<{ languageId: string }>());

/**
 * Triggered when the current session's language has been successfully changed by calling
 * the [StarkSessionService setCurrentLanguage()]{@link StarkSessionService#setCurrentLanguage} method.
 *
 * Parameter:
 *   - languageId - The target language that was successfully changed to.
 */
export const changeLanguageSuccess = createAction(`[${starkSessionStoreKey}] Change Language Success`, props<{ languageId: string }>());

/**
 * Triggered when the change of the current session's language failed.
 *
 * Parameter:
 *   - error - The error that caused the language change to fail.
 */
export const changeLanguageFailure = createAction(`[${starkSessionStoreKey}] Change Language Failure`, props<{ error: any }>());

/**
 * Triggered by the [StarkSessionService login()]{@link StarkSessionService#login} method before the process to
 * initialize the session for the given user starts.
 *
 * Parameter:
 *   - user - The user whose session will be initialized.
 */
export const initializeSession = createAction(`[${starkSessionStoreKey}] Initialize Session`, props<{ user: StarkUser }>());

/**
 * Triggered when the initialization of the user's session has finished successfully.
 */
export const initializeSessionSuccess = createAction(`[${starkSessionStoreKey}] Initialize Session Success`);

/**
 * Triggered before the process to destroy the user's session starts right after the HTTP logout call has been sent.
 *
 * This action is dispatched whenever the user is going to be logged out due to:
 * 1. Manually clicking in the App Logout component (provided by the `StarkUI` package)
 * 2. Calling the [StarkSessionService logout()]{@link StarkSessionService#logout} method.
 * 3. Closing the browser tab.
 * 4. Being inactive for a certain period of time reaching the idle timeout defined by the
 * application's [StarkApplicationConfig sessionTimeout]{@link StarkApplicationConfig#sessionTimeout}.
 */
export const destroySession = createAction(`[${starkSessionStoreKey}] Destroy Session`);

/**
 * Triggered when the destruction of the user's session has finished successfully.
 * This action is the last action to be dispatched when the user is logged out (either manually by himself or automatically due to inactivity).
 */
export const destroySessionSuccess = createAction(`[${starkSessionStoreKey}] Destroy Session Success`);

/**
 * Triggered when the countdown to automatically destroy the user's session due to inactivity starts.
 *
 * The countdown is defined in the application's [StarkApplicationConfig sessionTimeoutWarningPeriod]{@link StarkApplicationConfig#sessionTimeoutWarningPeriod}.
 *
 * By default is set to 15 seconds.
 *
 * Parameter:
 *   - countdown - The countdown until the session will be automatically destroyed.
 */
export const sessionTimeoutCountdownStart = createAction(`[${starkSessionStoreKey}] Session Timeout Countdown Start`, props<{ countdown: number }>());

/**
 * Triggered when the countdown to automatically destroy the user's session due to inactivity stops.
 *
 * This countdown stops automatically when the user is active again and no longer idle.
 */
export const sessionTimeoutCountdownStop = createAction(`[${starkSessionStoreKey}] Session Timeout Countdown Stop`);

/**
 * Triggered when the countdown to automatically destroy the user's session has finished. In this case the user will be automatically logged out.
 */
export const sessionTimeoutCountdownFinish = createAction(`[${starkSessionStoreKey}] Session Timeout Countdown Finish`);

/**
 * Triggered when the user is about to be logged out and the HTTP logout call to be sent.
 * This action is called before the process to destroy the user's session starts.
 *
 * This action is dispatched by the [StarkSessionService logout()]{@link StarkSessionService#logout} method or in case the browser tab was closed and is dispatched before
 * the {@link destroySession} action.
 */
export const sessionLogout = createAction(`[${starkSessionStoreKey}] Session Logout`);

/**
 * Triggered by the [StarkSessionService pauseUserActivityTracking()]{@link StarkSessionService#pauseUserActivityTracking} method
 * when the user activity tracking is paused (automatically done by the {@link StarkSessionService}).
 */
export const userActivityTrackingPause = createAction(`[${starkSessionStoreKey}] User Activity Tracking Pause`);

/**
 * Triggered by the [StarkSessionService resumeUserActivityTracking()]{@link StarkSessionService#resumeUserActivityTracking} method
 * when the user activity tracking is resumed (automatically done by the {@link StarkSessionService}).
 */
export const userActivityTrackingResume = createAction(`[${starkSessionStoreKey}] User Activity Tracking Resume`);

/**
 * @ignore
 */
const all = union({
	changeLanguage,
	changeLanguageSuccess,
	changeLanguageFailure,
	initializeSession,
	initializeSessionSuccess,
	destroySession,
	destroySessionSuccess,
	sessionTimeoutCountdownStart,
	sessionTimeoutCountdownStop,
	sessionTimeoutCountdownFinish,
	sessionLogout,
	userActivityTrackingPause,
	userActivityTrackingResume
});
export type Types = typeof all;
