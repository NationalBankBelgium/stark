const _floor: Function = require("lodash/floor");

import { isValidBBAN } from "ibantools";

export const starkIsBBANValidatorName: string = "starkIsBBAN";

export function starkIsBBAN(bban: string, countryCode: string = ""): boolean {
	const strippedBban: string = typeof bban === "string" ? bban.replace(/\s/g, "") : bban;
	if (isValidBBAN(strippedBban, countryCode.toUpperCase())) {
		if (countryCode.match(/^BE/i)) {
			const checkDigit: number = parseInt(strippedBban.substring(strippedBban.length - 2), 10);
			const calculatedCheckDigit: number = calculateCheckDigit(strippedBban);

			return checkDigit === calculatedCheckDigit;
		}

		return true;
	}
	return false;
}

function calculateCheckDigit(bbanNumber: string): number {
	const firstPart: number = parseInt(bbanNumber.substring(0, bbanNumber.length - 2), 10);
	let checkDigit: number = _floor(firstPart % 97);
	if (checkDigit === 0) {
		checkDigit = 97;
	}

	return checkDigit;
}
