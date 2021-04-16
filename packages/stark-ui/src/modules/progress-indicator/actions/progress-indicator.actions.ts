import { createAction, props, union } from "@ngrx/store";
import { StarkProgressIndicatorFullConfig } from "../entities";
import { starkProgressIndicatorStoreKey } from "../constants";

/**
 * Triggered by the {@link StarkProgressIndicatorService} register() method.
 *
 * Parameter:
 *   - progressIndicatorConfig - Configuration of the indicator
 */
export const register = createAction(
	`[${starkProgressIndicatorStoreKey}] Register`,
	props<{ progressIndicatorConfig: StarkProgressIndicatorFullConfig }>()
);

/**
 * Triggered by the {@link StarkProgressIndicatorService} deregister() method.
 *
 * Parameter:
 *   - topic - The topic of the indicator
 */
export const deregister = createAction(`[${starkProgressIndicatorStoreKey}] Deregister`, props<{ topic: string }>());

/**
 * Triggered by the {@link StarkProgressIndicatorService} hide() method.
 *
 * Parameter:
 *   - topic - The topic of the indicator
 */
export const hide = createAction(`[${starkProgressIndicatorStoreKey}] Hide`, props<{ topic: string }>());

/**
 * Triggered by the {@link StarkProgressIndicatorService} show() method.
 *
 * Parameter:
 *   - topic - The topic of the indicator
 */
export const show = createAction(`[${starkProgressIndicatorStoreKey}] Show`, props<{ topic: string }>());

/**
 * @ignore
 */
const all = union({ register, deregister, hide, show });
export type Types = typeof all;
