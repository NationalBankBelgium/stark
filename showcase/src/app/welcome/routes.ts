import { Ng2StateDeclaration } from "@uirouter/angular";
import { GettingStartedPageComponent, HomePageComponent, NewsPageComponent, NoContentPageComponent } from "./pages";

export const NEWS_STATES: Ng2StateDeclaration[] = [
	{
		name: "home",
		url: "^/home", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		views: { "@": { component: HomePageComponent } },
		parent: "app"
	},
	{
		name: "getting-started",
		url: "^/getting-started",
		views: { "@": { component: GettingStartedPageComponent } },
		parent: "app"
	},
	{
		name: "news",
		url: "^/news", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		views: { "@": { component: NewsPageComponent } },
		parent: "app"
	},
	{
		name: "otherwise",
		url: "^/otherwise", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		component: NoContentPageComponent,
		views: { "@": { component: NoContentPageComponent } },
		parent: "app"
	}
];
