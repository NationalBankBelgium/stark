import { RawParams, TransitionOptions } from "@uirouter/core";
import { createAction, props, union } from "@ngrx/store";

/**
 * Key defined to find the service in a store
 */
const starkRoutingStoreKey = "StarkRouting";

/**
 * Triggered when the [StarkRoutingService navigateTo()]{@link StarkRoutingService#navigateTo} method is called, just before starting the navigation.
 *
 * Parameters:
 *   - currentState - Name of the current state before the navigation starts.
 *   - newState - Name of the state to be navigated to.
 *   - params - State params object to be passed to the navigated state.
 *   - options - Transition options object to change the behavior of the transition.
 */
export const navigate = createAction(
	`[${starkRoutingStoreKey}] Navigate`,
	props<{ currentState: string; newState: string; params?: RawParams; options?: TransitionOptions }>()
);

/**
 * Triggered when a navigation has succeeded and finished.
 *
 * This action is dispatched for any navigation, including those navigations triggered not by the [StarkRoutingService navigateTo()]{@link StarkRoutingService#navigateTo} method
 * but by any other mean such as [StarkRoutingService navigateToPrevious()]{@link StarkRoutingService#navigateToPrevious}, [StarkRoutingService navigateToHome()]{@link StarkRoutingService#navigateToHome},
 * [StarkRoutingService reload()]{@link StarkRoutingService#reload}, routing directives for menu links or by direct usage of the router library API.
 *
 * Parameters:
 *   - previousState - Name of the initial state where the navigation was started.
 *   - currentState - Name of the state that was navigated to.
 *   - params - State params object that was passed to the navigated state.
 */
export const navigateSuccess = createAction(
	`[${starkRoutingStoreKey}] Navigate Success`,
	props<{ previousState: string; currentState: string; params?: RawParams }>()
);

/**
 * Triggered when a navigation failed.
 *
 * This action is dispatched for any navigation, including those navigations triggered not by the [StarkRoutingService navigateTo()]{@link StarkRoutingService#navigateTo}
 * method but by any other mean such as menu links or by direct usage of the router library API.
 *
 * Parameters:
 *   - currentState - Name of the current state before the navigation started.
 *   - newState - Name of the state tried to be navigated to.
 *   - params - State params object passed to the navigated state.
 *   - error - The error describing the reason of the navigation failure.
 */
export const navigateFailure = createAction(
	`[${starkRoutingStoreKey}] Navigate Failure`,
	props<{ currentState: string; newState: string; params?: RawParams; error: string }>()
);

/**
 * Triggered when a navigation was intentionally rejected with a known rejection reason added via the
 * [StarkRoutingService addKnownNavigationRejectionCause()]{@link StarkRoutingService#addKnownNavigationRejectionCause} method.
 *
 * The custom logic to intentionally reject a transition can be normally be injected via a transition Hook by calling
 * the [StarkRoutingService addTransitionHook()]{@link StarkRoutingService#addTransitionHook} method.
 *
 * Parameters:
 *   - currentState - Name of the current state before the navigation started.
 *   - newState - Name of the state tried to be navigated to.
 *   - params - State params object passed to the navigated state.
 *   - reason - The reason describing why the navigation was rejected. This is normally a reason already known by the developer.
 */
export const navigateRejection = createAction(
	`[${starkRoutingStoreKey}] Navigate Rejection`,
	props<{ currentState: string; newState: string; params: RawParams; reason: string }>()
);

/**
 * Triggered when the [StarkRoutingService navigateToPrevious()]{@link StarkRoutingService#navigateToPrevious} method is called and there are no more
 * previous states in the history to navigate to.
 *
 * This action is just triggered in case the reload was done by calling the [StarkRoutingService reload()]{@link StarkRoutingService#reload} method.
 */
export const navigationHistoryLimitReached = createAction(`[${starkRoutingStoreKey}] Navigation History Limit Reached`);

/**
 * Triggered when the [StarkRoutingService reload()]{@link StarkRoutingService#reload} method is called, just before starting the state reloading.
 *
 * Parameter:
 *   - state - Name of the state to be reloaded.
 */
export const reload = createAction(`[${starkRoutingStoreKey}] Reload`, props<{ state: string }>());

/**
 * Triggered when a reload succeeded and finished.
 *
 * This action is dispatched for any navigation, including those navigations triggered not by the [StarkRoutingService navigateTo()]{@link StarkRoutingService#navigateTo}
 * method but by any other mean such as menu links or by direct usage of the router library API.
 *
 * Parameters:
 *   - state - Name of the state that was reloaded.
 *   - params - State params object passed to the reloaded state.
 */
export const reloadSuccess = createAction(`[${starkRoutingStoreKey}] Reload Success`, props<{ state: string; params: RawParams }>());

/**
 * Triggered when a reload succeeded and finished.
 *
 * This action is dispatched for any navigation, including those navigations triggered not by the [StarkRoutingService navigateTo()]{@link StarkRoutingService#navigateTo}
 * method but by any other mean such as menu links or by direct usage of the router library API.
 *
 * Parameters:
 *   - state - Name of the state that was reloaded.
 *   - params - State params object passed to the reloaded state.
 */
export const reloadFailure = createAction(`[${starkRoutingStoreKey}] Reload Failure`, props<{ state: string; params: RawParams }>());

/**
 * @ignore
 */
const all = union({
	navigate,
	navigateSuccess,
	navigateFailure,
	navigateRejection,
	navigationHistoryLimitReached,
	reload,
	reloadSuccess,
	reloadFailure
});
export type Types = typeof all;
