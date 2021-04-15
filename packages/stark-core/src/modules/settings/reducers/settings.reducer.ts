import { StarkSettingsActions } from "../actions";
import { StarkSettings } from "../entities";
import { createReducer, on } from "@ngrx/store";

/**
 * Defines the initial state of the reducer
 */
const INITIAL_SETTINGS_STATE: StarkSettings = new StarkSettings();

/**
 * Definition of the reducer using `createReducer` method.
 */
const reducer = createReducer<StarkSettings, StarkSettingsActions.Types>(
	INITIAL_SETTINGS_STATE,
	on(StarkSettingsActions.setPreferredLanguage, (state, action) => ({ ...state, preferredLanguage: action.language }))
);

/**
 * Definition of the `settings` reducer
 * @param state - The state of the reducer
 * @param action - The action to apply to the reducer
 * @returns The new `StarkSettings` state
 */
export function settingsReducer(
	state: StarkSettings | undefined,
	action: StarkSettingsActions.Types
): Readonly<StarkSettings> {
	return reducer(state, action);
}
