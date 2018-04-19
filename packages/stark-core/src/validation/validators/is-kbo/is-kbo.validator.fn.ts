"use strict";
import { starkIsCompanyNumber } from "../is-company-number/is-company-number.validator.fn";
import { starkIsEstablishmentUnitNumber } from "../is-establishment-unit-number/is-establishment-unit-number.validator.fn";

export const starkIsKBOValidatorName: string = "starkIsKBO";

export function starkIsKBO(kbo: string): boolean {
	return starkIsCompanyNumber(kbo) || starkIsEstablishmentUnitNumber(kbo);
}
