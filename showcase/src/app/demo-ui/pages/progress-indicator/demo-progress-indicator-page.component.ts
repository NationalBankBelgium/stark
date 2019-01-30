import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../../shared/components";
import {
	STARK_PROGRESS_INDICATOR_SERVICE,
	StarkProgressIndicatorConfig,
	StarkProgressIndicatorService,
	StarkProgressIndicatorType
} from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-progress-indicator",
	templateUrl: "./demo-progress-indicator-page.component.html",
	styleUrls: ["./demo-progress-indicator-page.component.scss"]
})
export class DemoProgressIndicatorPageComponent implements OnInit {
	public show: boolean;

	public referenceList: ReferenceLink[];
	public progressIndicatorConfig: StarkProgressIndicatorConfig;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_PROGRESS_INDICATOR_SERVICE) private progressService: StarkProgressIndicatorService
	) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.show = false;

		this.referenceList = [
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
