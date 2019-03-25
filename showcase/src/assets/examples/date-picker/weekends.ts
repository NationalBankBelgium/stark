import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker.component.html"
})
export class DemoDatePickerComponent implements OnInit {
	public currentDate = new Date();
	public minDate = new Date();
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public onDateChanged(date: Date): void {
		this.logger.debug(date);
	}
}
