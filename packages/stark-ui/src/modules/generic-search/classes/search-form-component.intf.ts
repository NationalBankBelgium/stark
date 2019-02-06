import { FormGroup } from "@angular/forms";
import { EventEmitter } from "@angular/core";

/**
 * Interface that must be implemented by the SearchForm component that will be used together with the Generic Search component.
 * It defines the properties that are required and used by the Generic Search component.
 */
export interface StarkSearchFormComponent<CriteriaType> {
	searchForm: FormGroup;
	workingCopyChanged: EventEmitter<CriteriaType>;
}
