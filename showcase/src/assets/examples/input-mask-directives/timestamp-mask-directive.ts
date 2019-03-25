import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { merge } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";

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

	public timestamp = "";
	public monthDay = "";
	public fullDateField = new FormControl();
	public timeField = new FormControl();

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		merge(this.fullDateField.valueChanges, this.timeField.valueChanges).subscribe((changedValue: string) =>
			this.logger.debug("formControl value changed: ", changedValue)
		);
	}

	public logChange(event: Event): void {
		this.logger.debug("input value changed", (<HTMLInputElement>event.srcElement).value);
	}

	public logModelChange(model: any): void {
		this.logger.debug("model value changed", model);
	}
}
