import { createSelector, createFeatureSelector, MemoizedSelector } from "@ngrx/store";
import { StarkLogging } from "../entities";

export interface StarkLoggingState {
	logging: StarkLogging;
}

export const selectStarkLogging: MemoizedSelector<object, StarkLogging> = createSelector(
	createFeatureSelector<StarkLoggingState>("StarkLogging"),
	(state: StarkLoggingState) => state.logging
);
