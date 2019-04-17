/* tslint:disable:no-null-keyword trackBy-function */
import { Component, Inject, OnDestroy } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Subscription } from "rxjs";
import { ReferenceLink } from "../../../shared/components";
import { StarkDateRangePickerEvent } from "@nationalbankbelgium/stark-ui";
import map from "lodash-es/map";

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

	public dateRangeFormGroup = new FormGroup({
		startDate: new FormControl(null, Validators.compose([DemoDateRangePickerPageComponent.noFebruaryValidator])),
		endDate: new FormControl(null, Validators.compose([DemoDateRangePickerPageComponent.noFebruaryValidator]))
	});

	public getErrorMessages: (control: AbstractControl) => string[] = () => [];

	private _activateGetErrorMessages(): void {
		this.getErrorMessages = (control: AbstractControl): string[] =>
			map(
				control.errors || {},
				(_value: any, key: string): string => {
					switch (key) {
						case "required":
							return "SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.REQUIRED";
						case "matDatepickerMin":
							return "SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.MIN_TODAY";
						case "matDatepickerMax":
							return "SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.MAX_MONTH";
						case "matDatepickerFilter":
							return "SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.WEEKDAY";
						case "startBeforeEnd":
							return "SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.START_BEFORE_END";
						case "endAfterStart":
							return "SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.END_AFTER_START";
						case "inFebruary":
							return "SHOWCASE.DEMO.DATE_RANGE_PICKER.ERROR_MESSAGES.IN_FEBRUARY";
						default:
							return "";
					}
				}
			);
	}
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
		this._subs.push(this.dateRangeFormGroup.valueChanges.subscribe((v: any) => this.logger.debug("formGroup:", v)));

		// FIXME: For some reason validation is run on the internal formControls before the value is set.
		//  this results in a ExpressionChangedAfterItHasBeenCheckedError on the usage of getErrorMessages.
		setTimeout(() => this._activateGetErrorMessages());
	}

	public onDateModelChange(): void {
		this.logger.debug("ngModel", this.dateRangeModel);
	}

	public onDateRangeFormGroupDisableCheckboxChange(event: MatCheckboxChange): void {
		if (event.checked) {
			this.dateRangeFormGroup.disable();
		} else {
			this.dateRangeFormGroup.enable();
		}
	}

	public onDateChange(dateRange: StarkDateRangePickerEvent): void {
		this.logger.debug("onChange:", dateRange);
	}

	public ngOnDestroy(): void {
		for (const subscription of this._subs) {
			subscription.unsubscribe()
		}
	}
}
