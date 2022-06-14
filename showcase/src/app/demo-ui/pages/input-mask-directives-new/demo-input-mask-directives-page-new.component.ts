import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { merge } from "rxjs";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTextMaskConfigNew, StarkTextMasksNew, StarkTimestampMaskConfigNew } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components/reference-block";
import { StarkNumberMaskConfigNew } from "@nationalbankbelgium/stark-ui/src/modules/input-mask-directives-new/directives/number-mask-config-new.intf";
import * as moment from "moment";

@Component({
	selector: "showcase-demo-mask-directives-new",
	styleUrls: ["./demo-input-mask-directives-page-new.component.scss"],
	templateUrl: "./demo-input-mask-directives-page-new.component.html"
})
export class DemoInputMaskDirectivesPageNewComponent {
	public creditCardMaskConfig: StarkTextMaskConfigNew = {
		mask: StarkTextMasksNew.CREDITCARD_NUMBER,
		placeholderChar: "#"
	};

	public structuredMessageMaskConfig: StarkTextMaskConfigNew = {
		mask: StarkTextMasksNew.STRUCTURED_COMMUNICATION_NUMBER
	};

	public phoneNumberMaskConfig: StarkTextMaskConfigNew = {
		mask: "(+32) 000/00 00 00",
		placeholderChar: "#"
	};

	public timestampDMYMaskConfig: StarkTimestampMaskConfigNew = { format: "DD-MM-YYYY HH:mm:ss" };

	public timestampMDYMaskConfig: StarkTimestampMaskConfigNew = { format: "MM-DD-YYYY HH:mm:ss" };

	public dateMaskConfig: StarkTimestampMaskConfigNew = { format: "DD-MM-YYYY" };

	public dayMonthMaskConfig: StarkTimestampMaskConfigNew = { format: "DD-MM" };

	public monthDayMaskConfig: StarkTimestampMaskConfigNew = { format: "MM/DD" };

	public timeMaskConfig: StarkTimestampMaskConfigNew = { format: "HH:mm:ss" };

	public dateWeekendMaskConfig: StarkTimestampMaskConfigNew = { format: this.dateMaskConfig.format, filter: "OnlyWeekends" };

	public dateWeekdaysMaskConfig: StarkTimestampMaskConfigNew = { format: this.dateMaskConfig.format, filter: "OnlyWeekdays" };

	public eurosMaskConfig: StarkNumberMaskConfigNew = {
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

	public dollarsMaskConfig: StarkNumberMaskConfigNew = {
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

	public percentageMaskConfig: StarkNumberMaskConfigNew = {
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

	public minMaxField = new FormControl();
	public minMaxSameYearField = new FormControl();
	public minMaxSameMonthField = new FormControl();

	public weekendField = new FormControl();
	public weekdaysField = new FormControl();

	public minDate: moment.Moment;
	public maxDate: moment.Moment;

	public minDateSameYear: moment.Moment;
	public maxDateSameYear: moment.Moment;

	public minDateSameMonth: moment.Moment;
	public maxDateSameMonth: moment.Moment;

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

		this.minDate = moment().startOf("year");
		this.minDate.set("year", 1900);
		this.maxDate = moment().endOf("year");
		this.maxDate.set("year", 2100);

		this.minDateSameYear = moment().startOf("quarter");
		this.maxDateSameYear = moment().endOf("quarter");

		this.minDateSameMonth = moment().startOf("month");
		this.maxDateSameMonth = moment().endOf("month");

		if (moment().get("date") > 15) {
			this.minDateSameMonth.set("date", 15);
		} else {
			this.maxDateSameMonth.set("date", 15);
		}

		console.log(this.minDateSameMonth, this.maxDateSameMonth);
	}

	public logChange(event: Event): void {
		this.logger.debug("input value changed", (<HTMLInputElement>event.target).value);
	}

	public logModelChange(model: any): void {
		this.logger.debug("model value changed", model);
	}
}
