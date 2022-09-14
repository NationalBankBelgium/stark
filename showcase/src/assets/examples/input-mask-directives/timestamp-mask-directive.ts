import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { merge } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";
import * as moment from "moment";

@Component({
	selector: "demo-timestamp-mask",
	styleUrls: ["./demo-timestamp-mask.component.scss"],
	templateUrl: "./demo-timestamp-mask.component.html"
})
export class DemoTimestampMaskComponent {
	public dateMaskConfig: StarkTimestampMaskConfig = { format: "DD-MM-YYYY" };
	public timestampDMYMaskConfig: StarkTimestampMaskConfig = { format: "DD-MM-YYYY HH:mm:ss" };
	public timestampMDYMaskConfig: StarkTimestampMaskConfig = { format: "MM-DD-YYYY HH:mm:ss" };
	public dayMonthMaskConfig: StarkTimestampMaskConfig = { format: "DD-MM" };
	public monthDayMaskConfig: StarkTimestampMaskConfig = { format: "MM/DD" };
	public timeMaskConfig: StarkTimestampMaskConfig = { format: "HH:mm:ss" };

	public dateWeekendMaskConfig: StarkTimestampMaskConfig = { format: this.dateMaskConfig.format, filter: "OnlyWeekends" };

	public dateWeekdaysMaskConfig: StarkTimestampMaskConfig = { format: this.dateMaskConfig.format, filter: "OnlyWeekdays" };

	public minDate: moment.Moment;
	public maxDate: moment.Moment;

	public minDateSameYear: moment.Moment;
	public maxDateSameYear: moment.Moment;

	public minDateSameMonth: moment.Moment;
	public maxDateSameMonth: moment.Moment;

	public timestamp = "";
	public monthDay = "";
	public fullDateField = new FormControl();
	public timeField = new FormControl();

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		merge(this.fullDateField.valueChanges, this.timeField.valueChanges).subscribe((changedValue: string) =>
			this.logger.debug("formControl value changed: ", changedValue)
		);

		this.minDate = moment().startOf("year");
		this.minDate.set("year", 1900);
		this.maxDate = moment().endOf("year");
		this.maxDate.set("year", 2100);

		this.minDateSameYear = moment().startOf("quarter");
		this.maxDateSameYear = moment().endOf("quarter");

		this.minDateSameMonth = moment().startOf("month");
		this.maxDateSameMonth = moment().endOf("month");

		if (moment().get("date") > 15) {
			this.minDateSameMonth.set("date", 15);
		} else {
			this.maxDateSameMonth.set("date", 15);
		}
	}

	public logChange(event: Event): void {
		this.logger.debug("input value changed", (<HTMLInputElement>event.srcElement).value);
	}

	public logModelChange(model: any): void {
		this.logger.debug("model value changed", model);
	}
}
