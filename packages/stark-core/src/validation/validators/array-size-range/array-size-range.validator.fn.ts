import { arrayMaxSize, arrayMinSize } from "class-validator";

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
	let isValid = true;

	if (typeof minSize !== "undefined") {
		isValid = isValid && arrayMinSize(array, minSize);
	}
	if (typeof maxSize !== "undefined") {
		isValid = isValid && arrayMaxSize(array, maxSize);
	}
	return isValid;
}
