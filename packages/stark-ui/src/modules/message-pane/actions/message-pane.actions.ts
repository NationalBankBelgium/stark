import { createAction, props, union } from "@ngrx/store";
import { StarkMessage } from "../../../common/message";

/**
 * @ignore
 */
const actionKey = "StarkMessagePane";

/**
 * Triggered when the addMessages() method is called.
 *
 * Parameter:
 *   - messages - The messages to add.
 */
export const addMessages = createAction(`[${actionKey}] Add Messages`, props<{ messages: StarkMessage[] }>());

/**
 * Triggered when the removeMessages() method is called.
 *
 * Parameter:
 *   - messages - The messages to remove.
 */
export const removeMessages = createAction(`[${actionKey}] Remove Messages`, props<{ messages: StarkMessage[] }>());

/**
 * Triggered when the clearMessages() method is called.
 */
export const clearMessages = createAction(`[${actionKey}] Clear Messages`);

/**
 * Triggered when the getAllMessages() method is called.
 */
export const getAllMessages = createAction(`[${actionKey}] Get All Messages`);

/**
 * @ignore
 */
const all = union({ addMessages, removeMessages, clearMessages, getAllMessages });
export type Types = typeof all;
