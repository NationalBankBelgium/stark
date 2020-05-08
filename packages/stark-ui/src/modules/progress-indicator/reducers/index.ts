import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkProgressIndicatorFullConfig } from "../entities";
import { StarkProgressIndicatorActions } from "../actions";
import { progressIndicatorReducer } from "./progress-indicator.reducer";

/**
 * Defines the part of the state assigned to the {@link StarkProgressIndicatorModule}
 */
export interface StarkProgressIndicatorState {
	/**
	 * State corresponding to the {@link StarkProgressIndicatorModule}
	 */
	progressIndicator: Map<string, StarkProgressIndicatorFullConfig>;
}

/**
 * Reducers assigned to the each property of the {@link StarkProgressIndicatorModule}'s state
 */
export const starkProgressIndicatorReducers: ActionReducerMap<StarkProgressIndicatorState, StarkProgressIndicatorActions> = {
	/**
	 * Reducer assigned to the state's `progressIndicator` property
	 */
	progressIndicator: progressIndicatorReducer
};

/**
 * NGRX Selector for the {@link StarkProgressIndicatorModule}'s state
 */
export const selectStarkProgressIndicator: MemoizedSelector<object, Map<string, StarkProgressIndicatorFullConfig>> = createSelector(
	createFeatureSelector<StarkProgressIndicatorState>("StarkProgressIndicator"),
	(state: StarkProgressIndicatorState) => state.progressIndicator
);
