import floor from "lodash-es/floor";

/**
 * @ignore
 * Name of the validator, in case injection is needed.
 */
export const starkIsISINValidatorName = "starkIsISIN";

/**
 * @ignore
 * An International Securities Identification Number (ISIN) uniquely identifies a security. Its structure is defined in ISO 6166.
 * Securities for which ISINs are issued include bonds, commercial paper, equities and warrants. The ISIN code is a 12-character
 * alpha-numerical code that does not contain information characterizing financial instruments but serves for uniform identification
 * of a security at trading and settlement.
 *
 * Checks if the number is a valid ISIN number (Modulus 10 Double Add Double)
 */
export function starkIsISIN(isin: string): boolean {
	const modulo = 10;
	const base = 36;
	const lengthWithoutCheckDigit = 11;
	const isinPattern: RegExp = /^[A-Z]{2}([A-Z0-9]){9}[0-9]/;

	let isValid = false;
	if (typeof isin === "string" && isinPattern.test(isin)) {
		let digits = "";

		for (let i = 0; i < lengthWithoutCheckDigit; i++) {
			digits += parseInt(isin[i], base).toString();
		}

		digits = digits.split("").reverse().join("");

		let sum = 0;
		for (let j = 0; j < digits.length; j++) {
			let digit: number = parseInt(digits[j], base);

			if (j % 2 === 0) {
				digit *= 2;
			}

			sum += floor(digit / modulo);
			sum += digit % modulo;
		}

		const currentCheckDigit: number = parseInt(isin[lengthWithoutCheckDigit], base);
		const expectedCheckDigit: number = sum % modulo === 0 ? 0 : (floor(sum / modulo) + 1) * modulo - sum;
		isValid = currentCheckDigit === expectedCheckDigit;
	}
	return isValid;
}
