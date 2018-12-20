import { AbstractControl, FormControl, FormGroup } from "@angular/forms";

export type StarkFormControlState = "untouched" | "touched" | "pristine" | "dirty";
export type StarkFormState = "untouched" | "pristine" | "submitted" | "dirty";

export class StarkFormUtil {
	/**
	 * Set all the fields of the form group to the given state(s)
	 * @param formGroup - Angular form group object
	 * @param statesToBeSet - States to be set to the different controls in the form
	 */
	public static setFormChildControlsState(formGroup: FormGroup, statesToBeSet: StarkFormControlState[]): void {
		// Verifying it is indeed an Angular FormController
		if (StarkFormUtil.isFormGroup(formGroup)) {
			for (const key of Object.keys(formGroup.controls)) {
				// filtering just the ngModel child objects of the form
				const formControl: AbstractControl = formGroup.controls[key];
				if (StarkFormUtil.isFormControl(formControl)) {
					this.setFormControlState(formControl, statesToBeSet);
				}
			}
		}
	}

	/**
	 * Set the specified form control to the given state(s)
	 * @param formControl - Angular form control object contained in an Angular form group
	 * @param statesToBeSet - States to be set to the form control
	 */
	public static setFormControlState(formControl: FormControl, statesToBeSet: StarkFormControlState[]): void {
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
	 * Set the form to the given state(s). Possible states: "untouched", "pristine", "dirty", "submitted"
	 * @param formGroup - Angular form group object
	 * @param statesToBeSet - States to be set to the form
	 */
	public static setFormGroupState(formGroup: FormGroup, statesToBeSet: StarkFormState[]): void {
		// Verifying it is indeed an Angular FormController
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
	 * Check whether the form group is valid (all fields are valid).
	 * If valid, all the form fields will be set to their "pristine" state, otherwise to their "touched" state
	 * (calling setFormControlState function).
	 * @param formGroup - Angular form group object
	 */
	public static isFormGroupValid(formGroup: FormGroup): boolean {
		if (formGroup.invalid) {
			StarkFormUtil.setFormChildControlsState(formGroup, ["touched"]);
			return false;
		} else {
			StarkFormUtil.setFormChildControlsState(formGroup, ["pristine"]);
			return true;
		}
	}

	// type guard
	/**
	 * Check that the given form is an actual instance of an Angular form.
	 * @param formGroup - Angular form object
	 */
	public static isFormGroup(formGroup: any): formGroup is FormGroup {
		return typeof formGroup !== "undefined" && formGroup.hasOwnProperty("controls");
	}

	// type guard
	/**
	 * Check that the given form field object is an actual instance of an Angular form field.
	 * @param formControl - Angular form field object
	 */
	public static isFormControl(formControl: any): formControl is FormControl {
		return typeof formControl === "object" && typeof formControl["setValue"] !== "undefined";
	}
}
