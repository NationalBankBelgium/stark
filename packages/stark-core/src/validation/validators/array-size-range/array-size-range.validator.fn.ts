"use strict";

import { getFromContainer } from "class-validator";
import { StarkValidator } from "../../validator.intf";
import { StarkValidatorImpl } from "../../validator";

export const starkArraySizeRangeValidatorName: string = "starkArraySizeRange";

export function starkArraySizeRange(array: any[], minSize: number, maxSize: number): boolean {
	const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);
	let isValid: boolean = true;

	if (typeof minSize !== "undefined") {
		isValid = isValid && validator.arrayMinSize(array, minSize);
	}
	if (typeof maxSize !== "undefined") {
		isValid = isValid && validator.arrayMaxSize(array, maxSize);
	}
	return isValid;
}
