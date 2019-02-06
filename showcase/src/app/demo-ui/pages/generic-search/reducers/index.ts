import { StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { ActionReducerMap, createSelector, MemoizedSelector, createFeatureSelector } from "@ngrx/store";
import { HeroMovieSearchCriteria } from "../entities";
import { DemoGenericSearchActions } from "../actions";
import { demoGenericSearchReducer } from "./demo-generic-search.reducer";

export interface DemoGenericSearchState {
	demoGenericSearch: StarkSearchState<HeroMovieSearchCriteria>;
}

export const demoGenericSearchReducers: ActionReducerMap<DemoGenericSearchState, DemoGenericSearchActions> = {
	demoGenericSearch: demoGenericSearchReducer
};

export const selectDemoGenericSearch: MemoizedSelector<object, StarkSearchState<HeroMovieSearchCriteria>> = createSelector(
	createFeatureSelector<DemoGenericSearchState>("DemoGenericSearch"),
	(state: DemoGenericSearchState) => state.demoGenericSearch
);
