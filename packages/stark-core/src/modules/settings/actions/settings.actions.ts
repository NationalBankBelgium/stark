import { Action } from "@ngrx/store";

export enum StarkSettingsActionTypes {
	PERSIST_PREFERRED_LANGUAGE = "PERSIST_PREFERRED_LANGUAGE",
	PERSIST_PREFERRED_LANGUAGE_SUCCESS = "PERSIST_PREFERRED_LANGUAGE_SUCCESS",
	PERSIST_PREFERRED_LANGUAGE_FAILURE = "PERSIST_PREFERRED_LANGUAGE_FAILURE",
	SET_PREFERRED_LANGUAGE = "SET_PREFERRED_LANGUAGE"
}

/**
 * Action that requires to persist the given language locally so that the language remains the same when the user comes back
 * @param language the language to persist
 * @returns The created action object
 */
export class PersistPreferredLanguage implements Action {
	public readonly type: "PERSIST_PREFERRED_LANGUAGE" = StarkSettingsActionTypes.PERSIST_PREFERRED_LANGUAGE;

	public constructor(public language: string) {}
}

/**
 * Action that notifies the application that the preferred language was successfully persisted.
 * @returns The created action object
 */
export class PersistPreferredLanguageSuccess implements Action {
	public readonly type: "PERSIST_PREFERRED_LANGUAGE_SUCCESS" = StarkSettingsActionTypes.PERSIST_PREFERRED_LANGUAGE_SUCCESS;
}

/**
 * Action that notifies the application that the preferred language could not be persisted.
 * @param error the reason why the preferred language could not be persisted
 * @returns The created action object
 */
export class PersistPreferredLanguageFailureimplements implements Action {
	public readonly type: "PERSIST_PREFERRED_LANGUAGE_FAILURE" = StarkSettingsActionTypes.PERSIST_PREFERRED_LANGUAGE_FAILURE;

	public constructor(public error: any) {}
}

/**
 * Action that notifies the application that the preferred language should be changed.
 * @param language the new preferred language
 * @returns The created action object
 */
export class SetPreferredLanguage implements Action {
	public readonly type: "SET_PREFERRED_LANGUAGE" = StarkSettingsActionTypes.SET_PREFERRED_LANGUAGE;

	public constructor(public language: string) {}
}

export type StarkSettingsActions =
	| PersistPreferredLanguage
	| PersistPreferredLanguageSuccess
	| PersistPreferredLanguageFailureimplements
	| SetPreferredLanguage;
