import { Component } from "@angular/core";
import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components/reference-block";
import { APP_MENU_CONFIG } from "../../../app-menu.config";

@Component({
	selector: "demo-route-search-page",
	templateUrl: "./demo-route-search-page.component.html"
})
export class DemoRouteSearchPageComponent {
	public mainMenu: StarkMenuConfig = APP_MENU_CONFIG;

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Route Search component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkRouteSearchComponent.html"
		}
	];
}
