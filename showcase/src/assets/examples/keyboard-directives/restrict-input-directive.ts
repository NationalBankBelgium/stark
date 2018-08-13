import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-on-enter-key",
	styleUrls: ["./demo-keyboard-directives.component.scss"],
	templateUrl: "./demo-keyboard-directives.component.html"
})
export class DemoKeyboardDirectivesComponent {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
}
