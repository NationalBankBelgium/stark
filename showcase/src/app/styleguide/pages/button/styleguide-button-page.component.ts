import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-button",
	templateUrl: "./styleguide-button-page.component.html",
	styleUrls: ["./styleguide-button-page.component.scss"],
	/* eslint-disable-next-line @angular-eslint/use-component-view-encapsulation */
	encapsulation: ViewEncapsulation.None
})
export class StyleguideButtonPageComponent {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
}
