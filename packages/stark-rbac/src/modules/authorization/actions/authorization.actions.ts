import { createAction, props, union } from "@ngrx/store";

/**
 * Action to be triggered when the user has navigated to a route that he is not authorized to.
 *
 * Parameter:
 *   - targetState - The state the user is navigating to
 */
export const userNavigationUnauthorized = createAction("[StarkRBAC] User navigation unauthorized", props<{ targetState: string }>());

/**
 * Action to be triggered when the user is redirected because he is not authorized to navigate to the original route.
 *
 * Parameters:
 *   - targetState - The state the user is navigating to
 *   - redirectionState - The redirection to be performed instead of the original navigation
 */
export const userNavigationUnauthorizedRedirected = createAction(
	"[StarkRBAC] User navigation unauthorized redirected",
	props<{ targetState: string; redirectionState: string }>()
);

/**
 * @ignore
 */
const all = union({ userNavigationUnauthorized, userNavigationUnauthorizedRedirected });
export type Types = typeof all;
