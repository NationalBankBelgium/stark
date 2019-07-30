import { StarkUserService } from "@nationalbankbelgium/stark-core";
import SpyObj = jasmine.SpyObj;

/**
 * @ignore
 */
export class MockStarkUserService implements SpyObj<StarkUserService> {
	public fetchUserProfile: SpyObj<StarkUserService>["fetchUserProfile"] = jasmine.createSpy("fetchUserProfile");
	public getAllUsers: SpyObj<StarkUserService>["getAllUsers"] = jasmine.createSpy("getAllUsers");
}
