import { Ng2StateDeclaration } from "@uirouter/angular";
import { NewsComponent } from "./news-component";

export const NEWS_STATES: Ng2StateDeclaration[] = [
	{
		name: "news",
		url: "^/news",
		views: { "@": { component: NewsComponent } },
		parent: "app"
	}
];
