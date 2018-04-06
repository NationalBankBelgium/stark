import { Component, Inject, OnInit } from "@angular/core";
import { StarkLoggingService, starkLoggingServiceName } from "@nationalbankbelgium/stark-core";
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log("`ChildBarrel` component loaded asynchronously");

@Component({
	selector: "child-barrel",
	template: `
    <h1>Hello from Child Barrel</h1>
  `
})
export class ChildBarrelComponent implements OnInit {
	public constructor(@Inject(starkLoggingServiceName) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `ChildBarrel` component");
	}
}
