import { Ng2StateDeclaration } from "@uirouter/angular";
import { AboutPageComponent, NoContentPageComponent, HomePageComponent } from "./pages";

export const HOME_STATES: Ng2StateDeclaration[] = [
	{
		name: "home",
		url: "^/home", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		views: { "@": { component: HomePageComponent } },
		parent: "app"
	},
	{
		name: "about",
		url: "^/about", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		views: { "@": { component: AboutPageComponent } },
		parent: "app"
	},
	{
		name: "otherwise",
		url: "^/otherwise", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		views: { "@": { component: NoContentPageComponent } },
		parent: "app"
	}
];
