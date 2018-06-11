import { Action } from "@ngrx/store";
import { RawParams, TransitionOptions } from "@uirouter/core";

export enum StarkRoutingActionTypes {
	NAVIGATE = "[StarkRouting] Navigate",
	NAVIGATE_SUCCESS = "[StarkRouting] Navigate Success",
	NAVIGATE_FAILURE = "[StarkRouting] Navigate Failure",
	NAVIGATE_REJECTION = "[StarkRouting] Navigate Rejection",
	NAVIGATION_HISTORY_LIMIT_REACHED = "[StarkRouting] Navigation History Limit Reached",
	RELOAD = "[StarkRouting] Reload",
	RELOAD_SUCCESS = "[StarkRouting] Reload Success",
	RELOAD_FAILURE = "[StarkRouting] Reload Failure"
}

export class StarkNavigate implements Action {
	public readonly type: StarkRoutingActionTypes.NAVIGATE = StarkRoutingActionTypes.NAVIGATE;

	public constructor(
		public currentState: string,
		public newState: string,
		public params?: RawParams,
		public options?: TransitionOptions
	) {}
}

export class StarkNavigateSuccess implements Action {
	public readonly type: StarkRoutingActionTypes.NAVIGATE_SUCCESS = StarkRoutingActionTypes.NAVIGATE_SUCCESS;

	public constructor(public previousState: string, public currentState: string, public params?: RawParams) {}
}

export class StarkNavigateFailure implements Action {
	public readonly type: StarkRoutingActionTypes.NAVIGATE_FAILURE = StarkRoutingActionTypes.NAVIGATE_FAILURE;

	public constructor(public currentState: string, public newState: string, public params: RawParams, public error: string) {}
}

export class StarkNavigateRejection implements Action {
	public readonly type: StarkRoutingActionTypes.NAVIGATE_REJECTION = StarkRoutingActionTypes.NAVIGATE_REJECTION;

	public constructor(public currentState: string, public newState: string, public params: RawParams, public reason: string) {}
}

export class StarkNavigationHistoryLimitReached implements Action {
	public readonly type: StarkRoutingActionTypes.NAVIGATION_HISTORY_LIMIT_REACHED =
		StarkRoutingActionTypes.NAVIGATION_HISTORY_LIMIT_REACHED;
}

export class StarkReload implements Action {
	public readonly type: StarkRoutingActionTypes.RELOAD = StarkRoutingActionTypes.RELOAD;

	public constructor(public state: string) {}
}

export class StarkReloadSuccess implements Action {
	public readonly type: StarkRoutingActionTypes.RELOAD_SUCCESS = StarkRoutingActionTypes.RELOAD_SUCCESS;

	public constructor(public state: string, public params: RawParams) {}
}

export class StarkReloadFailure implements Action {
	public readonly type: StarkRoutingActionTypes.RELOAD_FAILURE = StarkRoutingActionTypes.RELOAD_FAILURE;

	public constructor(public state: string, public params: RawParams) {}
}

export type StarkRoutingActions =
	| StarkNavigate
	| StarkNavigateSuccess
	| StarkNavigateFailure
	| StarkNavigateRejection
	| StarkNavigationHistoryLimitReached
	| StarkReload
	| StarkReloadSuccess
	| StarkReloadFailure;
