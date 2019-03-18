import { StarkMenuConfig } from "@nationalbankbelgium/stark-ui";

export const APP_MENU_CONFIG: StarkMenuConfig = {
	menuSections: [
		{
			label: "Welcome to STARK",
			menuGroups: [
				{
					id: "menu-home",
					label: "SHOWCASE.HOMEPAGE.TITLE",
					isVisible: true,
					isEnabled: true,
					targetState: "home",
					targetStateParams: { param1: "1-1-1", param2: "1-1-2" }
				},
				{
					id: "menu-getting-started",
					label: "SHOWCASE.GETTING_STARTED.TITLE",
					isVisible: true,
					isEnabled: true,
					targetState: "getting-started"
				},
				{
					id: "menu-news",
					label: "SHOWCASE.NEWS.TITLE",
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
							label: "SHOWCASE.DEMO.ACTION_BAR.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.action-bar"
						},
						{
							id: "menu-stark-ui-components-app-data",
							label: "SHOWCASE.DEMO.APP_DATA.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.app-data"
						},
						{
							id: "menu-stark-ui-footer",
							label: "SHOWCASE.DEMO.FOOTER.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.app-footer"
						},
						{
							id: "menu-stark-ui-components-logout",
							label: "SHOWCASE.DEMO.LOGOUT.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.logout"
						},
						{
							id: "menu-stark-ui-components-menu",
							label: "SHOWCASE.DEMO.MENU.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.menu"
						},
						{
							id: "menu-stark-ui-components-sidebar",
							label: "SHOWCASE.DEMO.SIDEBAR.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.sidebar"
						},
						{
							id: "menu-stark-ui-components-breadcrumb",
							label: "SHOWCASE.DEMO.BREADCRUMB.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.breadcrumb"
						},
						{
							id: "menu-stark-ui-components-collapsible",
							label: "SHOWCASE.DEMO.COLLAPSIBLE.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.collapsible"
						},
						{
							id: "menu-stark-ui-components-date-picker",
							label: "SHOWCASE.DEMO.DATE_PICKER.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.date-picker"
						},
						{
							id: "menu-stark-ui-components-date-range-picker",
							label: "SHOWCASE.DEMO.DATE_RANGE_PICKER.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.date-range-picker"
						},
						{
							id: "menu-stark-ui-components-dialogs",
							label: "SHOWCASE.DEMO.DIALOGS.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.dialogs"
						},
						{
							id: "menu-stark-ui-components-dropdown",
							label: "SHOWCASE.DEMO.DROPDOWN.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.dropdown"
						},
						{
							id: "menu-stark-ui-generic-search",
							label: "SHOWCASE.DEMO.GENERIC_SEARCH.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.generic-search"
						},
						{
							id: "menu-stark-ui-components-language-selector",
							label: "SHOWCASE.DEMO.LANGUAGE_SELECTOR.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.language-selector"
						},
						{
							id: "menu-stark-ui-components-message-pane",
							label: "SHOWCASE.DEMO.MESSAGE_PANE.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.message-pane"
						},
						{
							id: "menu-stark-ui-components-minimap",
							label: "SHOWCASE.DEMO.MINIMAP.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.minimap"
						},
						{
							id: "menu-stark-ui-components-pagination",
							label: "SHOWCASE.DEMO.PAGINATION.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.pagination"
						},
						{
							id: "menu-stark-ui-components-pretty-print",
							label: "SHOWCASE.DEMO.PRETTY_PRINT.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.pretty-print"
						},
						{
							id: "menu-stark-ui-components-slider",
							label: "SHOWCASE.DEMO.SLIDER.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.slider"
						},
						{
							id: "menu-stark-ui-components-route-search",
							label: "SHOWCASE.DEMO.ROUTE_SEARCH.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.route-search"
						},
						{
							id: "menu-stark-ui-components-table",
							label: "SHOWCASE.DEMO.TABLE.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.table"
						},
						{
							id: "menu-stark-ui-components-toast",
							label: "SHOWCASE.DEMO.TOAST.TITLE",
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
							id: "menu-stark-ui-input-mask",
							label: "SHOWCASE.DEMO.DIRECTIVES.INPUT_MASK.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.input-mask-directives"
						},
						{
							id: "menu-stark-ui-restrict-input",
							label: "SHOWCASE.DEMO.DIRECTIVES.RESTRICT_INPUT.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.restrict-input-directive"
						},
						{
							id: "menu-stark-ui-transform-input",
							label: "SHOWCASE.DEMO.DIRECTIVES.TRANSFORM.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-ui.transform-input-directive"
						},
						{
							id: "menu-stark-ui-progress-indicator",
							label: "SHOWCASE.DEMO.PROGRESS_INDICATOR.TITLE",
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
					isEnabled: true
				}
			]
		},
		{
			label: "Stark RBAC",
			menuGroups: [
				{
					id: "menu-stark-rbac-directives",
					label: "Directives",
					isVisible: true,
					isEnabled: true,
					entries: [
						{
							id: "menu-stark-rbac-authorization",
							label: "SHOWCASE.DEMO_RBAC.DIRECTIVES.AUTHORIZATION.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-rbac.authorization-directives"
						}
					]
				},
				{
					id: "menu-stark-rbac-services",
					label: "Services",
					isVisible: true,
					isEnabled: true,
					entries: [
						{
							id: "menu-stark-rbac-authorization-service",
							label: "SHOWCASE.DEMO_RBAC.SERVICES.AUTHORIZATION.TITLE",
							isVisible: true,
							isEnabled: true,
							targetState: "demo-rbac.authorization-service"
						}
					]
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
					id: "menu-style-header",
					label: "App Header",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.header"
				},
				{
					id: "menu-style-components-button",
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
					label: "Color Palettes",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.colors"
				},
				{
					id: "menu-style-layout",
					label: "Layout",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.layout"
				},
				{
					id: "menu-style-typography",
					label: "Typography",
					isVisible: true,
					isEnabled: true,
					targetState: "styleguide.typography"
				}
			]
		}
	]
};
