import { Component, Inject, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter, StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";

const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker.component.html"
})
export class DemoDatePickerComponent implements OnDestroy {
	public minDate = new Date();
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public formControl = new FormControl(new Date(), Validators.required);

	public customDateFilter: StarkDatePickerFilter = (date: Date): boolean => date.getDay() === 3;
	public maskConfig: StarkTimestampMaskConfig = { format: "DD-MM-YYYY" };

	public subscription = this.formControl.valueChanges.subscribe(this.onDateChanged.bind(this));

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public onDateChanged(date: Date): void {
		this.logger.debug(date);
	}

	public toggleFormControlState(formControl: FormControl): void {
		if (formControl.disabled) {
			formControl.enable();
		} else {
			formControl.disable();
		}
	}
}
