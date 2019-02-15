import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";
import { merge } from "rxjs";

@Component({
	selector: "demo-timestamp-mask",
	styleUrls: ["./demo-timestamp-mask.component.scss"],
	templateUrl: "./demo-timestamp-mask.component.html"
})
export class DemoTimestampMaskComponent implements OnInit {
	public dateMaskConfig: StarkTimestampMaskConfig;
	public timestampDMYMaskConfig: StarkTimestampMaskConfig;
	public dayMonthMaskConfig: StarkTimestampMaskConfig;
	public monthDayMaskConfig: StarkTimestampMaskConfig;
	public timestampMDYMaskConfig: StarkTimestampMaskConfig;
	public timeMaskConfig: StarkTimestampMaskConfig;

	public timestamp: string;
	public monthDay: string;
	public fullDateField: FormControl;
	public timeField: FormControl;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		this.fullDateField = new FormControl();
		this.timeField = new FormControl();

		this.timestampDMYMaskConfig = { format: "DD-MM-YYYY HH:mm:ss" };

		this.timestampMDYMaskConfig = { format: "MM-DD-YYYY HH:mm:ss" };

		this.dateMaskConfig = { format: "DD-MM-YYYY" };

		this.dayMonthMaskConfig = { format: "DD-MM" };

		this.monthDayMaskConfig = { format: "MM/DD" };

		this.timeMaskConfig = { format: "HH:mm:ss" };
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
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
