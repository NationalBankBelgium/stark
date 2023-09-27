/* eslint-disable no-null/no-null */
import { Component, Inject, OnDestroy } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDateRangePickerEvent } from "@nationalbankbelgium/stark-ui";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Subscription } from "rxjs";
import { ReferenceLink } from "../../../shared/components";

const MONTH_IN_MILLI = 2592000000;

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker-page.component.html"
})
export class DemoDateRangePickerPageComponent implements OnDestroy {
	public static noFebruaryValidator(control: AbstractControl): ValidationErrors | null {
		const { value } = control;
		return value instanceof Date && value.getMonth() === 1 ? { inFebruary: true } : null; // date counts months from 0
	}

	public today = new Date();
	public inOneMonth = new Date(this.today.getTime() + MONTH_IN_MILLI);

	public dateRangeModel = { startDate: this.today, endDate: this.inOneMonth };
	public modelDisabled = false;

	// IMPORTANT: if the DateRangePicker should be required, then add the 'required' validator to both form controls too!
	public dateRangeFormGroup = new FormGroup({
		startDate: new FormControl(
			undefined,
			Validators.compose([Validators.required, DemoDateRangePickerPageComponent.noFebruaryValidator])
		),
		endDate: new FormControl(undefined, Validators.compose([Validators.required, DemoDateRangePickerPageComponent.noFebruaryValidator]))
	});

	/**
	 * List of subscriptions to be unsubscribed when component is destroyed
	 */
	private _subs: Subscription[] = [];

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Date Range Picker component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDateRangePickerComponent.html"
		}
	];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		this._subs.push(this.dateRangeFormGroup.valueChanges.subscribe((value: any) => this.logger.debug("formGroup:", value)));
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
						errors.push("SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.REQUIRED");
						break;
					case "matDatepickerMin":
						errors.push("SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.MIN_TODAY");
						break;
					case "matDatepickerMax":
						errors.push("SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.MAX_MONTH");
						break;
					case "matDatepickerFilter":
						errors.push("SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.WEEKDAY");
						break;
					case "startBeforeEnd":
						errors.push("SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.START_BEFORE_END");
						break;
					case "endAfterStart":
						errors.push("SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.END_AFTER_START");
						break;
					case "inFebruary":
						errors.push("SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.IN_FEBRUARY");
						break;
					default:
						errors.push(key);
				}
			}
		}

		return errors;
	}

	public onDateModelChange(): void {
		this.logger.debug("ngModel", this.dateRangeModel);
	}

	public onDateRangeFormGroupDisableCheckboxChange(event: MatCheckboxChange): void {
		// enable/disable the control without emitting a change event since the value did not change (to avoid unnecessary extra calls!)
		if (event.checked) {
			this.dateRangeFormGroup.disable({ emitEvent: false });
		} else {
			this.dateRangeFormGroup.enable({ emitEvent: false });
		}
	}

	public onDateChange(dateRange: StarkDateRangePickerEvent): void {
		this.logger.debug("onChange:", dateRange);
	}

	public trackItemFn(_index: number, item: string): string {
		return item;
	}
}
