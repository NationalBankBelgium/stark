import { Ng2StateDeclaration } from "@uirouter/angular";
import { DemoActionBarComponent } from "./action-bar";
import { DemoBreadcrumbComponent } from "./breadcrumb";
import { DemoButtonComponent } from "./button";
import { DemoCardComponent } from "./card";
import { DemoCollapsibleComponent } from "./collapsible";
import { DemoColorsComponent } from "./colors";
import { DemoDatePickerComponent } from "./date-picker";
import { DemoDateRangePickerComponent } from "./date-range-picker";
import { DemoDropdownComponent } from "./dropdown";
import { DemoFooterComponent } from "./footer";
import { DemoHeaderComponent } from "./header";
import { DemoExampleViewerComponent } from "./example-viewer";
import { DemoKeyboardDirectivesComponent } from "./keyboard-directives";
import { DemoLanguageSelectorComponent } from "./language-selector";
import { DemoLogoutComponent } from "./logout";
import { DemoMenuComponent } from "./menu";
import { DemoPaginationComponent } from "./pagination";
import { DemoPrettyPrintComponent } from "./pretty-print";
import { DemoSliderComponent } from "./slider";
import { DemoSidebarComponent } from "./sidebar";
import { DemoTableComponent } from "./table";
import { DemoToastComponent } from "./toast";
import { DemoTypographyComponent } from "./typography";
import { DemoMinimapComponent } from "./minimap";

export const DEMO_STATES: Ng2StateDeclaration[] = [
	{ name: "demo", url: "^/demo", abstract: true, parent: "app" },
	{
		name: "demo.action-bar",
		url: "/action-bar",
		views: { "@": { component: DemoActionBarComponent } }
	},
	{
		name: "demo.breadcrumb",
		url: "/breadcrumb",
		views: { "@": { component: DemoBreadcrumbComponent } }
	},
	{
		name: "demo.button",
		url: "/button",
		views: { "@": { component: DemoButtonComponent } }
	},
	{
		name: "demo.card",
		url: "/card",
		views: { "@": { component: DemoCardComponent } }
	},
	{
		name: "demo.collapsible",
		url: "/collapsible",
		views: { "@": { component: DemoCollapsibleComponent } }
	},
	{
		name: "demo.colors",
		url: "/colors",
		views: { "@": { component: DemoColorsComponent } }
	},
	{
		name: "demo.date-picker",
		url: "/date-picker",
		views: { "@": { component: DemoDatePickerComponent } }
	},
	{
		name: "demo.date-range-picker",
		url: "/date-range-picker",
		views: { "@": { component: DemoDateRangePickerComponent } }
	},
	{
		name: "demo.dropdown",
		url: "/dropdown",
		views: { "@": { component: DemoDropdownComponent } }
	},
	{
		name: "demo.stark-footer",
		url: "/stark-footer",
		views: { "@": { component: DemoFooterComponent } }
	},
	{
		name: "demo.stark-header",
		url: "/stark-header",
		views: { "@": { component: DemoHeaderComponent } }
	},
	{
		name: "demo.example-viewer",
		url: "/example-viewer",
		views: { "@": { component: DemoExampleViewerComponent } }
	},
	{
		name: "demo.keyboard-directives",
		url: "/keyboard-directives",
		views: { "@": { component: DemoKeyboardDirectivesComponent } }
	},
	{
		name: "demo.language-selector",
		url: "/language-selector",
		views: { "@": { component: DemoLanguageSelectorComponent } }
	},
	{
		name: "demo.logout",
		url: "/logout",
		views: { "@": { component: DemoLogoutComponent } }
	},
	{
		name: "demo.menu",
		url: "/menu",
		views: { "@": { component: DemoMenuComponent } }
	},
	{
		name: "demo.minimap",
		url: "/minimap",
		views: { "@": { component: DemoMinimapComponent } }
	},
	{
		name: "demo.pagination",
		url: "/pagination",
		views: { "@": { component: DemoPaginationComponent } }
	},
	{
		name: "demo.pretty-print",
		url: "/pretty-print",
		views: { "@": { component: DemoPrettyPrintComponent } }
	},
	{
		name: "demo.slider",
		url: "/slider",
		views: { "@": { component: DemoSliderComponent } }
	},
	{
		name: "demo.sidebar",
		url: "/sidebar",
		views: { "@": { component: DemoSidebarComponent } }
	},
	{
		name: "demo.table",
		url: "/table",
		views: { "@": { component: DemoTableComponent } }
	},
	{
		name: "demo.toast",
		url: "/toast",
		views: { "@": { component: DemoToastComponent } }
	},
	{
		name: "demo.typography",
		url: "/typography",
		views: { "@": { component: DemoTypographyComponent } }
	}
];
