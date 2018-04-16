"use strict";

import { StarkSessionActionTypes, StarkSessionActions } from "../actions/index";
import { StarkSession, StarkSessionImpl } from "../entities/index";

export const starkSessionStoreKey: string = "starkSession";

const INITIAL_STATE: StarkSession = new StarkSessionImpl();

export function sessionReducer(
	state: Readonly<StarkSession> = INITIAL_STATE,
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
