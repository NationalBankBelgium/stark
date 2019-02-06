import { StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { HeroMovieSearchCriteria } from "../entities/hero-movie-search.entity";
import { DemoGenericActionTypes, DemoGenericSearchActions } from "../actions";

const INITIAL_STATE: Readonly<StarkSearchState<HeroMovieSearchCriteria>> = {
	criteria: new HeroMovieSearchCriteria(),
	hasBeenSearched: false
};

export function demoGenericSearchReducer(
	state: Readonly<StarkSearchState<HeroMovieSearchCriteria>> = INITIAL_STATE,
	action: Readonly<DemoGenericSearchActions>
): Readonly<StarkSearchState<HeroMovieSearchCriteria>> {
	switch (action.type) {
		case DemoGenericActionTypes.SET_DEMO_GENERIC_SEARCH_CRITERIA:
			return { ...state, criteria: action.criteria };
		case DemoGenericActionTypes.REMOVE_DEMO_GENERIC_SEARCH_CRITERIA:
			return { ...state, criteria: INITIAL_STATE.criteria };
		case DemoGenericActionTypes.DEMO_GENERIC_HAS_SEARCHED:
			return { ...state, hasBeenSearched: true };
		case DemoGenericActionTypes.DEMO_GENERIC_HAS_SEARCHED_RESET:
			return { ...state, hasBeenSearched: false };
		default:
			return state;
	}
}
