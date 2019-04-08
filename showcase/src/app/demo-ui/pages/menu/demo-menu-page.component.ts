import { Component } from "@angular/core";
import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-menu",
	templateUrl: "./demo-menu-page.component.html",
	styleUrls: ["./demo-menu-page.component.scss"]
})
export class DemoMenuPageComponent {
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
				id: "menu-item",
				label: "Menu item",
				isVisible: true,
				isEnabled: true,
				targetState: "#"
			}
		]
	};

	public menuWithSections: StarkMenuConfig = {
		menuSections: [
			{
				label: "Section 1",
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
										targetState: ""
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
						id: "menu-item",
						label: "Menu item",
						isVisible: true,
						isEnabled: true,
						targetState: "#"
					}
				]
			},
			{
				label: "Section 2",
				menuGroups: [
					{
						id: "menu-item-1",
						label: "Menu item 1",
						isVisible: true,
						isEnabled: true,
						targetState: "#"
					},
					{
						id: "menu-item-2",
						label: "Menu item 2",
						isVisible: true,
						isEnabled: false,
						targetState: "#"
					},
					{
						id: "menu-item-3",
						label: "Menu item 3",
						isVisible: false,
						isEnabled: false,
						targetState: "#"
					}
				]
			}
		]
	};

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark AppMenu component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppMenuComponent.html"
		},
		{
			label: "Stark AppMenu Item component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppMenuItemComponent.html"
		}
	];
}
