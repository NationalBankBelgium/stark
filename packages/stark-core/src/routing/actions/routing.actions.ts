"use strict";

import { Action } from "@ngrx/store";
import { RawParams, TransitionOptions } from "@uirouter/core";

export enum StarkRoutingActionTypes {
	NAVIGATE = "NAVIGATE",
	NAVIGATE_SUCCESS = "NAVIGATE_SUCCESS",
	NAVIGATE_FAILURE = "NAVIGATE_FAILURE",
	NAVIGATE_REJECTION = "NAVIGATE_REJECTION",
	NAVIGATION_HISTORY_LIMIT_REACHED = "NAVIGATION_HISTORY_LIMIT_REACHED",
	RELOAD = "RELOAD",
	RELOAD_SUCCESS = "RELOAD_SUCCESS",
	RELOAD_FAILURE = "RELOAD_FAILURE"
}

export class Navigate implements Action {
	public readonly type: "NAVIGATE" = StarkRoutingActionTypes.NAVIGATE;
	public constructor(
		public currentState: string,
		public newState: string,
		public params?: RawParams,
		public options?: TransitionOptions
	) {}
}

export class NavigateSuccess implements Action {
	public readonly type: "NAVIGATE_SUCCESS" = StarkRoutingActionTypes.NAVIGATE_SUCCESS;
	public constructor(public previousState: string, public currentState: string, public params?: RawParams) {}
}

export class NavigateFailure implements Action {
	public readonly type: "NAVIGATE_FAILURE" = StarkRoutingActionTypes.NAVIGATE_FAILURE;
	public constructor(public currentState: string, public newState: string, public params: RawParams, public error: string) {}
}

export class NavigateRejection implements Action {
	public readonly type: "NAVIGATE_REJECTION" = StarkRoutingActionTypes.NAVIGATE_REJECTION;
	public constructor(public currentState: string, public newState: string, public params: RawParams, public reason: string) {}
}

export class NavigationHistoryLimitReached implements Action {
	public readonly type: "NAVIGATION_HISTORY_LIMIT_REACHED" = StarkRoutingActionTypes.NAVIGATION_HISTORY_LIMIT_REACHED;
}

export class Reload implements Action {
	public readonly type: "RELOAD" = StarkRoutingActionTypes.RELOAD;
	public constructor(public state: string) {}
}

export class ReloadSuccess implements Action {
	public readonly type: "RELOAD_SUCCESS" = StarkRoutingActionTypes.RELOAD_SUCCESS;
	public constructor(public state: string, public params: RawParams) {}
}

export class ReloadFailure implements Action {
	public readonly type: "RELOAD_FAILURE" = StarkRoutingActionTypes.RELOAD_FAILURE;
	public constructor(public state: string, public params: RawParams) {}
}

export type StarkRoutingActions =
	| Navigate
	| NavigateSuccess
	| NavigateFailure
	| NavigateRejection
	| NavigationHistoryLimitReached
	| Reload
	| ReloadSuccess
	| ReloadFailure;
