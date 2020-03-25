import { StarkUserService } from "@nationalbankbelgium/stark-core";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;

/**
 * Mock class of the {@link StarkUserService} interface.
 */
export class MockStarkUserService implements SpyObj<StarkUserService> {
	/**
	 * See [StarkUserService fetchUserProfile()]{@link StarkUserService#fetchUserProfile} method
	 */
	public fetchUserProfile: Spy<StarkUserService["fetchUserProfile"]> = jasmine.createSpy("fetchUserProfile");

	/**
	 * See [StarkUserService getAllUsers()]{@link StarkUserService#getAllUsers} method
	 */
	public getAllUsers: Spy<StarkUserService["getAllUsers"]> = jasmine.createSpy("getAllUsers");
}
