import { Component } from "@angular/core";
import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-route-search",
	templateUrl: "./demo-route-search.component.html",
	styleUrls: ["./demo-route-search-page.component.scss"]
})
export class DemoRouteSearchComponent {
	public mainMenu: StarkMenuConfig = {
		menuSections: [
			{
				label: "Welcome to STARK",
				menuGroups: [
					{
						id: "menu-home",
						label: "Home",
						isVisible: true,
						isEnabled: true,
						targetState: "home",
						targetStateParams: { param1: "1-1-1", param2: "1-1-2" }
					}
					// ...
				]
			}
			// ...
		]
	};
}
