import { createSelector, createFeatureSelector, MemoizedSelector } from "@ngrx/store";
import { StarkSettings } from "../entities";

export interface StarkSettingsState {
	settings: StarkSettings;
}

export const selectStarkSettings: MemoizedSelector<object, StarkSettings> = createSelector(
	createFeatureSelector<StarkSettingsState>("StarkSettings"),
	(state: StarkSettingsState) => state.settings
);
