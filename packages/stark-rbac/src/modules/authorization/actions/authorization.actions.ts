import { Action } from "@ngrx/store";

/**
 * Actions related to {@link StarkRBACAuthorizationService}
 */
export enum StarkRBACAuthorizationActionsTypes {
	RBAC_USER_NAVIGATION_UNAUTHORIZED = "[StarkRBAC] User navigation unauthorized",
	RBAC_USER_NAVIGATION_UNAUTHORIZED_REDIRECTED = "[StarkRBAC] User navigation unauthorized redirected"
}

/**
 * Action to be triggered when the user has navigated to a route that he is not authorized to.
 */
export class StarkUserNavigationUnauthorized implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED =
		StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED;

	/**
	 * Class constructor
	 * @param targetState - The state the user is navigating to.
	 */
	public constructor(public targetState: string) {}
}

/**
 * Action to be triggered when the user is redirected because he is not authorized to navigate to the original route.
 */
export class StarkUserNavigationUnauthorizedRedirected implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED_REDIRECTED =
		StarkRBACAuthorizationActionsTypes.RBAC_USER_NAVIGATION_UNAUTHORIZED_REDIRECTED;

	/**
	 * Class constructor
	 * @param targetState - The state the user is navigating to
	 * @param redirectionState - The redirection to be performed instead of the original navigation
	 */
	public constructor(public targetState: string, public redirectionState: string) {}
}
