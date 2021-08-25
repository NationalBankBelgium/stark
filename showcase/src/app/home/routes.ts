import { Ng2StateDeclaration } from "@uirouter/angular";
import { HomePageComponent, NoContentPageComponent } from "./pages";

export const HOME_STATES: Ng2StateDeclaration[] = [
	{
		name: "home",
		url: "^/home", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		data: {
			translationKey: "SHOWCASE.HOMEPAGE.TITLE"
		},
		views: { "@": { component: HomePageComponent } },
		parent: "app"
	},
	{
		name: "otherwise",
		url: "^/otherwise",
		data: {
			translationKey: "SHOWCASE.OTHERWISE.TITLE"
		},
		component: NoContentPageComponent,
		views: { "@": { component: NoContentPageComponent } },
		parent: "app"
	}
];
