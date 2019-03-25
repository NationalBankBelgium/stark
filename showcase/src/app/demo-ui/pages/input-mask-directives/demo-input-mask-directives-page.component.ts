import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { merge } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTextMasks, StarkTextMaskConfig, StarkTimestampMaskConfig, StarkNumberMaskConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components/reference-block";

@Component({
	selector: "showcase-demo-mask-directives",
	styleUrls: ["./demo-input-mask-directives-page.component.scss"],
	templateUrl: "./demo-input-mask-directives-page.component.html"
})
export class DemoInputMaskDirectivesPageComponent {
	public creditCardMaskConfig: StarkTextMaskConfig = {
		mask: StarkTextMasks.CREDITCARD_NUMBER
	};

	public structuredMessageMaskConfig: StarkTextMaskConfig = {
		mask: StarkTextMasks.STRUCTURED_COMMUNICATION_NUMBER
	};

	public phoneNumberMaskConfig: StarkTextMaskConfig = {
		mask: ["(", "+", "3", "2", ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/],
		placeholderChar: "#"
	};

	public timestampDMYMaskConfig: StarkTimestampMaskConfig = { format: "DD-MM-YYYY HH:mm:ss" };

	public timestampMDYMaskConfig: StarkTimestampMaskConfig = { format: "MM-DD-YYYY HH:mm:ss" };

	public dateMaskConfig: StarkTimestampMaskConfig = { format: "DD-MM-YYYY" };

	public dayMonthMaskConfig: StarkTimestampMaskConfig = { format: "DD-MM" };

	public monthDayMaskConfig: StarkTimestampMaskConfig = { format: "MM/DD" };

	public timeMaskConfig: StarkTimestampMaskConfig = { format: "HH:mm:ss" };

	public eurosMaskConfig: StarkNumberMaskConfig = {
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

	public dollarsMaskConfig: StarkNumberMaskConfig = {
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

	public percentageMaskConfig: StarkNumberMaskConfig = {
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

	public structuredMessage = "";
	public dollarsAmount = "";
	public email = "";
	public timestamp = "";
	public monthDay = "";

	public phoneNumberField = new FormControl();
	public fullDateField = new FormControl();
	public timeField = new FormControl();
	public percentageField = new FormControl();

	public referenceList: ReferenceLink[] = [
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

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		merge(
			this.phoneNumberField.valueChanges,
			this.fullDateField.valueChanges,
			this.timeField.valueChanges,
			this.percentageField.valueChanges
		).subscribe((changedValue: string) => this.logger.debug("formControl value changed: ", changedValue));
	}

	public logChange(event: Event): void {
		this.logger.debug("input value changed", (<HTMLInputElement>event.srcElement).value);
	}

	public logModelChange(model: any): void {
		this.logger.debug("model value changed", model);
	}
}
