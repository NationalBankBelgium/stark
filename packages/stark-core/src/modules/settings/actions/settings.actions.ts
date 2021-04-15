import { createAction, props, union } from "@ngrx/store";
import { starkSettingsStoreKey } from "../constants";

/**
 * Action that requires to persist the given language locally so that the language remains the same when the user comes back
 *
 * Parameter:
 *   - language - The language to persist
 */
export const persistPreferredLanguage = createAction(
	`[${starkSettingsStoreKey}] Persist Preferred Language`,
	props<{ language: string }>()
);

/**
 * Action that notifies the application that the preferred language was successfully persisted.
 */
export const persistPreferredLanguageSuccess = createAction(`[${starkSettingsStoreKey}] Persist Preferred Language Success`);

/**
 * Action that notifies the application that the preferred language could not be persisted.
 *
 * Parameter:
 *   - error - The reason why the preferred language could not be persisted
 */
export const persistPreferredLanguageFailure = createAction(
	`[${starkSettingsStoreKey}] Persist Preferred Language Failure`,
	props<{ error: any }>()
);

/**
 * Action that notifies the application that the preferred language should be changed.
 *
 * Parameter:
 *   - language - The new preferred language
 */
export const setPreferredLanguage = createAction(`[${starkSettingsStoreKey}] Set Preferred Language`, props<{ language: string }>());

/**
 * @ignore
 */
const all = union({ persistPreferredLanguage, persistPreferredLanguageSuccess, persistPreferredLanguageFailure, setPreferredLanguage });
export type Types = typeof all;
