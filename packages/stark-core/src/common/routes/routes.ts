import { Location } from "@angular/common";
import { STARK_ROUTING_SERVICE, StarkRoutingService, StarkStateConfigWithParams } from "../../modules/routing/services";
import { StatesModule } from "@uirouter/angular";

/**
 * Name of the initialization states of the application
 */
export const starkAppInitStateName: string = "starkAppInit";
/**
 * Name of the exit states of the application
 */
export const starkAppExitStateName: string = "starkAppExit";
/**
 * Name of the login state of the application
 */
export const starkLoginStateName: string = "starkAppInit.starkLogin";
/**
 * URL of the login state of the application
 */
export const starkLoginStateUrl: string = "/starkLogin";
/**
 * Name of the preloading state of the application
 */
export const starkPreloadingStateName: string = "starkAppInit.starkPreloading";
/**
 * URL of the preloading state of the application
 */
export const starkPreloadingStateUrl: string = "/starkPreloading";
/**
 * Name of the SessionExpired state of the application
 */
export const starkSessionExpiredStateName: string = "starkAppExit.starkSessionExpired";
/**
 * URL of the SessionExpired state of the application
 */
export const starkSessionExpiredStateUrl: string = "/starkSessionExpired";
/**
 * Name of the SessionLogout state of the application
 */
export const starkSessionLogoutStateName: string = "starkAppExit.starkSessionLogout";
/**
 * URL of the SessionLogout state of the application
 */
export const starkSessionLogoutStateUrl: string = "/starkSessionLogout";

// FIXME Fix states declaration
/* tslint:disable:no-duplicate-string */
/**
 * Configuration of the route state of the application
 */
export const starkCoreRouteConfig: StatesModule = <any>{
	states: [
		{
			name: starkAppInitStateName, // parent state for any initialization state (used to show/hide the main app component)
			abstract: true,
			resolve: {
				targetRoute: [
					"$location",
					STARK_ROUTING_SERVICE,
					($location: Location, routingService: StarkRoutingService) => {
						// get the path of the current URL in the browser's navigation bar
						const targetUrlPath: string = $location.path();
						const targetRoute: StarkStateConfigWithParams | undefined = routingService.getStateConfigByUrlPath(targetUrlPath);

						// skip any init/exit state
						const initOrExitStateRegex: RegExp = new RegExp("(" + starkAppInitStateName + "|" + starkAppExitStateName + ")");

						if (targetRoute) {
							if ((<Function>targetRoute.state.$$state)().parent) {
								if (!(<Function>targetRoute.state.$$state)().parent.name.match(initOrExitStateRegex)) {
									return targetRoute;
								} else {
									return undefined;
								}
							} else {
								return targetRoute;
							}
						} else {
							return undefined;
						}
					}
				],
				targetState: [
					"targetRoute",
					(targetRoute: StarkStateConfigWithParams) => {
						return typeof targetRoute !== "undefined" ? targetRoute.state.name : undefined;
					}
				],
				targetStateParams: [
					"targetRoute",
					(targetRoute: StarkStateConfigWithParams) => {
						return typeof targetRoute !== "undefined" ? targetRoute.paramValues : undefined;
					}
				]
			}
		},
		{
			name: starkAppExitStateName, // parent state for any exit state (used to show/hide the main app component)
			abstract: true
		},
		{
			name: starkLoginStateName, // the parent is defined in the state's name (contains a dot)
			url: starkLoginStateUrl,
			views: {
				// TODO: how to use a constant instead of a hard-coded string? (without loading the component file to avoid circular dependencies!)
				"initOrExit@": "starkLoginPage"
			}
		},
		{
			name: starkPreloadingStateName, // the parent is defined in the state's name (contains a dot)
			url: starkPreloadingStateUrl,
			views: {
				"initOrExit@": "starkPreloadingPage"
			}
		},
		{
			name: starkSessionExpiredStateName, // the parent is defined in the state's name (contains a dot)
			url: starkSessionExpiredStateUrl,
			views: {
				"initOrExit@": "starkSessionExpiredPage"
			}
		},
		{
			name: starkSessionLogoutStateName, // the parent is defined in the state's name (contains a dot)
			url: starkSessionLogoutStateUrl,
			views: {
				"initOrExit@": "starkSessionLogoutPage"
			}
		}
	]
};
/* tslint:enable */
