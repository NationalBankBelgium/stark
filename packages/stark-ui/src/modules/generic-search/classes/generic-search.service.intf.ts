import { Observable } from "rxjs";
import { StarkSearchState } from "../entities/search-state.entity.intf";

/**
 * Service to implement to use the Generic Search.
 */
export interface StarkGenericSearchService<SearchResultsType, CriteriaType> {
	/**
	 * Prepares everything that is needed for creating a new item
	 */
	createNew?(): void;

	/**
	 * Fetch the current search state from Redux
	 * @returns The Redux search state
	 */
	getSearchState(): Observable<StarkSearchState<CriteriaType>>;

	/**
	 * Reset the current search state in Redux
	 */
	resetSearchState(): void;

	/**
	 * Performs the search with the given criteria
	 * @param criteria - The search criteria
	 * @returns The search results
	 */
	search(criteria: CriteriaType): Observable<SearchResultsType[]>;
}
