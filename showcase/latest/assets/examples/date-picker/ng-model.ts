import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { Subscription } from "rxjs";
import { StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker.component.html"
})
export class DemoDatePickerComponent implements OnInit, OnDestroy {
	public date?: Date;
	public minDate: Date;
	public maxDate: Date;
	public disabled: boolean;
	public maskConfig: StarkTimestampMaskConfig = { format: "DD-MM-YYYY" };

	private subscription: Subscription;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setMonth(this.maxDate.getMonth() + 6);
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public onDateChanged(): void {
		this.logger.debug("ngModel: ", this.date);
	}
}
