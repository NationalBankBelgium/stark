import { StarkRBACAuthorizationService } from "@nationalbankbelgium/stark-rbac";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkRBACAuthorizationService} interface.
 */
export class MockStarkRBACAuthorizationService implements SpyObj<StarkRBACAuthorizationService> {
	/**
	 * See [StarkRBACAuthorizationService initializeService()]{@link StarkRBACAuthorizationService#initializeService} method
	 */
	public initializeService: Spy<StarkRBACAuthorizationService["initializeService"]> = createSpy("initializeService");

	/**
	 * See [StarkRBACAuthorizationService hasRole()]{@link StarkRBACAuthorizationService#hasRole} method
	 */
	public hasRole: Spy<StarkRBACAuthorizationService["hasRole"]> = createSpy("hasRole");

	/**
	 * See [StarkRBACAuthorizationService hasAnyRole()]{@link StarkRBACAuthorizationService#hasAnyRole} method
	 */
	public hasAnyRole: Spy<StarkRBACAuthorizationService["hasAnyRole"]> = createSpy("hasAnyRole");

	/**
	 * See [StarkRBACAuthorizationService isAnonymous()]{@link StarkRBACAuthorizationService#isAnonymous} method
	 */
	public isAnonymous: Spy<StarkRBACAuthorizationService["isAnonymous"]> = createSpy("isAnonymous");
}
