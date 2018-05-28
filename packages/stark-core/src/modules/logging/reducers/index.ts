import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkLogging } from "../entities";
import { loggingReducer } from "../reducers";
import { StarkLoggingActions } from "../actions";

export interface StarkLoggingState {
	logging: StarkLogging;
}

export const starkLoggingReducers: ActionReducerMap<StarkLoggingState, StarkLoggingActions> = {
	logging: loggingReducer
};

export const selectStarkLogging: MemoizedSelector<object, StarkLogging> = createSelector(
	createFeatureSelector<StarkLoggingState>("StarkLogging"),
	(state: StarkLoggingState) => state.logging
);
