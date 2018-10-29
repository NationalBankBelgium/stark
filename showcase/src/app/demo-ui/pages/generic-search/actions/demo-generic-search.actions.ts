import { Action } from "@ngrx/store";
import { HeroMovieSearchCriteria } from "../entities";

export enum DemoGenericActionTypes {
	SET_DEMO_GENERIC_SEARCH_CRITERIA = "[DemoGenericSearch] Set criteria",
	REMOVE_DEMO_GENERIC_SEARCH_CRITERIA = "[DemoGenericSearch] Remove criteria",
	DEMO_GENERIC_HAS_SEARCHED = "[DemoGenericSearch] Has searched",
	DEMO_GENERIC_HAS_SEARCHED_RESET = "[DemoGenericSearch] Has searched reset"
}

export class DemoGenericSearchSetCriteria implements Action {
	/**
	 * The type of action
	 */
	public readonly type: DemoGenericActionTypes.SET_DEMO_GENERIC_SEARCH_CRITERIA = DemoGenericActionTypes.SET_DEMO_GENERIC_SEARCH_CRITERIA;
	/**
	 * Class constructor
	 * @param criteria - Criteria to be set
	 */
	public constructor(public criteria: HeroMovieSearchCriteria) {}
}

export class DemoGenericSearchRemoveCriteria implements Action {
	/**
	 * The type of action
	 */
	public readonly type: DemoGenericActionTypes.REMOVE_DEMO_GENERIC_SEARCH_CRITERIA =
		DemoGenericActionTypes.REMOVE_DEMO_GENERIC_SEARCH_CRITERIA;
}

export class DemoGenericSearchHasSearched implements Action {
	/**
	 * The type of action
	 */
	public readonly type: DemoGenericActionTypes.DEMO_GENERIC_HAS_SEARCHED = DemoGenericActionTypes.DEMO_GENERIC_HAS_SEARCHED;
}

export class DemoGenericSearchHasSearchedReset implements Action {
	/**
	 * The type of action
	 */
	public readonly type: DemoGenericActionTypes.DEMO_GENERIC_HAS_SEARCHED_RESET = DemoGenericActionTypes.DEMO_GENERIC_HAS_SEARCHED_RESET;
}

export type DemoGenericSearchActions =
	| DemoGenericSearchRemoveCriteria
	| DemoGenericSearchHasSearchedReset
	| DemoGenericSearchHasSearched
	| DemoGenericSearchSetCriteria;
