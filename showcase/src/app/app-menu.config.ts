import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";

export const APP_MENU_CONFIG: StarkMenuConfig = {
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
				},
				{
					id: "menu-getting-started",
					label: "Getting started",
					isVisible: true,
					isEnabled: true,
					targetState: "getting-started"
				},
				{
					id: "menu-news",
					label: "News",
					isVisible: true,
					isEnabled: true,
					targetState: "news"
				}
			]
		},
		{
			label: "Stark UI",
			menuGroups: [
				{
					id: "menu-stark-ui-components",
					label: "Components",
					isVisible: true,
					isEnabled: true,
					entries: [
						{
							id: "menu-stark-ui-components-action-bar",
							label: "Action bar",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.action-bar"
						},
						{
							id: "menu-stark-ui-components-app-data",
							label: "App Data",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.app-data"
						},
						{
							id: "menu-stark-ui-components-logout",
							label: "App logout",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.logout"
						},
						{
							id: "menu-stark-ui-components-menu",
							label: "App menu",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.menu"
						},
						{
							id: "menu-stark-ui-components-sidebar",
							label: "App sidebar",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.sidebar"
						},
						{
							id: "menu-stark-ui-components-breadcrumb",
							label: "Breadcrumb",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.breadcrumb"
						},
						{
							id: "menu-stark-ui-components-collapsible",
							label: "Collapsible",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.collapsible"
						},
						{
							id: "menu-stark-ui-components-date-picker",
							label: "Date picker",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.date-picker"
						},
						{
							id: "menu-stark-ui-components-date-range-picker",
							label: "Date range picker",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.date-range-picker"
						},
						{
							id: "menu-stark-ui-components-dropdown",
							label: "Dropdown",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.dropdown"
						},
						{
							id: "menu-style-footer",
							label: "Footer",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.stark-footer"
						},
						{
							id: "menu-stark-ui-components-language-selector",
							label: "Language selector",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.language-selector"
						},
						{
							id: "menu-stark-ui-components-message-pane",
							label: "Message pane",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.message-pane"
						},
						{
							id: "menu-stark-ui-components-minimap",
							label: "Minimap",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.minimap"
						},
						{
							id: "menu-stark-ui-components-pagination",
							label: "Pagination",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.pagination"
						},
						{
							id: "menu-stark-ui-components-pretty-print",
							label: "Pretty print",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.pretty-print"
						},
						{
							id: "menu-stark-ui-components-slider",
							label: "Slider",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.slider"
						},
						{
							id: "menu-stark-ui-components-route-search",
							label: "Route Search",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.route-search"
						},
						{
							id: "menu-stark-ui-components-table",
							label: "Table",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.table"
						},
						{
							id: "menu-stark-ui-components-toast",
							label: "Toast notification",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.toast"
						}
					]
				},
				{
					id: "menu-stark-ui-directives",
					label: "Directives",
					isVisible: true,
					isEnabled: true,
					entries: [
						{
							id: "menu-stark-ui-directives-keyboard",
							label: "Keyboard directives",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.keyboard-directives"
						},
						{
							id: "menu-stark-ui-directives-progress-indicator",
							label: "Progress indicator",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.progress-indicator"
						}
					]
				},
				{
					id: "menu-stark-ui-services",
					label: "Services",
					isVisible: true,
					isEnabled: true,
					targetState: "#"
				}
			]
		},
		{
			label: "Stark Core",
			menuGroups: [
				{
					id: "test-1",
					label: "Getting started",
					isVisible: true,
					isEnabled: true
				},
				{
					id: "test-1",
					label: "UI Components",
					isVisible: true,
					isEnabled: true
				}
			]
		},
		{
			label: "Style guide",
			menuGroups: [
				{
					id: "menu-stark-ui-components-button",
					label: "Button",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.button"
				},
				{
					id: "menu-style-card",
					label: "Card",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.card"
				},
				{
					id: "menu-style-colors",
					label: "Colors",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.colors"
				},
				{
					id: "menu-style-header",
					label: "Header",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.stark-header"
				},
				{
					id: "menu-style-typography",
					label: "Typography",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.typography"
				},
				{
					id: "menu-style-layout",
					label: "Layout",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.layout"
				}
			]
		}
	]
};
