import { Ng2StateDeclaration } from "@uirouter/angular";
import { AppComponent } from "./app.component";

/**
 * Definition of all states of an application.
 */
export const APP_STATES: Ng2StateDeclaration[] = [
	{
		name: "app",
		url: "/",
		component: AppComponent
	}
];
