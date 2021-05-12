import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidator {
	// Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
	public static areEqual(formGroup: FormGroup): ValidationErrors | null {
		let value: string | undefined;
		let valid = true;

		for (const key in formGroup.controls) {
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

		/* tslint:disable-next-line:no-null-keyword */
		return valid ? null : { areEqual: true };
	}
}

export function getConfirmPasswordValidator(formGroup: FormGroup): ValidatorFn {
	return (): ValidationErrors | null => {
		return PasswordValidator.areEqual(formGroup);
	};
}
