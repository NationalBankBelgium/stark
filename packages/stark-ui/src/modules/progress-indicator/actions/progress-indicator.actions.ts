import { StarkProgressIndicatorConfig } from "../entities";
import { Action } from "@ngrx/store";

/**
 * Progress indicator action types enumeration
 */
export enum StarkProgressIndicatorActionTypes {
	PROGRESS_INDICATOR_REGISTER = "PROGRESS_INDICATOR_REGISTER",
	PROGRESS_INDICATOR_DEREGISTER = "PROGRESS_INDICATOR_DEREGISTER",
	PROGRESS_INDICATOR_HIDE = "PROGRESS_INDICATOR_HIDE",
	PROGRESS_INDICATOR_SHOW = "PROGRESS_INDICATOR_SHOW"
}

export class StarkProgressIndicatorRegister implements Action {
	public payload: StarkProgressIndicatorConfig;
	/**
	 * The type of action
	 * @link StarkProgressIndicatorActionTypes
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_REGISTER =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_REGISTER;

	/**
	 * Class constructor
	 * @param starkProgressIndicatorConfig - configuration of the indicator
	 */
	public constructor(starkProgressIndicatorConfig: StarkProgressIndicatorConfig) {
		this.payload = starkProgressIndicatorConfig;
	}
}

export class StarkProgressIndicatorDeregister implements Action {
	public payload: string;

	/**
	 * The type of action
	 * @link StarkProgressIndicatorActionTypes
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_DEREGISTER =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_DEREGISTER;

	/**
	 * Class constructor
	 * @param topic - the topic of the indicator
	 */
	public constructor(topic: string) {
		this.payload = topic;
	}
}

export class StarkProgressIndicatorHide implements Action {
	public payload: string;

	/**
	 * The type of action
	 * @link StarkProgressIndicatorActionTypes
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_HIDE =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_HIDE;

	/**
	 * Class constructor
	 * @param topic - the topic of the indicator
	 */
	public constructor(topic: string) {
		this.payload = topic;
	}
}

export class StarkProgressIndicatorShow implements Action {
	public payload: string;
	/**
	 * The type of action
	 * @link StarkProgressIndicatorActionTypes
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_SHOW =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_SHOW;

	/**
	 * Class constructor
	 * @param topic - the topic of the indicator
	 */
	public constructor(topic: string) {
		this.payload = topic;
	}
}

export type StarkProgressIndicatorActions =
	| StarkProgressIndicatorRegister
	| StarkProgressIndicatorDeregister
	| StarkProgressIndicatorHide
	| StarkProgressIndicatorShow;
