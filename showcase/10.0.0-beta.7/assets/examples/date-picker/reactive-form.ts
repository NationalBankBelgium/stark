import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker.component.html"
})
export class DemoDatePickerComponent implements OnInit, OnDestroy {
	public formControl: FormControl;
	public minDate: Date;
	public maxDate: Date;

	private subscription: Subscription;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.formControl = new FormControl(new Date(), Validators.required);
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setMonth(this.maxDate.getMonth() + 6);

		this.subscription = this.formControl.valueChanges.subscribe((value?: Date) => {
			this.logger.debug(value);
		});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public toggleDisabledReactiveFormControl(formControl: FormControl): void {
		if (formControl.disabled) {
			formControl.enable();
		} else {
			formControl.disable();
		}
	}
}
