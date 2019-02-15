import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-email-mask",
	styleUrls: ["./demo-email-mask.component.scss"],
	templateUrl: "./demo-email-mask.component.html"
})
export class DemoEmailMaskComponent {
	public email: string;

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	public logModelChange(model: any): void {
		this.logger.debug("model value changed", model);
	}
}
