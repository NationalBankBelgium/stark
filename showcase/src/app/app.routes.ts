import { HomeComponent } from "./home";
import { NoContentComponent } from "./no-content";
import { Ng2StateDeclaration } from "@uirouter/angular";

export const APP_STATES: Ng2StateDeclaration[] = [
	{ name: "index", url: "/", component: HomeComponent },
	{ name: "home", url: "/home", component: HomeComponent },
	{ name: "otherwise", url: "/otherwise", component: NoContentComponent }
];
