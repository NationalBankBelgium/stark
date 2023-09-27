import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidator {
	// Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
	public static areEqual(formGroup: FormGroup): ValidationErrors | null {
		let value: string | undefined;
		let valid = true;

		for (const key in formGroup.controls) {
			// eslint-disable-next-line no-prototype-builtins
			if (formGroup.controls.hasOwnProperty(key)) {
				const control: FormControl = <FormControl>formGroup.controls[key];

				if (value === undefined) {
					value = control.value;
				} else if (value !== control.value) {
					valid = false;
					break;
				}
			}
		}

		/* eslint-disable-next-line no-null/no-null */
		return valid ? null : { areEqual: true };
	}
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function getConfirmPasswordValidator(formGroup: FormGroup): ValidatorFn {
	return (): ValidationErrors | null => PasswordValidator.areEqual(formGroup);
}
