import { Ng2StateDeclaration } from "@uirouter/angular";
import {
	DemoActionBarPageComponent,
	DemoAppDataPageComponent,
	DemoBreadcrumbPageComponent,
	DemoCollapsiblePageComponent,
	DemoDatePickerPageComponent,
	DemoDateRangePickerPageComponent,
	DemoDropdownPageComponent,
	DemoFooterPageComponent,
	DemoKeyboardDirectivesPageComponent,
	DemoLanguageSelectorPageComponent,
	DemoLogoutPageComponent,
	DemoMenuPageComponent,
	DemoMessagePanePageComponent,
	DemoMinimapPageComponent,
	DemoPaginationPageComponent,
	DemoPrettyPrintPageComponent,
	DemoSliderPageComponent,
	DemoSidebarPageComponent,
	DemoTablePageComponent,
	DemoToastPageComponent
} from "./pages";

export const DEMO_STATES: Ng2StateDeclaration[] = [
	{ name: "demo-ui", url: "^/demo-ui", abstract: true, parent: "app" },
	{
		name: "demo-ui.action-bar",
		url: "/action-bar",
		views: { "@": { component: DemoActionBarPageComponent } }
	},
	{
		name: "demo-ui.app-data",
		url: "/app-data",
		views: { "@": { component: DemoAppDataPageComponent } }
	},
	{
		name: "demo-ui.breadcrumb",
		url: "/breadcrumb",
		views: { "@": { component: DemoBreadcrumbPageComponent } }
	},
	{
		name: "demo-ui.collapsible",
		url: "/collapsible",
		views: { "@": { component: DemoCollapsiblePageComponent } }
	},
	{
		name: "demo-ui.date-picker",
		url: "/date-picker",
		views: { "@": { component: DemoDatePickerPageComponent } }
	},
	{
		name: "demo-ui.date-range-picker",
		url: "/date-range-picker",
		views: { "@": { component: DemoDateRangePickerPageComponent } }
	},
	{
		name: "demo-ui.dropdown",
		url: "/dropdown",
		views: { "@": { component: DemoDropdownPageComponent } }
	},
	{
		name: "demo-ui.stark-footer",
		url: "/stark-footer",
		views: { "@": { component: DemoFooterPageComponent } }
	},
	{
		name: "demo-ui.keyboard-directives",
		url: "/keyboard-directives",
		views: { "@": { component: DemoKeyboardDirectivesPageComponent } }
	},
	{
		name: "demo-ui.language-selector",
		url: "/language-selector",
		views: { "@": { component: DemoLanguageSelectorPageComponent } }
	},
	{
		name: "demo-ui.logout",
		url: "/logout",
		views: { "@": { component: DemoLogoutPageComponent } }
	},
	{
		name: "demo-ui.menu",
		url: "/menu",
		views: { "@": { component: DemoMenuPageComponent } }
	},
	{
		name: "demo-ui.message-pane",
		url: "/demo-ui/message-pane",
		views: { "@": { component: DemoMessagePanePageComponent } }
	},
	{
		name: "demo-ui.minimap",
		url: "/minimap",
		views: { "@": { component: DemoMinimapPageComponent } }
	},
	{
		name: "demo-ui.pagination",
		url: "/pagination",
		views: { "@": { component: DemoPaginationPageComponent } }
	},
	{
		name: "demo-ui.pretty-print",
		url: "/pretty-print",
		views: { "@": { component: DemoPrettyPrintPageComponent } }
	},
	{
		name: "demo-ui.slider",
		url: "/slider",
		views: { "@": { component: DemoSliderPageComponent } }
	},
	{
		name: "demo-ui.sidebar",
		url: "/sidebar",
		views: { "@": { component: DemoSidebarPageComponent } }
	},
	{
		name: "demo-ui.table",
		url: "/table",
		views: { "@": { component: DemoTablePageComponent } }
	},
	{
		name: "demo-ui.toast",
		url: "/toast",
		views: { "@": { component: DemoToastPageComponent } }
	}
];
