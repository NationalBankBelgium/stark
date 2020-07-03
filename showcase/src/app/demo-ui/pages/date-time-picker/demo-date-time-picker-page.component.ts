import { Component, Inject, OnDestroy } from "@angular/core";
import { AbstractControl, FormControl, Validators } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";
import { Subscription } from "rxjs";
import { ReferenceLink } from "../../../shared/components/reference-block";

const HOUR_IN_MILLISECONDS = 3600000;
const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-time-picker",
	templateUrl: "./demo-date-time-picker-page.html",
	styleUrls: ["./demo-date-time-picker-page.component.scss"]
})
export class DemoDateTimePickerPageComponent implements OnDestroy {
	public dateTimeModel?: Date;
	public formControl = new FormControl(new Date(), Validators.required);
	public isDisabled = false;

	public dateMask = { format: "DD/MM/YYYY" };
	public timeMask: StarkTimestampMaskConfig = { format: "HH:mm" };

	public minDate = new Date(Date.now() - HOUR_IN_MILLISECONDS); // minDate = one hour earlier
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public subscription: Subscription;

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Date Time Picker component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDateTimePickerComponent.html"
		}
	];

	public constructor(@Inject(STARK_LOGGING_SERVICE) private _logger: StarkLoggingService) {
		this.subscription = this.formControl.valueChanges.subscribe((value: any) => {
			this._logger.debug("formControl: ", value);
		});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public onDateTimeChanged(date: Date): void {
		this._logger.debug("Date time changed:", date);
	}

	public onDateTimeNgModelChanged(): void {
		this._logger.debug("ngModel: ", this.dateTimeModel);
	}

	public toggleFormControlState(formControl: FormControl): void {
		// enable/disable the control without emitting a change event since the value did not change (to avoid unnecessary extra calls!)
		if (formControl.disabled) {
			formControl.enable({ emitEvent: false });
		} else {
			formControl.disable({ emitEvent: false });
		}
	}

	public getErrorMessages(control?: AbstractControl): string[] {
		const errors: string[] = [];

		if (control && control.errors) {
			for (const key of Object.keys(control.errors)) {
				switch (key) {
					case "required":
						errors.push("STARK.VALIDATION.REQUIRED");
						break;
					case "matDatepickerFilter":
						errors.push("SHOWCASE.DEMO.DATE_TIME_PICKER.ERROR_MESSAGES.INVALID_DATE");
						break;
					case "matDatepickerMin":
						errors.push("SHOWCASE.DEMO.DATE_TIME_PICKER.ERROR_MESSAGES.MIN_DATE");
						break;
					case "matDatepickerMax":
						errors.push("SHOWCASE.DEMO.DATE_TIME_PICKER.ERROR_MESSAGES.MAX_DATE");
						break;
					case "starkMinDateTime":
						errors.push("SHOWCASE.DEMO.DATE_TIME_PICKER.ERROR_MESSAGES.MIN_DATE_TIME");
						break;
					case "starkMaxDateTime":
						errors.push("SHOWCASE.DEMO.DATE_TIME_PICKER.ERROR_MESSAGES.MAX_DATE_TIME");
						break;
					default:
						errors.push(key);
				}
			}
		}

		return errors;
	}

	public trackItemFn(_index: number, item: string): string {
		return item;
	}
}
