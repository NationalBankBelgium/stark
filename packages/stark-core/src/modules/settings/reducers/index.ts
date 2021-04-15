import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import { StarkSettings } from "../entities";
import { StarkSettingsActions } from "../actions";
import { settingsReducer } from "./settings.reducer";
import { starkSettingsStoreKey } from "../constants";

/**
 * Defines the part of the state assigned to the {@link StarkSettingsModule}
 */
export interface StarkSettingsState {
	/**
	 * State corresponding to the {@link StarkSettingsModule}
	 */
	settings: StarkSettings;
}

/**
 * Reducers assigned to each property of the {@link StarkSettingsModule}'s state
 */
export const starkSettingsReducers: ActionReducerMap<StarkSettingsState, StarkSettingsActions.Types> = {
	/**
	 * Reducer assigned to the state's `settings` property
	 */
	settings: settingsReducer
};

/**
 * NGRX Selector for the {@link StarkSettingsModule}'s state
 */
export const selectStarkSettings = createSelector(
	createFeatureSelector<StarkSettingsState>(starkSettingsStoreKey),
	(state: StarkSettingsState) => state.settings
);
