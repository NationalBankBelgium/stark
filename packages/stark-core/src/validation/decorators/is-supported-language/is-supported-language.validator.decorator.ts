import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator, getFromContainer } from "class-validator";

import { StarkValidatorImpl } from "../../validator";
import { StarkValidator } from "../../validator.intf";
import { starkIsSupportedLanguageValidatorName } from "../../validators/is-supported-language";

/**
 * StarkIsSupportedLanguage validator constraint
 * validates that the language ISO code is supported by the Stark framework
 */
@ValidatorConstraint({ name: starkIsSupportedLanguageValidatorName, async: false })
class StarkIsSupportedLanguageConstraint implements ValidatorConstraintInterface {
	public validate(isoCode: string): boolean {
		const validator: StarkValidator = getFromContainer<StarkValidatorImpl>(StarkValidatorImpl);
		return validator.starkIsSupportedLanguage(isoCode);
	}

	public defaultMessage(): string {
		return "The language ISO code '$value' is not supported by the Stark framework.";
	}
}

/**
 * Validator decorator that uses the StarkIsSupportedLanguage validator constraint
 * @param validationOptions
 * @returns Function
 */
export function StarkIsSupportedLanguage(validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: StarkIsSupportedLanguageConstraint
		});
	};
}
