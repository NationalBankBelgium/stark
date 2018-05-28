import { Action } from "@ngrx/store";
import { StarkUser } from "../entities";
import { StarkHttpErrorWrapper } from "../../http/entities/error";

export enum StarkUserActionTypes {
	FETCH_USER_PROFILE = "[StarkUser] Get User",
	FETCH_USER_PROFILE_SUCCESS = "[StarkUser] Fetch User Profile Success",
	FETCH_USER_PROFILE_FAILURE = "[StarkUser] Fetch User Profile Failure",
	GET_ALL_USERS = "[StarkUser] Get All Users",
	GET_ALL_USERS_SUCCESS = "[StarkUser] Get All Users Success",
	GET_ALL_USERS_FAILURE = "[StarkUser] Get All Users Failure"
}

export class StarkFetchUserProfile implements Action {
	public readonly type: StarkUserActionTypes.FETCH_USER_PROFILE = StarkUserActionTypes.FETCH_USER_PROFILE;
}

export class StarkFetchUserProfileSuccess implements Action {
	public readonly type: StarkUserActionTypes.FETCH_USER_PROFILE_SUCCESS = StarkUserActionTypes.FETCH_USER_PROFILE_SUCCESS;

	public constructor(public user: StarkUser) {}
}

export class StarkFetchUserProfileFailure implements Action {
	public readonly type: StarkUserActionTypes.FETCH_USER_PROFILE_FAILURE = StarkUserActionTypes.FETCH_USER_PROFILE_FAILURE;

	public constructor(public error: StarkHttpErrorWrapper | Error) {}
}

export class StarkGetAllUsers implements Action {
	public readonly type: StarkUserActionTypes.GET_ALL_USERS = StarkUserActionTypes.GET_ALL_USERS;
}

export class StarkGetAllUsersSuccess implements Action {
	public readonly type: StarkUserActionTypes.GET_ALL_USERS_SUCCESS = StarkUserActionTypes.GET_ALL_USERS_SUCCESS;

	public constructor(public users: StarkUser[]) {}
}

export class StarkGetAllUsersFailure implements Action {
	public readonly type: StarkUserActionTypes.GET_ALL_USERS_FAILURE = StarkUserActionTypes.GET_ALL_USERS_FAILURE;

	public constructor(public message: string) {}
}

export type StarkUserActions =
	| StarkFetchUserProfile
	| StarkFetchUserProfileSuccess
	| StarkFetchUserProfileFailure
	| StarkGetAllUsers
	| StarkGetAllUsersSuccess
	| StarkGetAllUsersFailure;
