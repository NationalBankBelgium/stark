import { Transition } from "@uirouter/core";

/**
 * Defines a redirection to be performed by the Router
 */
export interface StarkStateRedirection {
	/**
	 * The target state to redirect to.
	 */
	stateName: string;
	/**
	 * The parameters to be passed to the redirection state.
	 */
	params?: object;
}

/**
 * Describes a function invoked passing the current {@link https://ui-router.github.io/ng2/docs/latest/classes/transition.transition-1.html|Transition} which should return the redirection to be performed by the Router.
 * This comes in hand in case the redirection should happen only in specific cases.
 */
export type StarkStateRedirectionFn = (transition: Transition) => StarkStateRedirection;
