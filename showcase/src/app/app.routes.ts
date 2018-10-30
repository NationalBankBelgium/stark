import { HomeComponent } from "./home";
import { NoContentComponent } from "./no-content";
import { Ng2StateDeclaration } from "@uirouter/angular";
import { AppComponent } from "./app.component";

export const APP_STATES: Ng2StateDeclaration[] = [
	{
		name: "app",
		url: "/",
		component: AppComponent
	},
	{
		name: "home",
		url: "",
		views: { "@": { component: HomeComponent } },
		parent: "app"
	},
	{
		name: "news.**",
		url: "^/news", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: "./news/news.module#NewsModule" // lazy loaded module
	},
	{
		name: "demo.**",
		url: "^/demo", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		loadChildren: "./demo/demo.module#DemoModule" // lazy loaded module
	},
	{
		name: "otherwise",
		url: "^/otherwise", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		component: NoContentComponent
	}
];
