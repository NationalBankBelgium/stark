import { AbstractControl, UntypedFormControl, UntypedFormGroup } from "@angular/forms";

export type StarkFormControlState = "untouched" | "touched" | "pristine" | "dirty";
export type StarkFormState = "untouched" | "pristine" | "submitted" | "dirty";

/**
 * Util class used to perform common operations on Angular {@link https://v12.angular.io/api/forms/FormGroup|FormGroups} and
 * {@link https://v12.angular.io/api/forms/FormControl|FormControls}
 */
export class StarkFormUtil {
	/**
	 * Set all the fields of the given {@link https://v12.angular.io/api/forms/FormGroup|FormGroup} to the specified state(s)
	 * @param formGroup - Angular form group object
	 * @param statesToBeSet - States to be set to the different controls in the form
	 */
	public static setFormChildControlsState(formGroup: UntypedFormGroup, statesToBeSet: StarkFormControlState[]): void {
		// Verifying it is indeed an Angular FormGroup
		if (StarkFormUtil.isFormGroup(formGroup)) {
			for (const key of Object.keys(formGroup.controls)) {
				// filtering just the FormControl objects of the form
				const formControl: AbstractControl = formGroup.controls[key];
				if (StarkFormUtil.isFormControl(formControl)) {
					StarkFormUtil.setFormControlState(formControl, statesToBeSet);
				}
			}
		}
	}

	/**
	 * Set the given {@link https://v12.angular.io/api/forms/FormControl|FormControl} to the specified state(s)
	 * @param formControl - Angular form control object contained in an Angular form group
	 * @param statesToBeSet - States to be set to the form control
	 */
	public static setFormControlState(formControl: UntypedFormControl, statesToBeSet: StarkFormControlState[]): void {
		for (const formControlState of statesToBeSet) {
			switch (formControlState) {
				case "untouched":
					// control has not lost focus yet
					formControl.markAsUntouched();
					break;
				case "touched":
					// control has lost focus.
					formControl.markAsTouched();
					break;
				case "pristine":
					// user has not interacted with the form yet.
					formControl.markAsPristine();
					break;
				case "dirty":
					// user has already interacted with the form
					formControl.markAsDirty();
					break;
				default:
					break;
			}
		}
	}

	/**
	 * Set the given {@link https://v12.angular.io/api/forms/FormGroup|FormGroup} to the specified state(s).
	 * Possible states: `untouched`, `pristine`, `dirty`, `submitted`
	 * @param formGroup - Angular form group object
	 * @param statesToBeSet - States to be set to the form
	 */
	public static setFormGroupState(formGroup: UntypedFormGroup, statesToBeSet: StarkFormState[]): void {
		// Verifying it is indeed an Angular FormGroup
		if (StarkFormUtil.isFormGroup(formGroup)) {
			for (const formControlState of statesToBeSet) {
				switch (formControlState) {
					case "untouched":
						// control has not lost focus yet
						formGroup.markAsUntouched();
						break;
					case "pristine":
						// user has not interacted with the form yet.
						formGroup.markAsPristine();
						break;
					case "dirty":
						// user has already interacted with the form
						formGroup.markAsDirty();
						break;
					case "submitted":
						// user has already interacted with the form
						// FIXME Find alternative to $setSubmitted with ReactiveForm if needed
						// formGroup.$setSubmitted();
						break;
					default:
						break;
				}
			}
		}
	}

	/**
	 * Check whether the given {@link https://v12.angular.io/api/forms/FormGroup|FormGroup} is valid (all fields are valid).
	 * If valid, all the form fields will be set to their `pristine` state, otherwise to their `touched` state
	 * (calling `setFormControlState` function).
	 * @param formGroup - Angular form group object
	 */
	public static isFormGroupValid(formGroup: UntypedFormGroup): boolean {
		if (formGroup.invalid) {
			StarkFormUtil.setFormChildControlsState(formGroup, ["touched"]);
			return false;
		}

		StarkFormUtil.setFormChildControlsState(formGroup, ["pristine"]);
		return true;
	}

	/**
	 * {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards|TypeGuard} to check that the given object
	 * is an actual instance of an Angular {@link https://v12.angular.io/api/forms/FormGroup|FormGroup}.
	 * @param formGroup - Angular form object
	 */
	public static isFormGroup(formGroup: any): formGroup is UntypedFormGroup {
		// eslint-disable-next-line no-prototype-builtins
		return typeof formGroup !== "undefined" && formGroup.hasOwnProperty("controls");
	}

	/**
	 * {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards|TypeGuard} to check that the given object
	 * is an actual instance of an Angular {@link https://v12.angular.io/api/forms/FormControl|FormControl}.
	 * @param formControl - Angular form field object
	 */
	public static isFormControl(formControl: any): formControl is UntypedFormControl {
		return typeof formControl === "object" && typeof formControl["setValue"] !== "undefined";
	}
}
