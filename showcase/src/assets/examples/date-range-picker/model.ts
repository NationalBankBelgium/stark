/* tslint:disable:no-null-keyword */
import { Component, Inject, OnDestroy } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractControl } from "@angular/forms";
import map from "lodash-es/map";

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

	public getErrorMessages: (control: AbstractControl) => string[] = () => [];

	private _activateGetErrorMessages(): void {
		this.getErrorMessages = (control: AbstractControl): string[] =>
			map(
				control.errors || {},
				(_value: any, key: string): string => {
					switch (key) {
						case "required":
							return "Date is required";
						case "matDatepickerMin":
							return "Date should be after today";
						case "matDatepickerMax":
							return "Date should be in less than 1 month";
						case "matDatepickerFilter":
							return "Date should be a weekday";
						case "startBeforeEnd":
							return "Start date should be before end date";
						case "endAfterStart":
							return "End date should be after start date";
						default:
							return "";
					}
				}
			);
	}

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		// FIXME: For some reason validation is run on the internal formControls before the value is set.
		//  this results in a ExpressionChangedAfterItHasBeenCheckedError on the usage of getErrorMessages.
		setTimeout(() => this._activateGetErrorMessages());
	}

	public onDateModelChange(): void {
		this.logger.debug("ngModel", this.dateRangeModel);
	}
}
