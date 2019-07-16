import { ErrorStateMatcher } from "@angular/material/typings/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";

/** Error when invalid control is dirty, touched, or submitted. */
export class ParentErrorStateMatcher implements ErrorStateMatcher {
	public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted: boolean = !!(form && form.submitted);
		const formGroupValid: boolean = !!(form && form.valid);

		return !!((control && control.invalid && (control.dirty || control.touched)) || isSubmitted || formGroupValid);
	}
}
