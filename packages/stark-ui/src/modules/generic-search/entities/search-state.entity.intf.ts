/**
 * This interface describes the object which is stored in @ngrx/store and used by the Generic Search to make its job.
 */
export interface StarkSearchState<T> {
	/**
	 * Indicates if the searchState has been already searched.
	 */
	hasBeenSearched?: boolean;

	/**
	 * Criteria to be used for a search.
	 */
	criteria: T;
}
