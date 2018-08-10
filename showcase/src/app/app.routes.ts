import {
	ActionBarComponent,
	ButtonComponent,
	DatePickerComponent,
	DateRangePickerComponent,
	ExampleViewerComponent,
	KeyboardDirectivesComponent,
	PrettyPrintComponent,
	TableComponent
} from "./demo";
import { HomeComponent } from "./home";
import { NoContentComponent } from "./no-content";
import { Ng2StateDeclaration } from "@uirouter/angular";
import { NewsComponent } from "./news";

export const APP_STATES: Ng2StateDeclaration[] = [
	{ name: "news", url: "/news", component: NewsComponent },
	{ name: "home", url: "/", component: HomeComponent },
	{ name: "demo-action-bar", url: "/demo/action-bar", component: ActionBarComponent },
	{ name: "demo-button", url: "/demo/button", component: ButtonComponent },
	{ name: "demo-date-picker", url: "/demo/date-picker", component: DatePickerComponent },
	{ name: "demo-date-range-picker", url: "/demo/date-range-picker", component: DateRangePickerComponent },
	{ name: "demo-example-viewer", url: "/demo/example-viewer", component: ExampleViewerComponent },
	{ name: "demo-keyboard-directives", url: "/demo/keyboard-directives", component: KeyboardDirectivesComponent },
	{ name: "demo-pretty-print", url: "/demo/pretty-print", component: PrettyPrintComponent },
	{ name: "demo-table", url: "/demo/table", component: TableComponent },
	{ name: "otherwise", url: "/otherwise", component: NoContentComponent }
];
