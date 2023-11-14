import { Ng2StateDeclaration } from "@uirouter/angular";
import { GettingStartedPageComponent, NewsPageComponent, ReactiveFormErrorsPageComponent } from "./pages";

export const NEWS_STATES: Ng2StateDeclaration[] = [
	{ name: "welcome", url: "^/welcome", abstract: true, parent: "app" },
	{
		name: "welcome.getting-started",
		url: "/getting-started",
		data: {
			translationKey: "SHOWCASE.GETTING_STARTED.TITLE"
		},
		views: { "@": { component: GettingStartedPageComponent } }
	},
	{
		name: "welcome.news",
		url: "/news",
		data: {
			translationKey: "SHOWCASE.NEWS.TITLE"
		},
		views: { "@": { component: NewsPageComponent } }
	},
	{
		name: "welcome.reactive-form-errors",
		url: "/reactive-form-errors",
		data: {
			translationKey: "SHOWCASE.NGX_FORM_ERRORS.TITLE"
		},
		views: { "@": { component: ReactiveFormErrorsPageComponent } }
	}
];
