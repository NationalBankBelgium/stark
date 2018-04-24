import { Action } from "@ngrx/store";
import { StarkUser } from "../../user/entities/index";

export enum StarkSessionActionTypes {
	CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
	CHANGE_LANGUAGE_SUCCESS = "CHANGE_LANGUAGE_SUCCESS",
	CHANGE_LANGUAGE_FAILURE = "CHANGE_LANGUAGE_FAILURE",
	INITIALIZE_SESSION = "INITIALIZE_SESSION",
	INITIALIZE_SESSION_SUCCESS = "INITIALIZE_SESSION_SUCCESS",
	DESTROY_SESSION = "DESTROY_SESSION",
	DESTROY_SESSION_SUCCESS = "DESTROY_SESSION_SUCCESS",
	SESSION_TIMEOUT_COUNTDOWN_START = "SESSION_TIMEOUT_COUNTDOWN_START",
	SESSION_TIMEOUT_COUNTDOWN_STOP = "SESSION_TIMEOUT_COUNTDOWN_STOP",
	SESSION_TIMEOUT_COUNTDOWN_FINISH = "SESSION_TIMEOUT_COUNTDOWN_FINISH",
	SESSION_LOGOUT = "SESSION_LOGOUT",
	USER_ACTIVITY_TRACKING_PAUSE = "USER_ACTIVITY_TRACKING_PAUSE",
	USER_ACTIVITY_TRACKING_RESUME = "USER_ACTIVITY_TRACKING_RESUME"
}

export class ChangeLanguage implements Action {
	public readonly type: "CHANGE_LANGUAGE" = StarkSessionActionTypes.CHANGE_LANGUAGE;

	public constructor(public languageId: string) {}
}

export class ChangeLanguageSuccess implements Action {
	public readonly type: "CHANGE_LANGUAGE_SUCCESS" = StarkSessionActionTypes.CHANGE_LANGUAGE_SUCCESS;

	public constructor(public languageId: string) {}
}

export class ChangeLanguageFailure implements Action {
	public readonly type: "CHANGE_LANGUAGE_FAILURE" = StarkSessionActionTypes.CHANGE_LANGUAGE_FAILURE;

	public constructor(public error: any) {}
}

export class InitializeSession implements Action {
	public readonly type: "INITIALIZE_SESSION" = StarkSessionActionTypes.INITIALIZE_SESSION;

	public constructor(public user: StarkUser) {}
}

export class InitializeSessionSuccess implements Action {
	public readonly type: "INITIALIZE_SESSION_SUCCESS" = StarkSessionActionTypes.INITIALIZE_SESSION_SUCCESS;
}

export class DestroySession implements Action {
	public readonly type: "DESTROY_SESSION" = StarkSessionActionTypes.DESTROY_SESSION;
}

export class DestroySessionSuccess implements Action {
	public readonly type: "DESTROY_SESSION_SUCCESS" = StarkSessionActionTypes.DESTROY_SESSION_SUCCESS;
}

export class SessionTimeoutCountdownStart implements Action {
	public readonly type: "SESSION_TIMEOUT_COUNTDOWN_START" = StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_START;

	public constructor(public countdown: number) {}
}

export class SessionTimeoutCountdownStop implements Action {
	public readonly type: "SESSION_TIMEOUT_COUNTDOWN_STOP" = StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_STOP;
}

export class SessionTimeoutCountdownFinish implements Action {
	public readonly type: "SESSION_TIMEOUT_COUNTDOWN_FINISH" = StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_FINISH;
}

export class SessionLogout implements Action {
	public readonly type: "SESSION_LOGOUT" = StarkSessionActionTypes.SESSION_LOGOUT;
}

export class UserActivityTrackingPause implements Action {
	public readonly type: "USER_ACTIVITY_TRACKING_PAUSE" = StarkSessionActionTypes.USER_ACTIVITY_TRACKING_PAUSE;
}

export class UserActivityTrackingResume implements Action {
	public readonly type: "USER_ACTIVITY_TRACKING_RESUME" = StarkSessionActionTypes.USER_ACTIVITY_TRACKING_RESUME;
}

export type StarkSessionActions =
	| ChangeLanguage
	| ChangeLanguageSuccess
	| ChangeLanguageFailure
	| InitializeSession
	| InitializeSessionSuccess
	| DestroySession
	| DestroySessionSuccess
	| SessionTimeoutCountdownStart
	| SessionTimeoutCountdownStop
	| SessionTimeoutCountdownFinish
	| SessionLogout
	| UserActivityTrackingPause
	| UserActivityTrackingResume;
