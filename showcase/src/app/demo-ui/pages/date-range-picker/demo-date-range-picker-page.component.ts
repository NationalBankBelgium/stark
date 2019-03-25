import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter, StarkDateRangePickerEvent, StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker-page.component.html"
})
export class DemoDateRangePickerPageComponent {
	public startDate?: Date;
	public endDate?: Date;

	public minDate = new Date();
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public customDateFilter: StarkDatePickerFilter = (date: Date): boolean => date.getDay() !== 0;

	public customDateMask: StarkTimestampMaskConfig = {
		format: "DD-MM-YYYY"
	};

	public disabled = false;
	public isDisabledDateMask = false;
	public isDisabledCustomDateMask = false;

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Date Range Picker component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDateRangePickerComponent.html"
		}
	];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public onDateChanged(event: StarkDateRangePickerEvent): void {
		this.logger.debug(event);

		this.startDate = event.startDate;
		this.endDate = event.endDate;
	}
}
