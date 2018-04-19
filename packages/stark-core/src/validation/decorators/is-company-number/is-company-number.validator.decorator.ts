"use strict";

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator, getFromContainer } from "class-validator";

import { StarkValidatorImpl } from "../../validator";
import { StarkValidator } from "../../validator.intf";
import { starkIsCompanyNumberValidatorName } from "../../validators/is-company-number/index";

/**
 * StarkIsCompanyNumber validator constraint
 * Validates that the Company Number number provided is valid
 */
@ValidatorConstraint({ name: starkIsCompanyNumberValidatorName, async: false })
export class StarkIsCompanyNumberConstraint implements ValidatorConstraintInterface {
	public validate(companyNumber: string): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);
		return validator.starkIsCompanyNumber(companyNumber);
	}

	public defaultMessage(): string {
		return "$property value is not a valid company number";
	}
}

/**
 * Validator decorator that uses the StarkIsCompanyNumber validator constraint
 * @param validationOptions
 * @returns Function
 * @constructor
 */
export function StarkIsCompanyNumber(validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: StarkIsCompanyNumberConstraint
		});
	};
}
