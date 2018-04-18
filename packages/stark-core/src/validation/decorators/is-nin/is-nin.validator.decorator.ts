"use strict";

import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	ValidationOptions,
	registerDecorator,
	getFromContainer
} from "class-validator";

import { StarkValidatorImpl } from "../../validator";
import { StarkValidator } from "../../validator.intf";
import { starkIsNINValidatorName } from "../../validators/is-nin";

/**
 * StarkIsNIN validator constraint
 * Validates that the NIN number provided is valid
 */
@ValidatorConstraint({ name: starkIsNINValidatorName, async: false })
class StarkIsNINConstraint implements ValidatorConstraintInterface {
	public validate(nin: string, validationArguments?: ValidationArguments): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);
		const constraint: string = validationArguments && validationArguments.constraints[0] ? validationArguments.constraints[0] : "";

		return validator.starkIsNIN(nin, validationArguments ? validationArguments.object[constraint] : "");
	}

	public defaultMessage(): string {
		return "$property value is not a valid NIN number";
	}
}

/**
 * Validator decorator that uses the StarkIsNIN validator constraint
 * @param property
 * @param validationOptions
 * @returns Function
 * @constructor
 */
export function StarkIsNIN(property: string, validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: StarkIsNINConstraint
		});
	};
}
