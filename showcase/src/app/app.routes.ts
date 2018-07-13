import { ActionBarComponent, ExampleViewerComponent } from "./demo";
import { HomeComponent } from "./home";
import { NoContentComponent } from "./no-content";
import { Ng2StateDeclaration } from "@uirouter/angular";

export const APP_STATES: Ng2StateDeclaration[] = [
	{ name: "home", url: "/", component: HomeComponent },
	{ name: "demo-action-bar", url: "/demo/action-bar", component: ActionBarComponent },
	{ name: "demo-example-viewer", url: "/demo/example-viewer", component: ExampleViewerComponent },
	{ name: "otherwise", url: "/otherwise", component: NoContentComponent }
];
