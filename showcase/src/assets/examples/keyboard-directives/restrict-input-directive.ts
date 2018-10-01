import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-restrict-input",
	styleUrls: ["./demo-restrict-input.component.scss"],
	templateUrl: "./demo-restrict-input.component.html"
})
export class DemoRestrictInputComponent {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
}
