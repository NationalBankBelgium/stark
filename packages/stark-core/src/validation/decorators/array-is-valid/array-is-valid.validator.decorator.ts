import {
	registerDecorator,
	validateSync,
	ValidationError,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from "class-validator";
import { StarkValidationErrorsUtil } from "../../../util/validation-errors.util";

/**
 * Name of the validator, in case injection is needed.
 */
export const starkArrayIsValidValidatorName = "starkArrayIsValid";

/**
 * StarkArrayIsValid validator constraint
 * Validates that all entries in the Array are valid (validateSync is called in every value)
 */
@ValidatorConstraint({ name: starkArrayIsValidValidatorName, async: false })
class StarkArrayIsValidConstraint implements ValidatorConstraintInterface {
	/**
	 * an Array of validation errors' values
	 */
	public valuesValidationErrors: ValidationError[] = [];

	/**
	 * Validates that a give Array is valid
	 * @param array - the array to validate
	 * @returns `true` if the array is valid
	 */
	public validate(array: any[]): boolean {
		if (!array || !Array.isArray(array) || array.length === 0) {
			return false;
		}

		this.valuesValidationErrors = [];

		array.forEach((value: any) => {
			// skipping primitive types
			if (typeof value === "object") {
				this.valuesValidationErrors = [...this.valuesValidationErrors, ...validateSync(value)];
			}
		});

		return this.valuesValidationErrors.length === 0;
	}

	/**
	 * Default message displayed when the array contains invalid entries
	 * @returns A default message
	 */
	public defaultMessage(): string {
		let valuesValidationMessage: string = StarkValidationErrorsUtil.toString(this.valuesValidationErrors);

		if (valuesValidationMessage.length) {
			valuesValidationMessage = "\nValidation errors in $property array values:\n\n" + valuesValidationMessage;
		}

		return "$property array contains invalid entries.\n" + valuesValidationMessage;
	}
}

/**
 * Validator decorator that uses the StarkArrayIsValid validator constraint
 * @param validationOptions - options to determine if the array is valid
 * @returns Function
 */
export function StarkArrayIsValid(validationOptions?: ValidationOptions): Function {
	return (object: object, propertyName: string): void => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: StarkArrayIsValidConstraint
		});
	};
}
