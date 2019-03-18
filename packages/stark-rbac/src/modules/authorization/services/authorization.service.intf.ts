import { InjectionToken } from "@angular/core";

/**
 * The name of the service
 */
export const starkRBACAuthorizationServiceName: string = "StarkRBACAuthorizationService";
/**
 * Injection Token version of the Service Name
 */
export const STARK_RBAC_AUTHORIZATION_SERVICE: InjectionToken<StarkRBACAuthorizationService> = new InjectionToken<
	StarkRBACAuthorizationService
>(starkRBACAuthorizationServiceName);

/**
 * Service to be used in order to know whether the user has an specific role or set of roles and whether it is an anonymous user.
 */
export interface StarkRBACAuthorizationService {
	/**
	 * Method to be called right after the app initializes in order to get the necessary info to determine the permissions of the current user.
	 * This method is called internally by the {@link StarkRBACAuthorizationModule}.
	 *
	 * **IMPORTANT:** In case you don't want to import the {@link StarkRBACAuthorizationModule} but you only want to define your own
	 * implementation of the StarkRBACAuthorizationService, make sure you call this method right after the app initializes.
	 */
	initializeService(): void;
	/**
	 * Whether the current principal has the specified role.
	 */
	hasRole(roleCode: string): boolean;

	/**
	 * Whether the current principal has any of the supplied roles (given as an array of strings).
	 */
	hasAnyRole(roleCodes: string[]): boolean;

	/**
	 * Whether the current principal is an anonymous user.
	 */
	isAnonymous(): boolean;
}
