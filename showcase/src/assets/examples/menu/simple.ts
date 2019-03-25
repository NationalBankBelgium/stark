import { Component, OnInit } from "@angular/core";
import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-menu",
	templateUrl: "./demo-menu.component.html"
})
export class DemoMenuComponent {
	public simpleMenu: StarkMenuConfig = {
		menuGroups: [
			{
				id: "menu-item-home",
				icon: "home",
				label: "Home",
				isVisible: true,
				isEnabled: true,
				targetState: "#",
				targetStateParams: { param1: "1-1-1", param2: "1-1-2" }
			},
			{
				id: "menu-item-with-entries",
				label: "Menu item with entries",
				isVisible: true,
				isEnabled: true,
				entries: [
					{
						id: "menu-item-entry-1",
						label: "Entry 1 with entries",
						isVisible: true,
						isEnabled: true,
						entries: [
							{
								id: "menu-item-entry-1-entry-1",
								label: "Entry 1.1",
								isVisible: true,
								isEnabled: true,
								targetState: "#"
							},
							{
								id: "menu-item-entry-1-entry-2",
								label: "Entry 1.2",
								isVisible: true,
								isEnabled: true,
								targetState: "#"
							},
							{
								id: "menu-item-entry-1-entry-3",
								label: "Entry 1.3",
								isVisible: true,
								isEnabled: true,
								targetState: "#"
							}
						]
					},
					{
						id: "menu-item-entry-2",
						label: "Entry 1",
						isVisible: true,
						isEnabled: true,
						targetState: "#"
					},
					{
						id: "menu-item-entry-3",
						label: "Entry 1",
						isVisible: true,
						isEnabled: true,
						targetState: "#"
					}
				]
			},
			{
				id: "menu-item-2",
				label: "Menu item",
				isVisible: true,
				isEnabled: true,
				targetState: "#"
			}
		]
	};
}
