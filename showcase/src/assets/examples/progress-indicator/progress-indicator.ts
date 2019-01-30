import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import {
	STARK_PROGRESS_INDICATOR_SERVICE,
	StarkProgressIndicatorConfig,
	StarkProgressIndicatorService,
	StarkProgressIndicatorType
} from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-progress-indicator",
	templateUrl: "./demo-progress-indicator-page.component.html"
})
export class DemoProgressIndicatorPageComponent implements OnInit {
	private show: boolean;

	public progressIndicatorConfig: StarkProgressIndicatorConfig;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		@Inject(STARK_PROGRESS_INDICATOR_SERVICE) private progressService: StarkProgressIndicatorService
	) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.show = false;

		this.progressIndicatorConfig = {
			topic: "progressIndicatorTopic",
			type: StarkProgressIndicatorType.SPINNER
		};
	}

	public showProgressIndicator(): void {
		this.show = !this.show;
		if (this.show) {
			this.progressService.show(this.progressIndicatorConfig.topic);
		} else {
			this.progressService.hide(this.progressIndicatorConfig.topic);
		}
	}
}
