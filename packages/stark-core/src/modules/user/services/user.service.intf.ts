import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { StarkUser } from "../entities";

/**
 * @ignore
 */
export const starkUserServiceName = "StarkUserService";
/**
 * {@link https://v7.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkUserService}
 */
export const STARK_USER_SERVICE: InjectionToken<StarkUserService> = new InjectionToken<StarkUserService>(starkUserServiceName);

/**
 * Stark User Service.
 * Service to fetch the user profile from the REST API.
 * In Development, it can also be used to set the user profile manually and to retrieve a list of profiles from a mock data file.
 */
export interface StarkUserService {
	/**
	 * Triggers an HTTP call to the REST API to fetch the {@link StarkUser} profile
	 *
	 * @returns Observable that will emit the `StarkUser` profile fetched from the REST API
	 */
	fetchUserProfile(): Observable<StarkUser>;

	/**
	 * Gets all {@link StarkUser} profiles defined in the mock data (to be used only in development).
	 * This only makes sense during development, where user profiles and the profile selection screen are necessary
	 *
	 * @returns Observable that will emit the `StarkUser` profiles defined in the mock data
	 */
	getAllUsers(): StarkUser[];
}
