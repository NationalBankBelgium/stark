import { Component, HostBinding, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

const componentName: string = "styleguide-layout-page";

@Component({
	selector: "demo-layout",
	templateUrl: "./styleguide-layout-page.component.html"
})
export class StyleguideLayoutPageComponent {
	@HostBinding("class")
	public class: string = componentName;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
}
