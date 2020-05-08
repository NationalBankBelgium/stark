import { getFromContainer, registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { StarkValidatorImpl } from "../../validator";
import { StarkValidator } from "../../validator.intf";
import { starkIsBICValidatorName } from "../../validators/is-bic";

/**
 * StarkIsBIC validator constraint
 * Validates that the BIC address provided is valid
 */
@ValidatorConstraint({ name: starkIsBICValidatorName, async: false })
class StarkIsBICConstraint implements ValidatorConstraintInterface {
	/**
	 * Validates that a give BIC address is valid
	 * @param bic - The bic to validate
	 * @returns `true` if the bic has been validated
	 */
	public validate(bic: string): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);
		return validator.starkIsBIC(bic);
	}

	/**
	 * Default message displayed if the BIC address is not valid
	 * @returns A default message
	 */
	public defaultMessage(): string {
		return "$property value is not a valid BIC address";
	}
}

/**
 * Validator decorator that uses the StarkIsBIC validator constraint
 * @param validationOptions - The options used for validation
 * @returns Function
 */
export function StarkIsBIC(validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: StarkIsBICConstraint
		});
	};
}
