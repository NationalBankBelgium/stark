import { StarkSettingsActions, StarkSettingsActionTypes } from "../actions";
import { StarkSettings } from "../entities";

/**
 * Key defined to find the service in a store
 */
export const starkSettingsStoreKey = "starkSettings";

/**
 * Defines the initial state of the reducer
 */
const INITIAL_SETTINGS_STATE: StarkSettings = new StarkSettings();

/**
 * Definition of the `settings` reducer
 * @param state - The state of the reducer
 * @param action - The action to apply to the reducer
 * @returns The new `StarkSettings` state
 */
export function settingsReducer(
	state: Readonly<StarkSettings> = INITIAL_SETTINGS_STATE,
	action: Readonly<StarkSettingsActions>
): Readonly<StarkSettings> {
	// the new state will be calculated from the data coming in the actions
	switch (action.type) {
		case StarkSettingsActionTypes.PERSIST_PREFERRED_LANGUAGE_SUCCESS:
			return state;

		case StarkSettingsActionTypes.PERSIST_PREFERRED_LANGUAGE_FAILURE:
			return state;

		// this case is ignored by the reducer as it does not result in a state change
		// an effect takes care of doing what needs to be done with it
		// case StarkSettingsActions.PERSIST_PREFERRED_LANGUAGE:
		// return state;

		case StarkSettingsActionTypes.SET_PREFERRED_LANGUAGE:
			return { ...state, preferredLanguage: action.language };

		default:
			return state;
	}
}
