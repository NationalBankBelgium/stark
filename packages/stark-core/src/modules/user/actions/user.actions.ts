import { createAction, props, union } from "@ngrx/store";
import { StarkUser } from "../entities";
import { StarkHttpErrorWrapper } from "../../http/entities/error";

/**
 * Key defined to find the service in a store
 */
const starkUserStoreKey = "StarkUser";

/**
 * Triggered when the fetchUserProfile() method is called, just before performing the HTTP to the REST API.
 */
export const fetchUserProfile = createAction(`[${starkUserStoreKey}] Get User`);

/**
 * Triggered when the user profile has been successfully fetched from the REST API.
 *
 * Parameter:
 *   - user - The user fetched from the REST API
 */
export const fetchUserProfileSuccess = createAction(`[${starkUserStoreKey}] Fetch User Profile Success`, props<{ user: StarkUser }>());

/**
 * Triggered when the user profile has been successfully fetched from the REST API.
 *
 * Parameter:
 *   - error - The error that caused the user fetching to fail.
 */
export const fetchUserProfileFailure = createAction(
	`[${starkUserStoreKey}] Fetch User Profile Failure`,
	props<{ error: StarkHttpErrorWrapper | Error }>()
);

/**
 * Triggered when the getAllUsers() method is called.
 * The getAllUsers() method should only be used in development.
 */
export const getAllUsers = createAction(`[${starkUserStoreKey}] Get All Users`);

/**
 * Triggered when the fetchUserProfile() method is called, just before performing the HTTP to the REST API.
 *
 * Parameter:
 *   - users - The users retrieved from the the mock data.
 */
export const getAllUsersSuccess = createAction(`[${starkUserStoreKey}] Get All Users Success`, props<{ users: StarkUser[] }>());

/**
 * Triggered when there are no users defined in the mock data.
 *
 * Parameter:
 *   - message - The message describing all the users failure.
 */
export const getAllUsersFailure = createAction(`[${starkUserStoreKey}] Get All Users Failure`, props<{ message: string }>());

/**
 * @ignore
 */
const all = union({
	fetchUserProfile,
	fetchUserProfileSuccess,
	fetchUserProfileFailure,
	getAllUsers,
	getAllUsersSuccess,
	getAllUsersFailure
});
export type Types = typeof all;
