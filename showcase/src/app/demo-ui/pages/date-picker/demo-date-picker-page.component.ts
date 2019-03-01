import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDatePickerFilter, StarkTimestampMaskConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
	selector: "demo-date-picker",
	templateUrl: "./demo-date-picker-page.component.html"
})
export class DemoDatePickerPageComponent implements OnInit {
	public currentDate: Date;
	public ngModelDate: Date;
	public disabled: boolean;
	public formControl: FormControl;
	public minDate: Date;
	public maxDate: Date;
	public customDateFilter: StarkDatePickerFilter;
	public referenceList: ReferenceLink[];
	public maskConfig: StarkTimestampMaskConfig;

	public required: boolean;

	public subscription: Subscription;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.currentDate = new Date();
		this.ngModelDate = new Date();
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setMonth(this.maxDate.getMonth() + 6);
		this.formControl = new FormControl(new Date(), Validators.required);
		this.maskConfig = { format: "DD-MM-YYYY" };

		this.subscription = this.formControl.valueChanges.subscribe((date: Date) => {
			this.onDateChanged(date);
		});

		this.customDateFilter = (date: Date): boolean => {
			const day: number = date.getDay();
			return day === 3;
		};

		this.referenceList = [
			{
				label: "Stark Date Picker component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkDatePickerComponent.html"
			}
		];
	}

	public onDateChanged(date: Date): void {
		this.logger.debug(date);
	}

	public onDateNgModelChanged(): void {
		this.logger.debug("ngModel: ", this.ngModelDate);
	}

	public toggleDisabledReactiveFormControl(formControl: FormControl): void {
		if (formControl.disabled) {
			formControl.enable();
		} else {
			formControl.disable();
		}
	}

	public changeMax(): void {
		this.maxDate = new Date(2017, 1, 2);
	}
}
