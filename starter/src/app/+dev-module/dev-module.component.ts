import { Component, Inject, OnInit } from "@angular/core";
import { StarkLoggingService, STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "dev-module",
	template: `
    <h1>Hello from DevModule Component</h1>
  `
})
export class DevModuleComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `DevModule` component");
	}
}
