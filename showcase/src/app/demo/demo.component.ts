import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "showcase-demo",
	templateUrl: "./demo.component.html",
	styleUrls: ["./demo.component.scss"]
})
export class DemoComponent {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}
}
