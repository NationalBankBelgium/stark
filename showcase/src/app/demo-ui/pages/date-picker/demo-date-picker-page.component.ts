import { Component, Inject, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter, StarkTimestampMaskConfigNew } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker-page.component.html"
})
export class DemoDatePickerPageComponent implements OnDestroy {
	public currentDate = new Date();
	public minDate = new Date();
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public ngModelDate = new Date();
	public formControl = new FormControl(new Date(), Validators.required);

	public disabled = false;
	public required = false;

	public customDateFilter: StarkDatePickerFilter = (date: Date): boolean => date.getDay() === 3;
	public maskConfig: StarkTimestampMaskConfigNew = { format: "DD-MM-YYYY" };

	public subscription = this.formControl.valueChanges.subscribe(this.onDateChanged.bind(this));

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Date Picker component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDatePickerComponent.html"
		}
	];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public onDateChanged(date?: Date): void {
		this.logger.debug("Date changed: ", date);
	}

	public onDateNgModelChanged(): void {
		this.logger.debug("ngModel: ", this.ngModelDate);
	}

	public toggleFormControlState(formControl: FormControl): void {
		// enable/disable the control without emitting a change event since the value did not change (to avoid unnecessary extra calls!)
		if (formControl.disabled) {
			formControl.enable({ emitEvent: false });
		} else {
			formControl.disable({ emitEvent: false });
		}
	}
}
