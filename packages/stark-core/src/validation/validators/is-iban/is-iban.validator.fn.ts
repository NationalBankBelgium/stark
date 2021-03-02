import { electronicFormatIBAN, isValidIBAN } from "ibantools";

/**
 * @ignore
 * Name of the validator, in case injection is needed.
 */
export const starkIsIBANValidatorName = "starkIsIBAN";

/**
 * @ignore
 * Validates that the given string is a valid IBAN. (Based on the country)
 * @param iban - The IBAN number to validate
 */
export function starkIsIBAN(iban: string): boolean {
	const electronicIban = electronicFormatIBAN(iban);
	if (typeof electronicIban === "string") {
		// Since v2.0.0 of ibantools, isValidIBAN() is false if there is " " in the verified IBAN
		return isValidIBAN(electronicIban);
	}
	return false;
}
