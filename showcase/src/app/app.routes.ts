import { Ng2StateDeclaration } from "@uirouter/angular";
import { AppComponent } from "./app.component";

export const APP_STATES: Ng2StateDeclaration[] = [
	{
		name: "app",
		url: "/",
		component: AppComponent
	},
	{
		name: "welcome.**",
		url: "^/welcome", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: (): any => import("./welcome/welcome.module").then((x) => x.WelcomeModule) // lazy loaded module
	},
	{
		name: "demo-ui.**",
		url: "^/demo-ui", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: (): any => import("./demo-ui/demo-ui.module").then((x) => x.DemoUiModule) // lazy loaded module
	},
	{
		name: "demo-rbac.**",
		url: "^/demo-rbac", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: (): any => import("./demo-rbac/demo-rbac.module").then((x) => x.DemoRBACModule) // lazy loaded module
	},
	{
		name: "styleguide.**",
		url: "^/styleguide", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: (): any => import("./styleguide/styleguide.module").then((x) => x.StyleguideModule) // lazy loaded module
	}
];
