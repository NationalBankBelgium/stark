import {
	DemoActionBarComponent,
	DemoButtonComponent,
	DemoDatePickerComponent,
	DemoDateRangePickerComponent,
	DemoDropdownComponent,
	DemoExampleViewerComponent,
	DemoHeaderComponent,
	DemoKeyboardDirectivesComponent,
	DemoPrettyPrintComponent,
	DemoTableComponent
} from "./demo";
import { HomeComponent } from "./home";
import { NoContentComponent } from "./no-content";
import { Ng2StateDeclaration } from "@uirouter/angular";
import { NewsComponent } from "./news";

export const APP_STATES: Ng2StateDeclaration[] = [
	{ name: "news", url: "/news", component: NewsComponent },
	{ name: "home", url: "/", component: HomeComponent },
	{ name: "demo-action-bar", url: "/demo/action-bar", component: DemoActionBarComponent },
	{ name: "demo-button", url: "/demo/button", component: DemoButtonComponent },
	{ name: "demo-date-picker", url: "/demo/date-picker", component: DemoDatePickerComponent },
	{ name: "demo-date-range-picker", url: "/demo/date-range-picker", component: DemoDateRangePickerComponent },
	{ name: "demo-stark-header", url: "/demo/stark-header", component: DemoHeaderComponent },
	{ name: "demo-example-viewer", url: "/demo/example-viewer", component: DemoExampleViewerComponent },
	{ name: "demo-keyboard-directives", url: "/demo/keyboard-directives", component: DemoKeyboardDirectivesComponent },
	{ name: "demo-pretty-print", url: "/demo/pretty-print", component: DemoPrettyPrintComponent },
	{ name: "demo-table", url: "/demo/table", component: DemoTableComponent },
	{ name: "demo-dropdown", url: "/demo/dropdown", component: DemoDropdownComponent },
	{ name: "otherwise", url: "/otherwise", component: NoContentComponent }
];
