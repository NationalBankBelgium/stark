import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter, StarkDateRangePickerEvent } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker-page.component.html"
})
export class DemoDateRangePickerPageComponent implements OnInit {
	public isDisabled: boolean;
	public startDate?: Date;
	public endDate?: Date;
	public minDate: Date;
	public maxDate: Date;
	public customDateFilter: StarkDatePickerFilter;
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.startDate = new Date();
		this.endDate = new Date();
		this.endDate.setMonth(this.endDate.getMonth() + 1);
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setMonth(this.maxDate.getMonth() + 6);

		this.customDateFilter = (date: Date): boolean => {
			const day: number = date.getDay();
			return day !== 0;
		};

		this.referenceList = [
			{
				label: "Stark Date Range Picker component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDateRangePickerComponent.html"
			}
		];
	}

	public onDateChanged(event: StarkDateRangePickerEvent): void {
		this.logger.debug(event);

		this.startDate = event.startDate;
		this.endDate = event.endDate;
	}
}
