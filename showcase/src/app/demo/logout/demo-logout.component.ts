import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-logout",
	templateUrl: "./demo-logout.component.html"
})
export class DemoLogoutComponent {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
}
