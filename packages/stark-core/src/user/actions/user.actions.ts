"use strict";

import { Action } from "@ngrx/store";
import { StarkUser } from "../entities/index";
import { StarkHttpErrorWrapper } from "../../http/entities/error/index";

export enum StarkUserActionTypes {
	FETCH_USER_PROFILE = "GET_USER",
	FETCH_USER_PROFILE_SUCCESS = "FETCH_USER_PROFILE_SUCCESS",
	FETCH_USER_PROFILE_FAILURE = "FETCH_USER_PROFILE_FAILURE",
	GET_ALL_USERS = "GET_ALL_USERS",
	GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS",
	GET_ALL_USERS_FAILURE = "GET_ALL_USERS_FAILURE",
	SET_USER = "SET_USER"
}

export class FetchUserProfile implements Action {
	public readonly type: "GET_USER" = StarkUserActionTypes.FETCH_USER_PROFILE;
}

export class FetchUserProfileSuccess implements Action {
	public readonly type: "FETCH_USER_PROFILE_SUCCESS" = StarkUserActionTypes.FETCH_USER_PROFILE_SUCCESS;

	public constructor(public user: StarkUser) {}
}

export class FetchUserProfileFailure implements Action {
	public readonly type: "FETCH_USER_PROFILE_FAILURE" = StarkUserActionTypes.FETCH_USER_PROFILE_FAILURE;

	public constructor(public error: StarkHttpErrorWrapper | Error) {}
}

export class GetAllUsers implements Action {
	public readonly type: "GET_ALL_USERS" = StarkUserActionTypes.GET_ALL_USERS;
}

export class GetAllUsersSuccess implements Action {
	public readonly type: "GET_ALL_USERS_SUCCESS" = StarkUserActionTypes.GET_ALL_USERS_SUCCESS;

	public constructor(public users: StarkUser[]) {}
}

export class GetAllUsersFailure implements Action {
	public readonly type: "GET_ALL_USERS_FAILURE" = StarkUserActionTypes.GET_ALL_USERS_FAILURE;

	public constructor(public message: string) {}
}

export class SetUser implements Action {
	public readonly type: "SET_USER" = StarkUserActionTypes.SET_USER;

	public constructor(public user: StarkUser) {}
}

export type StarkUserActions =
	| FetchUserProfile
	| FetchUserProfileSuccess
	| FetchUserProfileFailure
	| GetAllUsers
	| GetAllUsersSuccess
	| GetAllUsersFailure
	| SetUser;
