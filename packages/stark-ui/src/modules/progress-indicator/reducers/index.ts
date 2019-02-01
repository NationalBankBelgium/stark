import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkProgressIndicatorConfig } from "../entities";
import { StarkProgressIndicatorActions } from "../actions";
import { progressIndicatorReducer } from "./progress-indicator.reducer";

/**
 * We define part of the state assigned to the session module
 */
export interface StarkProgressIndicatorState {
	/**
	 * The session property
	 * @link StarkProgressIndicatorConfig
	 */
	progressIndicator: Map<string, StarkProgressIndicatorConfig>;
}

/**
 * We assign a reducer to our session property
 */
export const starkProgressIndicatorReducers: ActionReducerMap<StarkProgressIndicatorState, StarkProgressIndicatorActions> = {
	/**
	 * the reducer is assigned to our property
	 */
	progressIndicator: progressIndicatorReducer
};

/**
 * The selector will return the part of the state assigned to the logging when called
 */
export const selectStarkProgressIndicator: MemoizedSelector<object, Map<string, StarkProgressIndicatorConfig>> = createSelector(
	createFeatureSelector<StarkProgressIndicatorState>("StarkProgressIndicator"),
	(state: StarkProgressIndicatorState) => state.progressIndicator
);
