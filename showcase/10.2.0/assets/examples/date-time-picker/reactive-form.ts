import { Component, Inject, OnDestroy } from "@angular/core";
import { AbstractControl, FormControl, Validators } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";
import { Subscription } from "rxjs";

const HOUR_IN_MILLISECONDS = 3600000;
const DAY_IN_MILLISECONDS = 86400000;

@Component({
	selector: "demo-date-time-picker",
	templateUrl: "./demo-date-time-picker.component.html",
	styleUrls: ["./demo-date-time-picker.component.scss"]
})
export class DemoDateTimePickerComponent implements OnDestroy {
	public formControl = new FormControl(new Date(), Validators.required);

	public dateMask = { format: "DD/MM/YYYY" };
	public timeMask: StarkTimestampMaskConfig = { format: "HH:mm" };

	public minDate = new Date(Date.now() - HOUR_IN_MILLISECONDS); // minDate = one hour earlier
	public maxDate = new Date(Date.now() + 30 * DAY_IN_MILLISECONDS);

	public subscription: Subscription;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private _logger: StarkLoggingService) {
		this.subscription = this.formControl.valueChanges.subscribe((value: any) => {
			this._logger.debug("formControl: ", value);
		});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
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
						errors.push("This field is required");
						break;
					case "matDatepickerFilter":
						errors.push("Invalid date");
						break;
					case "matDatepickerMin":
						errors.push("Date cannot be before the minimum date allowed");
						break;
					case "matDatepickerMax":
						errors.push("Date cannot be after the maximum date allowed");
						break;
					case "starkMinDateTime":
						errors.push("Datetime cannot be before the minimum datetime allowed");
						break;
					case "starkMaxDateTime":
						errors.push("Datetime cannot be after the maximum datetime allowed");
						break;
					default:
						errors.push(key);
				}
			}
		}

		return errors;
	}

	public trackItemFn(item: string): string {
		return item;
	}
}
