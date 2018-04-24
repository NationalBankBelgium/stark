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
import { starkIsBBANValidatorName } from "../../validators/is-bban/index";

/**
 * StarkIsBBAN validator constraint
 * Validates that the BBAN number provided is valid
 */
@ValidatorConstraint({ name: starkIsBBANValidatorName, async: false })
class StarkIsBBANConstraint implements ValidatorConstraintInterface {
	public validate(bban: string, validationArguments?: ValidationArguments): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);
		const constraint: string = validationArguments && validationArguments.constraints[0] ? validationArguments.constraints[0] : "";

		return validator.starkIsBBAN(bban, validationArguments ? validationArguments.object[constraint] : "");
	}

	public defaultMessage(): string {
		return "$property value is not a valid BBAN number";
	}
}

/**
 * Validator decorator that uses the StarkIsBBAN validator constraint
 * @param property
 * @param validationOptions
 * @returns Function
 */
export function StarkIsBBAN(property: string, validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: StarkIsBBANConstraint
		});
	};
}
