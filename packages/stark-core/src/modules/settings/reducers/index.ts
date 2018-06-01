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

export const selectStarkSettingsFeature: MemoizedSelector<object, StarkSettingsState> = createFeatureSelector<StarkSettingsState>(
	"StarkSettings"
);

export const selectStarkSettings: MemoizedSelector<object, StarkSettings> = createSelector(
	selectStarkSettingsFeature,
	(state: StarkSettingsState) => state.settings
);
