import { StarkSessionActions } from "../actions";
import { StarkSession, StarkSessionImpl } from "../entities";
import { createReducer, on } from "@ngrx/store";

/**
 * Defines the initial state of the reducer
 */
const INITIAL_SESSION_STATE: StarkSession = new StarkSessionImpl();

/**
 * Definition of the reducer using `createReducer` method.
 */
const reducer = createReducer<StarkSession, StarkSessionActions.Types>(
	INITIAL_SESSION_STATE,
	on(StarkSessionActions.changeLanguageSuccess, (state, action) => ({ ...state, currentLanguage: action.languageId })),
	on(StarkSessionActions.initializeSession, (state, action) => ({ ...state, user: action.user })),
	on(StarkSessionActions.destroySession, (state) => ({ ...state, user: undefined }))
);

/**
 * Definition of the `session` reducer function
 * @param state: the state of the reducer
 * @param action: the action to apply to the reducer
 * @returns The new `StarkSession` state
 */
export function sessionReducer(
	state: Readonly<StarkSession> | undefined,
	action: Readonly<StarkSessionActions.Types>
): Readonly<StarkSession> {
	return reducer(state, action);
}
