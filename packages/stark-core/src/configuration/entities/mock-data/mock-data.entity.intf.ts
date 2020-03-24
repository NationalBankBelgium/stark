import { InjectionToken } from "@angular/core";
import { StarkUser } from "../../../modules/user";

/**
 * {@link https://v7.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkMockData}
 */
export const STARK_MOCK_DATA: InjectionToken<StarkMockData> = new InjectionToken<StarkMockData>("STARK_MOCK_DATA");

/**
 * Mock data entity that describes how the mock data should look like when a developer wants to mock its backend data to be fetched via JSON Server
 */
export interface StarkMockData {
	/**
	 * Custom additional properties
	 */
	[key: string]: any;

	/**
	 * Array of `StarkUser` objects
	 */
	profiles?: StarkUser[];
}
