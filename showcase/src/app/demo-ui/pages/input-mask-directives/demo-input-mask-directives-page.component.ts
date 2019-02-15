import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTextMasks, StarkTextMaskConfig, StarkTimestampMaskConfig, StarkNumberMaskConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components/reference-block";
import { merge } from "rxjs";

@Component({
	selector: "showcase-demo-mask-directives",
	styleUrls: ["./demo-input-mask-directives-page.component.scss"],
	templateUrl: "./demo-input-mask-directives-page.component.html"
})
export class DemoInputMaskDirectivesPageComponent implements OnInit {
	public creditCardMaskConfig: StarkTextMaskConfig;
	public structuredMessageMaskConfig: StarkTextMaskConfig;
	public phoneNumberMaskConfig: StarkTextMaskConfig;
	public dateMaskConfig: StarkTimestampMaskConfig;
	public dollarsMaskConfig: StarkNumberMaskConfig;
	public eurosMaskConfig: StarkNumberMaskConfig;
	public percentageMaskConfig: StarkNumberMaskConfig;
	public timestampDMYMaskConfig: StarkTimestampMaskConfig;
	public dayMonthMaskConfig: StarkTimestampMaskConfig;
	public monthDayMaskConfig: StarkTimestampMaskConfig;
	public timestampMDYMaskConfig: StarkTimestampMaskConfig;
	public timeMaskConfig: StarkTimestampMaskConfig;

	public structuredMessage: string;
	public dollarsAmount: string;
	public email: string;
	public timestamp: string;
	public monthDay: string;
	public phoneNumberField: FormControl;
	public percentageField: FormControl;
	public fullDateField: FormControl;
	public timeField: FormControl;
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		this.phoneNumberField = new FormControl();
		this.fullDateField = new FormControl();
		this.timeField = new FormControl();
		this.percentageField = new FormControl();

		this.creditCardMaskConfig = {
			mask: StarkTextMasks.CREDITCARD_NUMBER
		};

		this.structuredMessageMaskConfig = {
			mask: StarkTextMasks.STRUCTURED_COMMUNICATION_NUMBER
		};

		this.phoneNumberMaskConfig = {
			mask: ["(", "+", "3", "2", ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/],
			placeholderChar: "#"
		};

		this.timestampDMYMaskConfig = { format: "DD-MM-YYYY HH:mm:ss" };

		this.timestampMDYMaskConfig = { format: "MM-DD-YYYY HH:mm:ss" };

		this.dateMaskConfig = { format: "DD-MM-YYYY" };

		this.dayMonthMaskConfig = { format: "DD-MM" };

		this.monthDayMaskConfig = { format: "MM/DD" };

		this.timeMaskConfig = { format: "HH:mm:ss" };

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

		this.referenceList = [
			{
				label: "Stark Email Mask directive",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkEmailMaskDirective.html"
			},
			{
				label: "Stark Number Mask directive",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkNumberMaskDirective.html"
			},
			{
				label: "Stark Text Mask directive",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkTextMaskDirective.html"
			},
			{
				label: "Stark Timestamp Mask directive",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkTimestampMaskDirective.html"
			}
		];
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		merge(
			this.phoneNumberField.valueChanges,
			this.fullDateField.valueChanges,
			this.timeField.valueChanges,
			this.percentageField.valueChanges
		).subscribe((changedValue: string) => this.logger.debug("formControl value changed: ", changedValue));

		this.logger.debug("DemoInputMaskDirectivesComponent - initialized");
	}

	public logChange(event: Event): void {
		this.logger.debug("input value changed", (<HTMLInputElement>event.srcElement).value);
	}

	public logModelChange(model: any): void {
		this.logger.debug("model value changed", model);
	}
}
