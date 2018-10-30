import { Ng2StateDeclaration } from "@uirouter/angular";
import {
	starkLoginStateName,
	starkLoginStateUrl,
	starkPreloadingStateName,
	starkPreloadingStateUrl,
	starkSessionExpiredStateName,
	starkSessionExpiredStateUrl,
	starkSessionLogoutStateName,
	starkSessionLogoutStateUrl
} from "@nationalbankbelgium/stark-core";
import {
	StarkLoginPageComponent,
	StarkPreloadingPageComponent,
	StarkSessionExpiredPageComponent,
	StarkSessionLogoutPageComponent
} from "./pages";

/**
 * States defined by Session-UI Module
 */
/* tslint:disable:no-duplicate-string */
export const SESSION_UI_STATES: Ng2StateDeclaration[] = [
	{
		name: starkLoginStateName, // the parent is defined in the state's name (contains a dot)
		url: starkLoginStateUrl,
		views: {
			"initOrExit@": {
				component: StarkLoginPageComponent
			}
		}
	},
	{
		name: starkPreloadingStateName, // the parent is defined in the state's name (contains a dot)
		url: starkPreloadingStateUrl,
		views: {
			"initOrExit@": {
				component: StarkPreloadingPageComponent
			}
		}
	},
	{
		name: starkSessionExpiredStateName, // the parent is defined in the state's name (contains a dot)
		url: starkSessionExpiredStateUrl,
		views: {
			"initOrExit@": {
				component: StarkSessionExpiredPageComponent
			}
		}
	},
	{
		name: starkSessionLogoutStateName, // the parent is defined in the state's name (contains a dot)
		url: starkSessionLogoutStateUrl,
		views: {
			"initOrExit@": {
				component: StarkSessionLogoutPageComponent
			}
		}
	}
];
