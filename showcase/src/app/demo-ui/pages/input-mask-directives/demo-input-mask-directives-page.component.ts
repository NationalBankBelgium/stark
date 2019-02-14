import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkTextMasks, StarkTextMaskConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components/reference-block";

@Component({
	selector: "showcase-demo-mask-directives",
	styleUrls: ["./demo-input-mask-directives-page.component.scss"],
	templateUrl: "./demo-input-mask-directives-page.component.html"
})
export class DemoInputMaskDirectivesPageComponent implements OnInit {
	public creditCardMaskConfig: StarkTextMaskConfig;
	public structuredMessageMaskConfig: StarkTextMaskConfig;
	public customMaskConfig: StarkTextMaskConfig;
	public structuredMessage: string;
	public phoneNumberField: FormControl;
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		this.phoneNumberField = new FormControl();

		this.creditCardMaskConfig = {
			mask: StarkTextMasks.CREDITCARD_NUMBER
		};

		this.structuredMessageMaskConfig = {
			mask: StarkTextMasks.STRUCTURED_COMMUNICATION_NUMBER
		};

		this.customMaskConfig = {
			mask: ["(", "+", "3", "2", ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/],
			placeholderChar: "#"
		};

		this.referenceList = [
			{
				label: "Stark Text Mask directive",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkTextMaskDirective.html"
			}
		];
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.phoneNumberField.valueChanges.subscribe((value: string) => this.logger.debug("phoneNumberField value changed: ", value));

		this.logger.debug("DemoInputMaskDirectivesComponent - initialized");
	}

	public logChange(event: Event): void {
		this.logger.debug("creditCard value changed", (<HTMLInputElement>event.srcElement).value);
	}

	public logModelChange(): void {
		this.logger.debug("structuredMessage value changed", this.structuredMessage);
	}
}
