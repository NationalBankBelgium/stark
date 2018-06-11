import { Action } from "@ngrx/store";
import { StarkUser } from "../../user/entities";

export enum StarkSessionActionTypes {
	CHANGE_LANGUAGE = "[StarkSession] Change Language",
	CHANGE_LANGUAGE_SUCCESS = "[StarkSession] Change Language Success",
	CHANGE_LANGUAGE_FAILURE = "[StarkSession] Change Language Failure",
	INITIALIZE_SESSION = "[StarkSession] Initialize Session",
	INITIALIZE_SESSION_SUCCESS = "[StarkSession] Initialize Session Success",
	DESTROY_SESSION = "[StarkSession] Destroy Session",
	DESTROY_SESSION_SUCCESS = "[StarkSession] Destroy Session Success",
	SESSION_TIMEOUT_COUNTDOWN_START = "[StarkSession] Session Timeout Countdown Start",
	SESSION_TIMEOUT_COUNTDOWN_STOP = "[StarkSession] Session Timeout Countdown Stop",
	SESSION_TIMEOUT_COUNTDOWN_FINISH = "[StarkSession] Session Timeout Countdown Finish",
	SESSION_LOGOUT = "[StarkSession] Session Logout",
	USER_ACTIVITY_TRACKING_PAUSE = "[StarkSession] User Activity Tracking Pause",
	USER_ACTIVITY_TRACKING_RESUME = "[StarkSession] User Activity Tracking Resume"
}

export class StarkChangeLanguage implements Action {
	public readonly type: StarkSessionActionTypes.CHANGE_LANGUAGE = StarkSessionActionTypes.CHANGE_LANGUAGE;

	public constructor(public languageId: string) {}
}

export class StarkChangeLanguageSuccess implements Action {
	public readonly type: StarkSessionActionTypes.CHANGE_LANGUAGE_SUCCESS = StarkSessionActionTypes.CHANGE_LANGUAGE_SUCCESS;

	public constructor(public languageId: string) {}
}

export class StarkChangeLanguageFailure implements Action {
	public readonly type: StarkSessionActionTypes.CHANGE_LANGUAGE_FAILURE = StarkSessionActionTypes.CHANGE_LANGUAGE_FAILURE;

	public constructor(public error: any) {}
}

export class StarkInitializeSession implements Action {
	public readonly type: StarkSessionActionTypes.INITIALIZE_SESSION = StarkSessionActionTypes.INITIALIZE_SESSION;

	public constructor(public user: StarkUser) {}
}

export class StarkInitializeSessionSuccess implements Action {
	public readonly type: StarkSessionActionTypes.INITIALIZE_SESSION_SUCCESS = StarkSessionActionTypes.INITIALIZE_SESSION_SUCCESS;
}

export class StarkDestroySession implements Action {
	public readonly type: StarkSessionActionTypes.DESTROY_SESSION = StarkSessionActionTypes.DESTROY_SESSION;
}

export class StarkDestroySessionSuccess implements Action {
	public readonly type: StarkSessionActionTypes.DESTROY_SESSION_SUCCESS = StarkSessionActionTypes.DESTROY_SESSION_SUCCESS;
}

export class StarkSessionTimeoutCountdownStart implements Action {
	public readonly type: StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_START = StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_START;

	public constructor(public countdown: number) {}
}

export class StarkSessionTimeoutCountdownStop implements Action {
	public readonly type: StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_STOP = StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_STOP;
}

export class StarkSessionTimeoutCountdownFinish implements Action {
	public readonly type: StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_FINISH =
		StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_FINISH;
}

export class StarkSessionLogout implements Action {
	public readonly type: StarkSessionActionTypes.SESSION_LOGOUT = StarkSessionActionTypes.SESSION_LOGOUT;
}

export class StarkUserActivityTrackingPause implements Action {
	public readonly type: StarkSessionActionTypes.USER_ACTIVITY_TRACKING_PAUSE = StarkSessionActionTypes.USER_ACTIVITY_TRACKING_PAUSE;
}

export class StarkUserActivityTrackingResume implements Action {
	public readonly type: StarkSessionActionTypes.USER_ACTIVITY_TRACKING_RESUME = StarkSessionActionTypes.USER_ACTIVITY_TRACKING_RESUME;
}

export type StarkSessionActions =
	| StarkChangeLanguage
	| StarkChangeLanguageSuccess
	| StarkChangeLanguageFailure
	| StarkInitializeSession
	| StarkInitializeSessionSuccess
	| StarkDestroySession
	| StarkDestroySessionSuccess
	| StarkSessionTimeoutCountdownStart
	| StarkSessionTimeoutCountdownStop
	| StarkSessionTimeoutCountdownFinish
	| StarkSessionLogout
	| StarkUserActivityTrackingPause
	| StarkUserActivityTrackingResume;
