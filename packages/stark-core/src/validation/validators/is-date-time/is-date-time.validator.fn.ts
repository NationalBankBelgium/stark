import moment from "moment";

/**
 * @ignore
 * Name of the validator, in case injection is needed
 */
export const starkIsDateTimeValidatorName = "starkIsDateTime";

/**
 * @ignore
 * Validates that the given string is a valid date.
 * @param inputString - The date and time to validate
 * @param format - The date format used to validate the entered date
 */
export function starkIsDateTime(inputString: string, format: string = "DD-MM-YYYY HH:mm:ss"): boolean {
	return moment(inputString, format, true).isValid();
}
