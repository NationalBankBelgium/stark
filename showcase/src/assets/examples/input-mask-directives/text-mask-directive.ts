import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTextMasks, StarkTextMaskConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-text-mask",
	styleUrls: ["./demo-text-mask.component.scss"],
	templateUrl: "./demo-text-mask.component.html"
})
export class DemoTextMaskComponent {
	public creditCardMaskConfig: StarkTextMaskConfig = {
		mask: StarkTextMasks.CREDITCARD_NUMBER
	};
	public structuredMessageMaskConfig: StarkTextMaskConfig = {
		mask: StarkTextMasks.STRUCTURED_COMMUNICATION_NUMBER
	};
	public phoneNumberMaskConfig: StarkTextMaskConfig = {
		mask: "(+32) 000/00 00 00",
		placeholderChar: "#"
	};

	public structuredMessage = "";
	public phoneNumberField = new FormControl();

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
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
