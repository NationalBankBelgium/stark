import { Location } from "@angular/common";
import { StarkRoutingService, starkRoutingServiceName, StarkStateConfigWithParams } from "../../routing/services";
import { StatesModule } from "@uirouter/angular";

export const starkAppInitStateName: string = "starkAppInit";
export const starkAppExitStateName: string = "starkAppExit";

export const starkLoginStateName: string = "starkAppInit.starkLogin";
export const starkLoginStateUrl: string = "/starkLogin";

export const starkPreloadingStateName: string = "starkAppInit.starkPreloading";
export const starkPreloadingStateUrl: string = "/starkPreloading";

export const starkSessionExpiredStateName: string = "starkAppExit.starkSessionExpired";
export const starkSessionExpiredStateUrl: string = "/starkSessionExpired";

export const starkSessionLogoutStateName: string = "starkAppExit.starkSessionLogout";
export const starkSessionLogoutStateUrl: string = "/starkSessionLogout";

// FIXME Fix states declaration
export const starkCoreRouteConfig: StatesModule = <any>{
	states: [
		{
			name: starkAppInitStateName, // parent state for any initialization state (used to show/hide the main app component)
			abstract: true,
			resolve: {
				targetRoute: [
					"$location",
					starkRoutingServiceName,
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
