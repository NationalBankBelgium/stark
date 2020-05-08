/**
 * This class provides all the transition lifecycle hooks available in the router implementation.
 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html|UI-Router Transition IHookRegistry}
 */
export class StarkRoutingTransitionHook {
	/**
	 * Transition lifecycle hook invoked before a transition even begins.
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onbefore|UI-Router onBefore hook}
	 */
	public static ON_BEFORE = "ON_BEFORE";
	/**
	 * Transition lifecycle hook invoked as a transition starts running.
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onstart|UI-Router onStart hook}
	 */
	public static ON_START = "ON_START";
	/**
	 * Transition lifecycle hook invoked (during a transition) for a specific state that was previously active will remain active (is not being entered nor exited).
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onretain|UI-Router onRetain hook}
	 */
	public static ON_RETAIN = "ON_RETAIN";
	/**
	 * Transition lifecycle hook invoked (during a transition) when a specific state is being entered.
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onenter|UI-Router onEnter hook}
	 */
	public static ON_ENTER = "ON_ENTER";
	/**
	 * Transition lifecycle hook invoked just before a transition finishes. This hook is a last chance to cancel or redirect a transition.
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onfinish|UI-Router onFinish hook}
	 */
	public static ON_FINISH = "ON_FINISH";
	/**
	 * Transition lifecycle hook invoked (during a transition) when a specific state is being exited.
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onexit|UI-Router onExit hook}
	 */
	public static ON_EXIT = "ON_EXIT";
	/**
	 * Transition lifecycle hook invoked after a transition successfully completes.
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onsuccess|UI-Router onSuccess hook}
	 */
	public static ON_SUCCESS = "ON_SUCCESS";
	/**
	 * Transition lifecycle hook invoked after a transition has been rejected for any reason.
	 *
	 * See {@link https://ui-router.github.io/ng2/docs/latest/interfaces/transition.ihookregistry.html#onerror|UI-Router onError hook}
	 */
	public static ON_ERROR = "ON_ERROR";
}
