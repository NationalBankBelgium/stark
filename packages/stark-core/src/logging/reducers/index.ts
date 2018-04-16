import { createSelector, createFeatureSelector, MemoizedSelector } from "@ngrx/store";
import { StarkLogging } from "../entities/index";

export { loggingReducer, starkLoggingStoreKey } from "./logging.reducer";

export interface StarkLoggingState {
	logging: StarkLogging;
}

export const selectStarkLogging: MemoizedSelector<object, StarkLogging> = createSelector(
	createFeatureSelector<StarkLoggingState>("StarkLogging"),
	(state: StarkLoggingState) => state.logging
);
