import { Component, Inject, OnInit } from "@angular/core";
import { StarkLoggingService, STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log("`Detail` component loaded asynchronously");

@Component({
	selector: "detail",
	templateUrl: "./detail.component.html"
})
export class DetailComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `Detail` component");
	}
}
