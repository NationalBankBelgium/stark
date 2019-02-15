import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkNumberMaskConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-number-mask",
	styleUrls: ["./demo-number-mask.component.scss"],
	templateUrl: "./demo-number-mask.component.html"
})
export class DemoNumberMaskComponent implements OnInit {
	public dollarsMaskConfig: StarkNumberMaskConfig;
	public eurosMaskConfig: StarkNumberMaskConfig;
	public percentageMaskConfig: StarkNumberMaskConfig;

	public dollarsAmount: string;
	public percentageField: FormControl;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		this.percentageField = new FormControl();

		this.eurosMaskConfig = {
			prefix: "",
			suffix: " €",
			includeThousandsSeparator: true,
			thousandsSeparatorSymbol: ",",
			allowDecimal: true,
			decimalSymbol: ".",
			decimalLimit: 2,
			integerLimit: 9,
			allowNegative: false,
			allowLeadingZeroes: false
		};

		this.dollarsMaskConfig = {
			prefix: "$ ",
			suffix: "",
			includeThousandsSeparator: true,
			thousandsSeparatorSymbol: ",",
			allowDecimal: true,
			decimalSymbol: ".",
			decimalLimit: 2,
			integerLimit: 9,
			allowNegative: false,
			allowLeadingZeroes: false
		};

		this.percentageMaskConfig = {
			prefix: "% ",
			suffix: "",
			includeThousandsSeparator: true,
			thousandsSeparatorSymbol: ",",
			allowDecimal: true,
			decimalSymbol: ".",
			decimalLimit: 3,
			integerLimit: 3,
			allowNegative: true,
			allowLeadingZeroes: true
		};
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.percentageField.valueChanges.subscribe((changedValue: string) =>
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
