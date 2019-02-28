import { FormGroup } from "@angular/forms";
import { EventEmitter } from "@angular/core";

/**
 * Interface that must be implemented by the SearchForm component that will be used together with the Generic Search component.
 * It defines the properties that are required and used by the Generic Search component.
 */
export interface StarkSearchFormComponent<CriteriaType> {
	/**
	 * Reference to the FormGroup to be bound to the form of the Generic Search.
	 *
	 * This reference will also be used by the {@link StarkGenericSearchComponent} in oder to pass the form to the {@link AbstractStarkSearchComponent}
	 * to validate and reset the form.
	 */
	searchForm: FormGroup;

	/**
	 * Emit the latest values of the search criteria whenever it has changed as a result of value changes in the form of the Generic Search
	 */
	workingCopyChanged: EventEmitter<CriteriaType>;

	/**
	 * Create a new FormGroup instance to be bound to the form of the Generic Search
	 * @param searchCriteria - The search criteria containing the initial values for the form fields
	 */
	createSearchForm(searchCriteria: CriteriaType): FormGroup;

	/**
	 * Reset the current FormGroup instance bound to the form of the Generic Search
	 * @param searchCriteria - The search criteria containing the reset values for the form fields
	 */
	resetSearchForm(searchCriteria: CriteriaType): void;
}
