"use strict";

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator, getFromContainer } from "class-validator";

import { StarkValidatorImpl } from "../../validator";
import { StarkValidator } from "../../validator.intf";
import { starkIsKBOValidatorName } from "../../validators/is-kbo";

/**
 * StarkIsBban validator constraint
 * Validates that the KBO number provided is valid
 */
@ValidatorConstraint({ name: starkIsKBOValidatorName, async: false })
class StarkIsKBOConstraint implements ValidatorConstraintInterface {
	public validate(kbo: string): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);

		return validator.starkIsKBO(kbo);
	}

	public defaultMessage(): string {
		return "$property value is not a valid KBO number";
	}
}

/**
 * Validator decorator that uses the StarkIsKBO validator constraint
 * @param validationOptions
 * @returns Function
 * @constructor
 */
export function StarkIsKBO(validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: StarkIsKBOConstraint
		});
	};
}
