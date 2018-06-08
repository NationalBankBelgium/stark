import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "home", // <home></home>
	providers: [],
	styleUrls: ["./home.component.pcss"],
	templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("Hello from the `Home` component");
	}
}
