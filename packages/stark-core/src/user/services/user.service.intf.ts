"use strict";

import { Observable } from "rxjs/Observable";
import { StarkUser } from "../entities/index";

export const starkUserServiceName: string = "StarkUserService";

/**
 * Stark User Service.
 * Service to fetch the user profile from the REST API.
 * In Development, it can also be used to set the user profile manually.
 */
export interface StarkUserService {
	/**
	 * Returns the current user from the StarkSession object in the NGRX store
	 *
	 * @returns Observable that will emit the latest user available in the StarkSession
	 */
	getUser(): Observable<StarkUser | undefined>;

	/**
	 * Triggers an HTTP call to the REST API to fetch the user profile
	 *
	 * @returns Observable that will emit the user profile fetched from the REST API
	 */
	fetchUserProfile(): Observable<StarkUser>;

	/**
	 * Sets the current session's user profile (to be used only in development).
	 *
	 * @param user - The User profile to be set
	 */
	setUser(user: StarkUser): void;

	/**
	 * Gets all user profiles defined in the mock data (to be used only in development).
	 * This only makes sense during development, where user profiles and the profile selection screen are necessary
	 *
	 * @returns Observable that will emit the user profiles defined in the mock data
	 */
	getAllUsers(): StarkUser[];
}
