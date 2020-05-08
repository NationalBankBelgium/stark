import { StarkLoggingService } from "@nationalbankbelgium/stark-core";
import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";

/**
 * Abstract class defining the source model to bind to form components in Stark (i.e. {@link AbstractStarkSearchComponent})
 * as well as methods to manipulate it.
 */
export abstract class AbstractStarkFormComponent<CriteriaType> {
	/**
	 * The form's original copy (the initial model when the form is pristine)
	 */
	public originalCopy!: CriteriaType;

	/**
	 * The form's working copy (the current model with the latest changes)
	 */
	public workingCopy!: CriteriaType;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 */
	protected constructor(public logger: StarkLoggingService) {}

	/**
	 * Set the form's original copy to the object passed as parameter (a deep cloned copy).
	 *
	 * Default: `{}` (empty object)
	 * @param originalCopy - The object to be set as the form's original copy
	 */
	protected setOriginalCopy(originalCopy: CriteriaType = <any>{}): void {
		this.originalCopy = originalCopy;
		this.workingCopy = cloneDeep(this.originalCopy);
	}

	/**
	 * Revert the form's working copy back to the original copy (a deep clone copy)
	 */
	protected reset(): void {
		this.workingCopy = cloneDeep(this.originalCopy);
	}

	/**
	 * Check whether the working copy is exactly the same as the original copy.
	 * Performs a deep comparison between the two objects to determine if they are equivalent.
	 */
	protected isDirty(): boolean {
		return !isEqual(this.workingCopy, this.originalCopy);
	}
}
