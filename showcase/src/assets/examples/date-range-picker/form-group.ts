/* tslint:disable:no-null-keyword */
import { Component, Inject, OnDestroy } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Subscription } from "rxjs";

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker.component.html"
})
export class DemoDateRangePickerComponent implements OnDestroy {
	public static noFebruaryValidator(control: AbstractControl): ValidationErrors | null {
		const { value } = control;
		return value instanceof Date && value.getMonth() === 1 ? { inFebruary: true } : null; // date counts months from 0
	}

	// IMPORTANT: if the DateRangePicker should be required, then add the 'required' validator to both form controls too!
	public dateRangeFormGroup = new FormGroup({
		startDate: new FormControl(undefined, Validators.compose([Validators.required, DemoDateRangePickerComponent.noFebruaryValidator])),
		endDate: new FormControl(undefined, Validators.compose([Validators.required, DemoDateRangePickerComponent.noFebruaryValidator]))
	});

	/**
	 * List of subscriptions to be unsubscribed when component is destroyed
	 */
	private _subs: Subscription[] = [];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		this._subs.push(this.dateRangeFormGroup.valueChanges.subscribe((v: any) => this.logger.debug("formGroup:", v)));
	}

	public ngOnDestroy(): void {
		for (const subscription of this._subs) {
			subscription.unsubscribe();
		}
	}

	public getErrorMessages(control?: AbstractControl): string[] {
		const errors: string[] = [];

		if (control && control.errors) {
			for (const key of Object.keys(control.errors)) {
				switch (key) {
					case "required":
						errors.push("Date is required");
						break;
					case "matDatepickerMin":
						errors.push("Date should be after today");
						break;
					case "matDatepickerMax":
						errors.push("Date should be in less than 1 month");
						break;
					case "matDatepickerFilter":
						errors.push("Date should be a weekday");
						break;
					case "startBeforeEnd":
						errors.push("Start date should be before end date");
						break;
					case "endAfterStart":
						errors.push("End date should be after start date");
						break;
					case "inFebruary":
						errors.push("Date should not be in February");
						break;
					default:
						errors.push(key);
						break;
				}
			}
		}

		return errors;
	}

	public onDateRangeFormGroupDisableCheckboxChange(event: MatCheckboxChange): void {
		// enable/disable the control without emitting a change event since the value did not change (to avoid unnecessary extra calls!)
		if (event.checked) {
			this.dateRangeFormGroup.disable({ emitEvent: false });
		} else {
			this.dateRangeFormGroup.enable({ emitEvent: false });
		}
	}

	public trackItemFn(item: string): string {
		return item;
	}
}
