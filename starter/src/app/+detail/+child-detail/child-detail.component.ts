import { Component, Inject, OnInit } from "@angular/core";
import { StarkLoggingService, STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log("`ChildDetail` component loaded asynchronously");

@Component({
	selector: "child-detail",
	template: `
    <h1>Hello from Child Detail</h1>
  `
})
export class ChildDetailComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `ChildDetail` component");
	}
}
