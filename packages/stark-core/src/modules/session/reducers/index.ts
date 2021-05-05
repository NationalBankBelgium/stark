import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import { StarkSession } from "../entities";
import { sessionReducer } from "./session.reducer";
import { StarkSessionActions } from "../actions";
import { starkSessionStoreKey } from '../constants';

/**
 * Defines the part of the state assigned to the {@link StarkSessionModule}
 */
export interface StarkSessionState {
	/**
	 * State corresponding to the {@link StarkSessionModule}
	 */
	session: StarkSession;
}

/**
 * Reducers assigned to each property of the {@link StarkSessionModule}'s state
 */
export const starkSessionReducers: ActionReducerMap<StarkSessionState, StarkSessionActions.Types> = {
	/**
	 * Reducer assigned to the state's `session` property
	 */
	session: sessionReducer
};

/**
 * NGRX Selector for the {@link StarkSessionModule}'s state
 */
export const selectStarkSession = createSelector(
	createFeatureSelector<StarkSessionState>(starkSessionStoreKey),
	(state: StarkSessionState) => state.session
);
