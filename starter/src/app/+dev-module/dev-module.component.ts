import { Component, Inject, OnInit } from "@angular/core";
import { StarkLoggingService, starkLoggingServiceName } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "dev-module",
	template: `
    <h1>Hello from DevModule Component</h1>
  `
})
export class DevModuleComponent implements OnInit {
	public constructor(@Inject(starkLoggingServiceName) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `DevModule` component");
	}
}
