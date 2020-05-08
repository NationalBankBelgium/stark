import { Action } from "@ngrx/store";
import { StarkProgressIndicatorFullConfig } from "../entities";

/**
 * Progress indicator action types enumeration
 */
export enum StarkProgressIndicatorActionTypes {
	PROGRESS_INDICATOR_REGISTER = "PROGRESS_INDICATOR_REGISTER",
	PROGRESS_INDICATOR_DEREGISTER = "PROGRESS_INDICATOR_DEREGISTER",
	PROGRESS_INDICATOR_HIDE = "PROGRESS_INDICATOR_HIDE",
	PROGRESS_INDICATOR_SHOW = "PROGRESS_INDICATOR_SHOW"
}

/**
 * Triggered by the {@link StarkProgressIndicatorService} register() method.
 */
export class StarkProgressIndicatorRegister implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_REGISTER =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_REGISTER;

	/**
	 * Class constructor
	 * @param progressIndicatorConfig - Configuration of the indicator
	 */
	public constructor(public progressIndicatorConfig: StarkProgressIndicatorFullConfig) {}
}

/**
 * Triggered by the {@link StarkProgressIndicatorService} deregister() method.
 */
export class StarkProgressIndicatorDeregister implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_DEREGISTER =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_DEREGISTER;

	/**
	 * Class constructor
	 * @param topic - The topic of the indicator
	 */
	public constructor(public topic: string) {}
}

/**
 * Triggered by the {@link StarkProgressIndicatorService} hide() method.
 */
export class StarkProgressIndicatorHide implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_HIDE =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_HIDE;

	/**
	 * Class constructor
	 * @param topic - The topic of the indicator
	 */
	public constructor(public topic: string) {}
}

/**
 * Triggered by the {@link StarkProgressIndicatorService} show() method.
 */
export class StarkProgressIndicatorShow implements Action {
	/**
	 * The type of action
	 */
	public readonly type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_SHOW =
		StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_SHOW;

	/**
	 * Class constructor
	 * @param topic - The topic of the indicator
	 */
	public constructor(public topic: string) {}
}

export type StarkProgressIndicatorActions =
	| StarkProgressIndicatorRegister
	| StarkProgressIndicatorDeregister
	| StarkProgressIndicatorHide
	| StarkProgressIndicatorShow;
