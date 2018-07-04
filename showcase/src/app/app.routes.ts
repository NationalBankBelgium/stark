import { DemoComponent } from "./demo";
import { HomeComponent } from "./home";
import { NoContentComponent } from "./no-content";
import { Ng2StateDeclaration } from "@uirouter/angular";

export const APP_STATES: Ng2StateDeclaration[] = [
	{ name: "home", url: "/", component: HomeComponent },
	{ name: "demo-example-viewer", url: "/demo-example-viewer", component: DemoComponent },
	{ name: "otherwise", url: "/otherwise", component: NoContentComponent }
];
