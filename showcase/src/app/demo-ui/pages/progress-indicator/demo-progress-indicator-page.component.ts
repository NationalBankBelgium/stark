import { Component, Inject } from "@angular/core";
import {
	STARK_PROGRESS_INDICATOR_SERVICE,
	StarkProgressIndicatorConfig,
	StarkProgressIndicatorService,
	StarkProgressIndicatorType
} from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-progress-indicator",
	templateUrl: "./demo-progress-indicator-page.component.html",
	styleUrls: ["./demo-progress-indicator-page.component.scss"]
})
export class DemoProgressIndicatorPageComponent {
	public show = false;

	public progressIndicatorConfig: StarkProgressIndicatorConfig = {
		topic: "progressIndicatorTopic",
		type: StarkProgressIndicatorType.SPINNER
	};

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Progress Indicator Component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkProgressIndicatorComponent.html"
		},
		{
			label: "Stark Progress Indicator Directive",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkProgressIndicatorDirective.html"
		},
		{
			label: "Stark Progress Indicator Service",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/interfaces/StarkProgressIndicatorService.html"
		}
	];

	public constructor(@Inject(STARK_PROGRESS_INDICATOR_SERVICE) private progressService: StarkProgressIndicatorService) {}

	public showProgressIndicator(): void {
		this.show = !this.show;
		if (this.show) {
			this.progressService.show(this.progressIndicatorConfig.topic);
		} else {
			this.progressService.hide(this.progressIndicatorConfig.topic);
		}
	}
}
