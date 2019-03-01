import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components/reference-block";
import { APP_MENU_CONFIG } from "../../../app-menu.config";

@Component({
	selector: "demo-route-search-page",
	templateUrl: "./demo-route-search-page.component.html"
})
export class DemoRouteSearchPageComponent implements OnInit {
	public mainMenu: StarkMenuConfig;
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.mainMenu = APP_MENU_CONFIG;

		this.referenceList = [
			{
				label: "Stark Route Search component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkRouteSearchComponent.html"
			}
		];
	}
}
