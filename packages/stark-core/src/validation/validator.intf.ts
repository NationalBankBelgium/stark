"use strict";

import { Validator } from "class-validator";

export interface StarkValidator extends Validator {
	starkArraySizeRange(value: any[], minSize: number, maxSize: number): boolean;
	starkIsBBAN(value: string, countryCode: string): boolean;
	starkIsBIC(value: string): boolean;
	starkIsCompanyNumber(value: string): boolean;
	starkIsEstablishmentUnitNumber(value: string): boolean;
	starkIsIBAN(value: string): boolean;
	starkIsISIN(value: string): boolean;
	starkIsKBO(value: string): boolean;
	starkIsNIN(value: string, countryCode: string): boolean;
	starkMapNotEmpty(value: Map<any, any>): boolean;
	starkIsSupportedLanguage(value: string): boolean;
	starkIsDateTime(value: string): boolean;
}
