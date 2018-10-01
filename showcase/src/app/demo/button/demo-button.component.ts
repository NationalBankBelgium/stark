import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-button",
	templateUrl: "./demo-button.component.html",
	styleUrls: ["./demo-button.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class DemoButtonComponent {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
}
