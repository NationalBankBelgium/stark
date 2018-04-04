"use strict";

/**
 * Transition lifecycle hooks available in the router implementation
 * @link https://ui-router.github.io/ng1/docs/latest/interfaces/transition.ihookregistry.html
 */
export class StarkRoutingTransitionHook {
	public static ON_BEFORE: string = "ON_BEFORE";
	public static ON_START: string = "ON_START";
	public static ON_RETAIN: string = "ON_RETAIN";
	public static ON_ENTER: string = "ON_ENTER";
	public static ON_FINISH: string = "ON_FINISH";
	public static ON_EXIT: string = "ON_EXIT";
	public static ON_SUCCESS: string = "ON_SUCCESS";
	public static ON_ERROR: string = "ON_ERROR";
}
