import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";

const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker.component.html"
})
export class DemoDatePickerComponent {
	public minDate = new Date();
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public date: Date = new Date();
	public disabled = false;

	public maskConfig: StarkTimestampMaskConfig = { format: "DD-MM-YYYY" };

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public onDateChanged(): void {
		this.logger.debug("ngModel: ", this.date);
	}
}
