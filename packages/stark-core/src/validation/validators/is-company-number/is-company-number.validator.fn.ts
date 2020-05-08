/**
 * @ignore
 * Name of the validator, in case injection is needed.
 */
export const starkIsCompanyNumberValidatorName = "starkIsCompanyNumber";

/**
 * @ignore
 * Validates that the given string is a valid company number (Belgium).
 * @param companyNumber - The company number to validate
 */
export function starkIsCompanyNumber(companyNumber: string): boolean {
	let valid = false;

	if (typeof companyNumber === "string") {
		const enterpriseNumberRegex: RegExp = /^[01]?[0-9]{3}[.][0-9]{3}[.][0-9]{3}/;
		const enterpriseNumberWithoutFormatRegex: RegExp = /^[01]?[0-9]{3}[0-9]{3}[0-9]{3}/;

		if (enterpriseNumberRegex.test(companyNumber) || enterpriseNumberWithoutFormatRegex.test(companyNumber)) {
			const enterpriseNumber: string = companyNumber.replace(/[^0-9]/g, "");
			const numberToCheck: number = parseInt(enterpriseNumber.substring(0, enterpriseNumber.length - 2), 10);
			const controlNumber: number = parseInt(enterpriseNumber.substring(enterpriseNumber.length - 2), 10);

			valid = 97 - (numberToCheck % 97) === controlNumber;
		}
	}

	return valid;
}
