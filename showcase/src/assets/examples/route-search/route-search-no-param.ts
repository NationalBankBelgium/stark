import { Component, OnInit, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-route-search-page",
	templateUrl: "./demo-route-search-page.component.html",
	styleUrls: ["./demo-route-search-page.component.scss"]
})
export class DemoRouteSearchPageComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		//
	}
}
