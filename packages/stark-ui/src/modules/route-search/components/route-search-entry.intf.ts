/**
 * Route Search Entry that will be displayed by the route search component
 */
export interface StarkRouteSearchEntry {
	/**
	 * Text to be displayed
	 */
	label: string;

	/**
	 * Name of the Router state that will be navigated to
	 */
	targetState: string;

	/**
	 * Params object to be passed to the Router state defined as targetState.
	 */
	targetStateParams?: { [param: string]: any };
}
