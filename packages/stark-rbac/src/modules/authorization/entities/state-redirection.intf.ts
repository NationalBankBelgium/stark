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
 * Describes a function invoked passing the current {@link Transition} which should return the redirection to be performed by the Router.
 * This is handy in case the redirection will happen only on specific cases.
 */
export type StarkStateRedirectionFn = (transition: Transition) => StarkStateRedirection;
