import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker.component.html"
})
export class DemoDatePickerComponent implements OnInit {
	public currentDate: Date;
	public minDate: Date;
	public maxDate: Date;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.currentDate = new Date();
		this.minDate = new Date("07-01-2017");
		this.maxDate = new Date("07-20-2017");
	}

	public onDateChanged(date: Date): void {
		this.logger.debug(date);
	}
}
