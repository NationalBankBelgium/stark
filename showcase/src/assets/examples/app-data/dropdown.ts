import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-app-data",
	templateUrl: "./demo-app-data.component.html"
})
export class DemoAppDataComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {}
}
