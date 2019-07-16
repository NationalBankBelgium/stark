import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { ParentErrorStateMatcher } from "./parent-error-state-matcher";
import { PasswordValidator } from "./password-validator";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import {ReferenceLink} from '../../../shared/components/reference-block';
@Component({
	selector: "showcase-reactive-forms-with-ngx-form-errors",
	templateUrl: "./demo-reactive-form-errors-page.component.html",
	styleUrls: ["./demo-reactive-form-errors-page.component.scss"]
})
export class DemoReactiveFormErrorsPageComponent implements OnInit {
	public collapsed: boolean[] = [false, false, true];

	public referenceList: ReferenceLink[] = [
		{
			label: "NGX Form errors library",
			url: "https://github.com/NationalBankBelgium/ngx-form-errors"
		}
	];

	public formGroup!: FormGroup;
	public parentErrorStateMatcher: ErrorStateMatcher = new ParentErrorStateMatcher();
	public passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$";
	public showValidationDetails = false;
	public showValidationSummary = true;
	public constructor(private formBuilder: FormBuilder, @Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.formGroup = this.formBuilder.group({
			username: [undefined, Validators.required],
			matchingPasswords: new FormGroup(
				{
					password: new FormControl(
						"",
						Validators.compose([
							Validators.minLength(3),
							Validators.maxLength(10),
							Validators.required,
							Validators.pattern(this.passwordPattern) // this is for the letters (both uppercase and lowercase) and numbers validation
						])
					),
					confirmPassword: new FormControl("", Validators.required)
				},
				{
					validators: (formGroup: AbstractControl): any => {
						return PasswordValidator.areEqual(<FormGroup>formGroup);
					}
				}
			)
		});
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

	public onSubmitUserDetails(formGroup: FormGroup): void {
		this.logger.info("Submitted form:");
		this.logger.info(formGroup.value);
	}
}
