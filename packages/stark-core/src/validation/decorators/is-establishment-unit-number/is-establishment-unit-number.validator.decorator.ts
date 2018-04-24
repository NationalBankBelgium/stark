import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator, getFromContainer } from "class-validator";

import { StarkValidatorImpl } from "../../validator";
import { StarkValidator } from "../../validator.intf";
import { starkIsEstablishmentUnitNumberValidatorName } from "../../validators/is-establishment-unit-number/index";

/**
 * StarkIsBban validator constraint
 * Validates that the Establishment number provided is valid
 */
@ValidatorConstraint({ name: starkIsEstablishmentUnitNumberValidatorName, async: false })
class StarkIsEstablishmentUnitNumberConstraint implements ValidatorConstraintInterface {
	public validate(establishmentNumber: string): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);

		return validator.starkIsEstablishmentUnitNumber(establishmentNumber);
	}

	public defaultMessage(): string {
		return "$property value is not a valid Establishment number";
	}
}

/**
 * Validator decorator that uses the StarkIsIsEstablishmentUnitNumber validator constraint
 * @param validationOptions
 * @returns Function
 */
export function StarkIsEstablishmentUnitNumber(validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: StarkIsEstablishmentUnitNumberConstraint
		});
	};
}
