import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkSession } from "../entities";
import { StarkSessionActions } from "../actions";
import { sessionReducer } from "./session.reducer";

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
export const starkSessionReducers: ActionReducerMap<StarkSessionState, StarkSessionActions> = {
	/**
	 * Reducer assigned to the state's `session` property
	 */
	session: sessionReducer
};

/**
 * NGRX Selector for the {@link StarkSessionModule}'s state
 */
export const selectStarkSession: MemoizedSelector<object, StarkSession> = createSelector(
	createFeatureSelector<StarkSessionState>("StarkSession"),
	(state: StarkSessionState) => state.session
);
