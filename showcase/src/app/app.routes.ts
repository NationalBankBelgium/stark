import { Ng2StateDeclaration } from "@uirouter/angular";
import { AppComponent } from "./app.component";

export const APP_STATES: Ng2StateDeclaration[] = [
	{
		name: "app",
		url: "/",
		component: AppComponent
	},
	{
		name: "demo-ui.**",
		url: "^/demo-ui", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: "./demo-ui/demo-ui.module#DemoUiModule" // lazy loaded module
	},
	{
		name: "styleguide.**",
		url: "^/styleguide", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: "./styleguide/styleguide.module#StyleguideModule" // lazy loaded module
	}
];
