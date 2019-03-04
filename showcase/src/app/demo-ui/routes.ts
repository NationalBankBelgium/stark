import { Ng2StateDeclaration } from "@uirouter/angular";
import {
	DemoActionBarPageComponent,
	DemoAppDataPageComponent,
	DemoBreadcrumbPageComponent,
	DemoCollapsiblePageComponent,
	DemoDatePickerPageComponent,
	DemoDateRangePickerPageComponent,
	DemoDialogsPageComponent,
	DemoDropdownPageComponent,
	DemoFooterPageComponent,
	DemoGenericSearchPageComponent,
	DemoInputMaskDirectivesPageComponent,
	DemoKeyboardDirectivesPageComponent,
	DemoLanguageSelectorPageComponent,
	DemoLogoutPageComponent,
	DemoMenuPageComponent,
	DemoMessagePanePageComponent,
	DemoMinimapPageComponent,
	DemoPaginationPageComponent,
	DemoPrettyPrintPageComponent,
	DemoProgressIndicatorPageComponent,
	DemoRouteSearchPageComponent,
	DemoSidebarPageComponent,
	DemoSliderPageComponent,
	DemoTablePageComponent,
	DemoToastPageComponent,
	DemoTransformInputDirectivePageComponent
} from "./pages";

export const DEMO_STATES: Ng2StateDeclaration[] = [
	{ name: "demo-ui", url: "^/demo-ui", abstract: true, parent: "app" },
	{
		name: "demo-ui.action-bar",
		url: "/action-bar",
		data: {
			translationKey: "SHOWCASE.DEMO.ACTION_BAR.TITLE"
		},
		views: { "@": { component: DemoActionBarPageComponent } }
	},
	{
		name: "demo-ui.app-data",
		url: "/app-data",
		data: {
			translationKey: "SHOWCASE.DEMO.APP_DATA.TITLE"
		},
		views: { "@": { component: DemoAppDataPageComponent } }
	},
	{
		name: "demo-ui.breadcrumb",
		url: "/breadcrumb",
		data: {
			translationKey: "SHOWCASE.DEMO.BREADCRUMB.TITLE"
		},
		views: { "@": { component: DemoBreadcrumbPageComponent } }
	},
	{
		name: "demo-ui.collapsible",
		url: "/collapsible",
		data: {
			translationKey: "SHOWCASE.DEMO.COLLAPSIBLE.TITLE"
		},
		views: { "@": { component: DemoCollapsiblePageComponent } }
	},
	{
		name: "demo-ui.date-picker",
		url: "/date-picker",
		data: {
			translationKey: "SHOWCASE.DEMO.DATE_PICKER.TITLE"
		},
		views: { "@": { component: DemoDatePickerPageComponent } }
	},
	{
		name: "demo-ui.date-range-picker",
		url: "/date-range-picker",
		data: {
			translationKey: "SHOWCASE.DEMO.DATE_RANGE_PICKER.TITLE"
		},
		views: { "@": { component: DemoDateRangePickerPageComponent } }
	},
	{
		name: "demo-ui.dialogs",
		url: "/dialogs",
		data: {
			translationKey: "SHOWCASE.DEMO.DIALOGS.TITLE"
		},
		views: { "@": { component: DemoDialogsPageComponent } }
	},
	{
		name: "demo-ui.dropdown",
		url: "/dropdown",
		data: {
			translationKey: "SHOWCASE.DEMO.DROPDOWN.TITLE"
		},
		views: { "@": { component: DemoDropdownPageComponent } }
	},
	{
		name: "demo-ui.generic-search",
		url: "/generic-search",
		views: { "@": { component: DemoGenericSearchPageComponent } }
	},
	{
		name: "demo-ui.app-footer",
		url: "/app-footer",
		data: {
			translationKey: "SHOWCASE.DEMO.FOOTER.TITLE"
		},
		views: { "@": { component: DemoFooterPageComponent } }
	},
	{
		name: "demo-ui.keyboard-directives",
		url: "/keyboard-directives",
		data: {
			translationKey: "SHOWCASE.DEMO.DIRECTIVES.KEYBOARD.TITLE"
		},
		views: { "@": { component: DemoKeyboardDirectivesPageComponent } }
	},
	{
		name: "demo-ui.transform-input-directive",
		url: "/transform-input-directive",
		data: {
			translationKey: "SHOWCASE.DEMO.DIRECTIVES.TRANSFORM.TITLE"
		},
		views: { "@": { component: DemoTransformInputDirectivePageComponent } }
	},
	{
		name: "demo-ui.language-selector",
		url: "/language-selector",
		data: {
			translationKey: "SHOWCASE.DEMO.LANGUAGE_SELECTOR.TITLE"
		},
		views: { "@": { component: DemoLanguageSelectorPageComponent } }
	},
	{
		name: "demo-ui.logout",
		url: "/logout",
		data: {
			translationKey: "SHOWCASE.DEMO.LOGOUT.TITLE"
		},
		views: { "@": { component: DemoLogoutPageComponent } }
	},
	{
		name: "demo-ui.input-mask-directives",
		url: "/input-mask-directives",
		data: {
			translationKey: "SHOWCASE.DEMO.DIRECTIVES.INPUT_MASK.TITLE"
		},
		views: { "@": { component: DemoInputMaskDirectivesPageComponent } }
	},
	{
		name: "demo-ui.menu",
		url: "/menu",
		data: {
			translationKey: "SHOWCASE.DEMO.MENU.TITLE"
		},
		views: { "@": { component: DemoMenuPageComponent } }
	},
	{
		name: "demo-ui.message-pane",
		url: "/message-pane",
		data: {
			translationKey: "SHOWCASE.DEMO.MESSAGE_PANE.TITLE"
		},
		views: { "@": { component: DemoMessagePanePageComponent } }
	},
	{
		name: "demo-ui.minimap",
		url: "/minimap",
		data: {
			translationKey: "SHOWCASE.DEMO.MINIMAP.TITLE"
		},
		views: { "@": { component: DemoMinimapPageComponent } }
	},
	{
		name: "demo-ui.pagination",
		url: "/pagination",
		data: {
			translationKey: "SHOWCASE.DEMO.PAGINATION.TITLE"
		},
		views: { "@": { component: DemoPaginationPageComponent } }
	},
	{
		name: "demo-ui.pretty-print",
		url: "/pretty-print",
		data: {
			translationKey: "SHOWCASE.DEMO.PRETTY_PRINT.TITLE"
		},
		views: { "@": { component: DemoPrettyPrintPageComponent } }
	},
	{
		name: "demo-ui.progress-indicator",
		url: "/progress-indicator",
		data: {
			translationKey: "SHOWCASE.DEMO.PROGRESS_INDICATOR.TITLE"
		},
		views: { "@": { component: DemoProgressIndicatorPageComponent } }
	},
	{
		name: "demo-ui.route-search",
		url: "/route-search",
		data: {
			translationKey: "SHOWCASE.DEMO.ROUTE_SEARCH.TITLE"
		},
		views: { "@": { component: DemoRouteSearchPageComponent } }
	},
	{
		name: "demo-ui.slider",
		url: "/slider",
		data: {
			translationKey: "SHOWCASE.DEMO.SLIDER.TITLE"
		},
		views: { "@": { component: DemoSliderPageComponent } }
	},
	{
		name: "demo-ui.sidebar",
		url: "/sidebar",
		data: {
			translationKey: "SHOWCASE.DEMO.SIDEBAR.TITLE"
		},
		views: { "@": { component: DemoSidebarPageComponent } }
	},
	{
		name: "demo-ui.table",
		url: "/table",
		data: {
			translationKey: "SHOWCASE.DEMO.TABLE.TITLE"
		},
		views: { "@": { component: DemoTablePageComponent } }
	},
	{
		name: "demo-ui.toast",
		url: "/toast",
		data: {
			translationKey: "SHOWCASE.DEMO.TOAST.TITLE"
		},
		views: { "@": { component: DemoToastPageComponent } }
	}
];
