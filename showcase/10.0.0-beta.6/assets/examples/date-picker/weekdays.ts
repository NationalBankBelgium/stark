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
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setMonth(this.maxDate.getMonth() + 6);
	}

	public onDateChanged(date: Date): void {
		this.logger.debug(date);
	}
}
