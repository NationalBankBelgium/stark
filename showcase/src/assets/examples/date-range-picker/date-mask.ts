import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDateRangePickerEvent } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-date-range-picker",
	templateUrl: "./demo-date-range-picker.component.html"
})
export class DemoDateRangePickerComponent {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public onDateChange(dateRange: StarkDateRangePickerEvent): void {
		this.logger.debug("onChange:", dateRange);
	}
}
