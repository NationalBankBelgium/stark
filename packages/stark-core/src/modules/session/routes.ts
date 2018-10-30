import { Location } from "@angular/common";
import { Transition, StateDeclaration, LazyLoadResult, RawParams } from "@uirouter/core";
import { loadNgModule, Ng2StateDeclaration, NgModuleToLoad } from "@uirouter/angular";
import { from, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { STARK_ROUTING_SERVICE, StarkRoutingService, StarkStateConfigWithParams } from "../routing/services";

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
export const starkLoginStateName: string = starkAppInitStateName + ".starkLogin";
/**
 * URL of the login state of the application
 */
export const starkLoginStateUrl: string = "/starkLogin";

/**
 * Name of the Preloading state of the application
 */
export const starkPreloadingStateName: string = starkAppInitStateName + ".starkPreloading";
/**
 * URL of the Preloading state of the application
 */
export const starkPreloadingStateUrl: string = "/starkPreloading";

/**
 * Name of the SessionExpired state of the application
 */
export const starkSessionExpiredStateName: string = starkAppExitStateName + ".starkSessionExpired";
/**
 * URL of the SessionExpired state of the application
 */
export const starkSessionExpiredStateUrl: string = "/starkSessionExpired";

/**
 * Name of the SessionLogout state of the application
 */
export const starkSessionLogoutStateName: string = starkAppExitStateName + ".starkSessionLogout";
/**
 * URL of the SessionLogout state of the application
 */
export const starkSessionLogoutStateUrl: string = "/starkSessionLogout";

/**
 * Configuration of the route state of the application
 */
export function resolveTargetRoute(
	$location: Location,
	$transition$: Transition,
	routingService: StarkRoutingService
): Promise<StarkStateConfigWithParams | undefined> {
	/**
	 * Get the corresponding registered state that matches with the given URL.
	 * If the state is part of a lazy loaded module, then such module is loaded first and then the URL is searched again to get the correct state
	 */
	function getTargetStateByUrl(targetUrl: string): StarkStateConfigWithParams | undefined {
		let targetState: StarkStateConfigWithParams | undefined = routingService.getStateConfigByUrlPath(targetUrl);

		// skip any init/exit state
		const initOrExitStateRegex: RegExp = new RegExp("(" + starkAppInitStateName + "|" + starkAppExitStateName + ")");

		if (
			targetState &&
			(<Function>targetState.state.$$state)().parent &&
			(<Function>targetState.state.$$state)().parent.name.match(initOrExitStateRegex)
		) {
			targetState = undefined;
		}

		return targetState;
	}

	// get the path of the current URL in the browser's navigation bar
	const targetUrlPath: string = $location.path();
	const targetRoute: StarkStateConfigWithParams | undefined = getTargetStateByUrl(targetUrlPath);
	let finalTargetRoute$: Observable<StarkStateConfigWithParams | undefined> = of(targetRoute);

	// in case the state is part of a module to load lazily, we need to load it and search the url again
	if (targetRoute && (<Function>targetRoute.state.$$state)().loadChildren) {
		// so we call the needed function to lazy load the module
		const moduleToLoad: NgModuleToLoad = (<Function>targetRoute.state.$$state)().loadChildren;
		const lazyLoadNgModule: (transition: Transition, stateObject: StateDeclaration) => Promise<LazyLoadResult> = loadNgModule(
			moduleToLoad
		);

		// once the module is loaded lazily, we search again for the right state and return the result
		finalTargetRoute$ = from(lazyLoadNgModule($transition$, targetRoute.state)).pipe(
			map((_lazyLoadResult: LazyLoadResult) => {
				return getTargetStateByUrl(targetUrlPath);
			})
		);
	}

	return finalTargetRoute$.toPromise();
}

/**
 * Check if targetRoute is defined and returns the name of the state OR undefined.
 * @param targetRoute - returned value of resolveTargetRoute method
 */
export function resolveTargetState(targetRoute?: StarkStateConfigWithParams): Promise<string | undefined> {
	return of(typeof targetRoute !== "undefined" ? targetRoute.state.name : undefined).toPromise();
}

/**
 * Check if targetRoute is defined and returns the params of the state OR undefined.
 * @param targetRoute - returned value of resolveTargetRoute method
 */
export function resolveTargetStateParams(targetRoute?: StarkStateConfigWithParams): Promise<RawParams | undefined> {
	return of(typeof targetRoute !== "undefined" ? targetRoute.paramValues : undefined).toPromise();
}

/**
 * States defined by Session Module
 */
export const SESSION_STATES: Ng2StateDeclaration[] = [
	{
		name: starkAppInitStateName, // parent state for any initialization state (used to show/hide the main app component)
		abstract: true,

		resolve: [
			{
				token: "targetRoute",
				deps: [Location, Transition, STARK_ROUTING_SERVICE],
				resolveFn: resolveTargetRoute
			},
			{
				token: "targetState",
				deps: ["targetRoute"],
				resolveFn: resolveTargetState
			},
			{
				token: "targetStateParams",
				deps: ["targetRoute"],
				resolveFn: resolveTargetStateParams
			}
		]
	},
	{
		name: starkAppExitStateName, // parent state for any exit state (used to show/hide the main app component)
		abstract: true
	}
];
