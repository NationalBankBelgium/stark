/* tslint:disable:no-null-keyword */
import { Component, Inject, OnDestroy } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractControl } from "@angular/forms";

const MONTH_IN_MILLI = 2592000000;

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker.component.html"
})
export class DemoDateRangePickerComponent implements OnDestroy {
	public today = new Date();
	public inOneMonth = new Date(this.today.getTime() + MONTH_IN_MILLI);

	public dateRangeModel = { startDate: this.today, endDate: this.inOneMonth };
	public modelDisabled = false;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

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
					default:
						errors.push(key);
						break;
				}
			}
		}

		return errors;
	}

	public onDateModelChange(): void {
		this.logger.debug("ngModel", this.dateRangeModel);
	}

	public trackItemFn(item: string): string {
		return item;
	}
}
