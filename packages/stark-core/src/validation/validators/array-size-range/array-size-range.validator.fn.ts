import { getFromContainer, Validator } from "class-validator";

/**
 * @ignore
 * Name of the validator, in case injection is needed
 */
export const starkArraySizeRangeValidatorName = "starkArraySizeRange";

/**
 * @ignore
 * Validates that the size of the given array is between the minimum and maximum limits defined
 * @param array - An array of selected items
 * @param minSize - The minSize we want to apply to the array
 * @param maxSize - The maxSize we want to apply to the array
 * @returns `true` if the array size range is valid
 */
export function starkArraySizeRange(array: any[], minSize?: number, maxSize?: number): boolean {
	// by default, if the requested validator class is not already registered in the container from the 'class-validator' container
	// then it will registered automatically so it will indeed be a singleton
	// IMPORTANT: the StarkValidatorImpl should be used in the same way wherever needed to avoid instantiating it multiple times!
	const validator = getFromContainer(Validator);
	let isValid = true;

	if (typeof minSize !== "undefined") {
		isValid = isValid && validator.arrayMinSize(array, minSize);
	}
	if (typeof maxSize !== "undefined") {
		isValid = isValid && validator.arrayMaxSize(array, maxSize);
	}
	return isValid;
}
