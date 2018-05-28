import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { StarkSettings } from "../entities";
import { settingsReducer } from "../reducers";
import { StarkSettingsActions } from "../actions";

export interface StarkSettingsState {
	settings: StarkSettings;
}

export const starkSettingsReducers: ActionReducerMap<StarkSettingsState, StarkSettingsActions> = {
	settings: settingsReducer
};

export const selectStarkSettings: MemoizedSelector<object, StarkSettings> = createSelector(
	createFeatureSelector<StarkSettingsState>("StarkSettings"),
	(state: StarkSettingsState) => state.settings
);
