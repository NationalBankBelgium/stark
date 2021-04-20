import { StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { ActionReducerMap, createSelector, createFeatureSelector } from "@ngrx/store";
import { HeroMovieSearchCriteria } from "../entities";
import { DemoGenericSearchActions } from "../actions";
import { demoGenericSearchReducer } from "./demo-generic-search.reducer";
import { demoGenericSearchStoreKey } from "../constants";

export interface DemoGenericSearchState {
	demoGenericSearch: StarkSearchState<HeroMovieSearchCriteria>;
}

export const demoGenericSearchReducers: ActionReducerMap<DemoGenericSearchState, DemoGenericSearchActions.Types> = {
	demoGenericSearch: demoGenericSearchReducer
};

export const selectDemoGenericSearch = createSelector(
	createFeatureSelector<DemoGenericSearchState>(demoGenericSearchStoreKey),
	(state: DemoGenericSearchState) => state.demoGenericSearch
);
