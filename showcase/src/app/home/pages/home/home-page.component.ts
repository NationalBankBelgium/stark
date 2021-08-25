import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: "home",
	templateUrl: "./home-page.component.html"
})
export class HomePageComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `Home` component");
	}
}
