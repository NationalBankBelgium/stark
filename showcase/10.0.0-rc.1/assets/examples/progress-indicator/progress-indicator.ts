import { Component, Inject } from "@angular/core";
import {
	STARK_PROGRESS_INDICATOR_SERVICE,
	StarkProgressIndicatorConfig,
	StarkProgressIndicatorService,
	StarkProgressIndicatorType
} from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-progress-indicator",
	templateUrl: "./demo-progress-indicator.component.html",
	styleUrls: ["./demo-progress-indicator.component.scss"]
})
export class DemoProgressIndicatorComponent {
	public show = false;

	public progressIndicatorConfig: StarkProgressIndicatorConfig = {
		topic: "progressIndicatorTopic",
		type: StarkProgressIndicatorType.SPINNER
	};

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
