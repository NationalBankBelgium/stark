import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter, StarkDateRangePickerEvent } from "@nationalbankbelgium/stark-ui";

const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker.component.html"
})
export class DemoDateRangePickerComponent {
	public startDate?: Date;
	public endDate?: Date;

	public minDate = new Date();
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public customDateFilter: StarkDatePickerFilter = (date: Date): boolean => date.getDay() !== 0;

	public disabled = false;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public onDateChanged(event: StarkDateRangePickerEvent): void {
		this.logger.debug(event);

		this.startDate = event.startDate;
		this.endDate = event.endDate;
	}
}
