import { Component, OnInit, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../shared/reference-block";

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker.component.html"
})
export class DemoDatePickerComponent implements OnInit {
	public currentDate: Date;
	public minDate: Date;
	public maxDate: Date;
	public customDateFilter: StarkDatePickerFilter;
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.currentDate = new Date();
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setMonth(this.maxDate.getMonth() + 6);

		this.customDateFilter = (date: Date): boolean => {
			const day: number = date.getDay();
			return day === 3;
		};

		this.referenceList = [
			{
				label: "Stark Date Picker component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDatePickerComponent.html"
			}
		];
	}

	public onDateChanged(date: Date): void {
		this.logger.debug(date);
	}
}
