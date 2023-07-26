import { StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { HeroMovieSearchCriteria } from "../entities";
import { DemoGenericSearchActions } from "../actions";
import { createReducer, on } from "@ngrx/store";

const INITIAL_STATE: Readonly<StarkSearchState<HeroMovieSearchCriteria>> = {
	criteria: new HeroMovieSearchCriteria(),
	hasBeenSearched: false
};

const reducer = createReducer<StarkSearchState<HeroMovieSearchCriteria>, DemoGenericSearchActions.Types>(
	INITIAL_STATE,
	on(DemoGenericSearchActions.setCriteria, (state, action) => ({ ...state, criteria: action.criteria })),
	on(DemoGenericSearchActions.removeCriteria, (state) => ({ ...state, criteria: INITIAL_STATE.criteria })),
	on(DemoGenericSearchActions.hasSearched, (state) => ({ ...state, hasBeenSearched: true })),
	on(DemoGenericSearchActions.hasSearchedReset, (state) => ({ ...state, hasBeenSearched: false }))
);

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function demoGenericSearchReducer(
	state: Readonly<StarkSearchState<HeroMovieSearchCriteria>> | undefined,
	action: Readonly<DemoGenericSearchActions.Types>
): Readonly<StarkSearchState<HeroMovieSearchCriteria>> {
	return reducer(state, action);
}
