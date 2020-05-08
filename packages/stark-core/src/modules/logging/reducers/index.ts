import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkLogging } from "../entities";
import { StarkLoggingActions } from "../actions";
import { loggingReducer } from "./logging.reducer";

/**
 * Defines the part of the state assigned to the {@link StarkLoggingModule}
 */
export interface StarkLoggingState {
	/**
	 * State corresponding to the {@link StarkLoggingModule}
	 */
	logging: StarkLogging;
}

/**
 * Reducers assigned to each property of the {@link StarkLoggingModule}'s state
 */
export const starkLoggingReducers: ActionReducerMap<StarkLoggingState, StarkLoggingActions> = {
	/**
	 * Reducer assigned to the state's `logging` property
	 */
	logging: loggingReducer
};

/**
 * NGRX Selector for the {@link StarkLoggingModule}'s state
 */
export const selectStarkLogging: MemoizedSelector<object, StarkLogging> = createSelector(
	createFeatureSelector<StarkLoggingState>("StarkLogging"),
	(state: StarkLoggingState) => state.logging
);
