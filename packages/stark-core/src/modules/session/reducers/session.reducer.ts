import { StarkSessionActions, StarkSessionActionTypes } from "../actions";
import { StarkSession, StarkSessionImpl } from "../entities";

/**
 * Key defined to find the service in a store
 */
export const starkSessionStoreKey = "starkSession";

/**
 * Defines the initial state of the reducer
 */
const INITIAL_SESSION_STATE: StarkSession = new StarkSessionImpl();

/**
 * Definition of the `session` reducer
 * @param state: the state of the reducer
 * @param action: the action to apply to the reducer
 * @returns The new `StarkSession` state
 */
export function sessionReducer(
	state: Readonly<StarkSession> = INITIAL_SESSION_STATE,
	action: Readonly<StarkSessionActions>
): Readonly<StarkSession> {
	// the new state will be calculated from the data coming in the actions
	switch (action.type) {
		case StarkSessionActionTypes.CHANGE_LANGUAGE_SUCCESS:
			return { ...state, currentLanguage: action.languageId };

		case StarkSessionActionTypes.INITIALIZE_SESSION:
			return { ...state, user: action.user };

		case StarkSessionActionTypes.DESTROY_SESSION:
			return { ...state, user: undefined };

		default:
			return state;
	}
}
