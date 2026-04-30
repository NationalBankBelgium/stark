import { Component, Inject } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

const HOUR_IN_MILLISECONDS = 3600000;
const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-time-picker",
	templateUrl: "./demo-date-time-picker.component.html",
	styleUrls: ["./demo-date-time-picker.component.scss"]
})
export class DemoDateTimePickerComponent {
	public dateTimeModel?: Date;
	public isDisabled = false;

	public dateMask = { format: "DD/MM/YYYY" };

	public minDate = new Date(Date.now() - HOUR_IN_MILLISECONDS); // minDate = one hour earlier
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public constructor(@Inject(STARK_LOGGING_SERVICE) private _logger: StarkLoggingService) {}

	public onDateTimeNgModelChanged(): void {
		this._logger.debug("ngModel: ", this.dateTimeModel);
	}

	public getErrorMessages(control?: AbstractControl): string[] {
		const errors: string[] = [];

		if (control && control.errors) {
			for (const key of Object.keys(control.errors)) {
				switch (key) {
					case "required":
						errors.push("This field is required");
						break;
					case "matDatepickerFilter":
						errors.push("Invalid date");
						break;
					case "matDatepickerMin":
						errors.push("Date cannot be before the minimum date allowed");
						break;
					case "matDatepickerMax":
						errors.push("Date cannot be after the maximum date allowed");
						break;
					case "starkMinDateTime":
						errors.push("Datetime cannot be before the minimum datetime allowed");
						break;
					case "starkMaxDateTime":
						errors.push("Datetime cannot be after the maximum datetime allowed");
						break;
					default:
						errors.push(key);
				}
			}
		}

		return errors;
	}

	public trackItemFn(item: string): string {
		return item;
	}
}
