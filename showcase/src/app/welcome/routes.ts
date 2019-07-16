import { Ng2StateDeclaration } from "@uirouter/angular";
import {
	GettingStartedPageComponent,
	HomePageComponent,
	NewsPageComponent,
	NoContentPageComponent,
	DemoReactiveFormErrorsPageComponent
} from "./pages";

export const NEWS_STATES: Ng2StateDeclaration[] = [
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
		name: "getting-started",
		url: "^/getting-started",
		data: {
			translationKey: "SHOWCASE.GETTING_STARTED.TITLE"
		},
		views: { "@": { component: GettingStartedPageComponent } },
		parent: "app"
	},
	{
		name: "news",
		url: "^/news", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		data: {
			translationKey: "SHOWCASE.NEWS.TITLE"
		},
		views: { "@": { component: NewsPageComponent } },
		parent: "app"
	},
	{
		name: "reactive-form-errors",
		url: "^/form", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		data: {
			translationKey: "SHOWCASE.FORM.TITLE"
		},
		views: { "@": { component: DemoReactiveFormErrorsPageComponent } },
		parent: "app"
	},
	{
		name: "otherwise",
		url: "^/otherwise", // use ^ to avoid double slash "//" in the URL after the domain (https://github.com/angular-ui/ui-router/wiki/URL-Routing#absolute-routes-)
		data: {
			translationKey: "SHOWCASE.OTHERWISE.TITLE"
		},
		component: NoContentPageComponent,
		views: { "@": { component: NoContentPageComponent } },
		parent: "app"
	}
];
