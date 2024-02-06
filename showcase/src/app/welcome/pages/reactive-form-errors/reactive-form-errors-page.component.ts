import { Component, Inject } from "@angular/core";
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { getConfirmPasswordValidator } from "./password-validator";
import { ReferenceLink } from "../../../shared/components/reference-block";

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: "reactive-forms",
	templateUrl: "./reactive-form-errors-page.component.html",
	styleUrls: ["./reactive-form-errors-page.component.scss"]
})
export class ReactiveFormErrorsPageComponent {
	public collapsed: boolean[] = [false, false, true];

	public referenceList: ReferenceLink[] = [
		{
			label: "NGX Form errors library",
			url: "https://github.com/NationalBankBelgium/ngx-form-errors"
		}
	];

	public formGroup: UntypedFormGroup;
	public passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$";
	public showValidationDetails = false;
	public showValidationSummary = true;

	public constructor(
		private formBuilder: UntypedFormBuilder,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService
	) {
		this.formGroup = this.formBuilder.group({
			username: [undefined, Validators.required],
			matchingPasswords: this.formBuilder.group({
				password: [
					"",
					Validators.compose([
						Validators.minLength(3),
						Validators.maxLength(10),
						Validators.required,
						// this is for the letters (both uppercase and lowercase) and numbers validation
						Validators.pattern(this.passwordPattern)
					])
				],
				confirmPassword: [""] // validators for this field to be set afterwards (see below)
			})
		});

		// setting the validator for confirmPassword field once we have created the form group
		const confirmPasswordControl = <AbstractControl>this.formGroup.get("matchingPasswords.confirmPassword");
		// we need to set the confirmPasswordValidator passing the "matchingPasswords" form group so that the errors of the form group are actually
		// linked to the "confirmPassword" control because the NgxFormErrors directive is linked to the control and not to the form group!
		confirmPasswordControl.setValidators([
			Validators.required,
			getConfirmPasswordValidator(<UntypedFormGroup>this.formGroup.get("matchingPasswords"))
		]);
	}

	public getErrorClass(formControlName: string): string {
		const formCtrl = <AbstractControl>this.formGroup.get(formControlName);
		return formCtrl.errors && Object.keys(formCtrl.errors).length > 1 ? "maximum-height" : "small-height";
	}

	public toggleCollapsible(nb: number): void {
		this.collapsed[nb] = !this.collapsed[nb];
	}
	public toggleValidationDetails(): void {
		this.showValidationDetails = !this.showValidationDetails;
	}

	public toggleValidationSummary(): void {
		this.showValidationSummary = !this.showValidationSummary;
	}

	public onSubmitUserDetails(formGroup: UntypedFormGroup): void {
		this.logger.info("Submitted form:", formGroup.value);
	}
}
