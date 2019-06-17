import { StarkRBACAuthorizationService } from "@nationalbankbelgium/stark-rbac";
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the StarkRBACAuthorizationService interface.
 * @link StarkRBACAuthorizationService
 */
export class MockStarkRBACAuthorizationService implements SpyObj<StarkRBACAuthorizationService> {
	/**
	 * Method to be called right after the app initializes in order to get the necessary info to determine the permissions of the current user.
	 */
	public initializeService: SpyObj<StarkRBACAuthorizationService>["initializeService"] = createSpy("initializeService");

	/**
	 * Whether the current principal has the specified role.
	 */
	public hasRole: SpyObj<StarkRBACAuthorizationService>["hasRole"] = createSpy("hasRole");

	/**
	 * Whether the current principal has any of the supplied roles (given as an array of strings).
	 */
	public hasAnyRole: SpyObj<StarkRBACAuthorizationService>["hasAnyRole"] = createSpy("hasAnyRole");

	/**
	 * Whether the current principal is an anonymous user.
	 */
	public isAnonymous: SpyObj<StarkRBACAuthorizationService>["isAnonymous"] = createSpy("isAnonymous");
}
