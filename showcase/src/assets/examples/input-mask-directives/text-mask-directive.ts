import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTextMasks, StarkTextMaskConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-text-mask",
	styleUrls: ["./demo-text-mask.component.scss"],
	templateUrl: "./demo-text-mask.component.html"
})
export class DemoTextMaskComponent implements OnInit {
	public creditCardMaskConfig: StarkTextMaskConfig;
	public structuredMessageMaskConfig: StarkTextMaskConfig;
	public phoneNumberMaskConfig: StarkTextMaskConfig;
	public structuredMessage: string;
	public phoneNumberField: FormControl;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		this.phoneNumberField = new FormControl();

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
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.phoneNumberField.valueChanges.subscribe((changedValue: string) =>
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
