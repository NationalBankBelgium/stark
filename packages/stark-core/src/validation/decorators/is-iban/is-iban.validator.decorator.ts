import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator, getFromContainer } from "class-validator";

import { StarkValidatorImpl } from "../../validator";
import { StarkValidator } from "../../validator.intf";
import { starkIsIBANValidatorName } from "../../validators/is-iban/index";

/**
 * StarkIsIBAN validator constraint
 * Validates that the IBAN number provided is valid
 */
@ValidatorConstraint({ name: starkIsIBANValidatorName, async: false })
class StarkIsIBANConstraint implements ValidatorConstraintInterface {
	public validate(iban: string): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);
		return validator.starkIsIBAN(iban);
	}

	public defaultMessage(): string {
		return "$property value is not a valid IBAN number";
	}
}

/**
 * Validator decorator that uses the StarkIsIBAN validator constraint
 * @param validationOptions
 * @returns Function
 */
export function StarkIsIBAN(validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: StarkIsIBANConstraint
		});
	};
}
