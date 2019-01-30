import { StarkProgressIndicatorConfig } from "../entities";
import { StarkProgressIndicatorActions, StarkProgressIndicatorActionTypes } from "../actions/progress-indicator.actions";

/**
 * @ignore
 */
const _cloneDeep: Function = require("lodash/cloneDeep");

/**
 * Initial state of the reducer
 */
const INITIAL_STATE: Map<string, StarkProgressIndicatorConfig> = new Map<string, StarkProgressIndicatorConfig>();

/**
 * Reducer for the progress indicator
 * @param Map<string, StarkProgressIndicatorConfig> the actual state of the progress indicator
 * @param StarkProgressIndicatorActions the action to perform
 * @returns Map<string, StarkProgressIndicatorConfig> the new state of the progress inidcator
 */
// TODO refactor to reduce complexity
// tslint:disable:cognitive-complexity
export function progressIndicatorReducer(
	state: Map<string, StarkProgressIndicatorConfig> = INITIAL_STATE,
	action: StarkProgressIndicatorActions
): Map<string, StarkProgressIndicatorConfig> {
	// the new state will be calculated from the data coming in the actions
	let newState: Map<string, StarkProgressIndicatorConfig> = _cloneDeep(state);

	let topic: string;

	switch (action.type) {
		case StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_REGISTER:
			const payload: StarkProgressIndicatorConfig = action.payload;
			topic = payload.topic;

			if (newState.has(topic)) {
				const progressIndicatorConfig: StarkProgressIndicatorConfig = _cloneDeep(<StarkProgressIndicatorConfig>newState.get(topic));
				progressIndicatorConfig.listenersCount = <number>progressIndicatorConfig.listenersCount + 1;
				newState = newState.set(topic, progressIndicatorConfig);
			} else {
				newState = newState.set(topic, payload);
			}

			return newState;

		case StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_DEREGISTER:
			topic = action.payload;

			if (newState.has(topic)) {
				const progressIndicatorConfig: StarkProgressIndicatorConfig = _cloneDeep(<StarkProgressIndicatorConfig>newState.get(topic));

				progressIndicatorConfig.listenersCount = <number>progressIndicatorConfig.listenersCount - 1;

				if (progressIndicatorConfig.listenersCount === 0) {
					newState.delete(topic);
				} else {
					newState = newState.set(topic, progressIndicatorConfig);
				}
			}

			return newState;

		case StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_SHOW:
			topic = action.payload;

			if (newState.has(topic)) {
				const progressIndicatorConfig: StarkProgressIndicatorConfig = _cloneDeep(<StarkProgressIndicatorConfig>newState.get(topic));
				progressIndicatorConfig.visible = true;
				progressIndicatorConfig.pendingListenersCount = <number>progressIndicatorConfig.pendingListenersCount + 1;
				newState = newState.set(topic, progressIndicatorConfig);
			}

			return newState;

		case StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_HIDE:
			topic = action.payload;

			if (newState.has(topic)) {
				const progressIndicatorConfig: StarkProgressIndicatorConfig = _cloneDeep(<StarkProgressIndicatorConfig>newState.get(topic));

				if (<number>progressIndicatorConfig.pendingListenersCount > 0) {
					progressIndicatorConfig.pendingListenersCount = <number>progressIndicatorConfig.pendingListenersCount - 1;
				}

				if (<number>progressIndicatorConfig.pendingListenersCount === 0) {
					progressIndicatorConfig.visible = false;
				}

				newState = newState.set(topic, progressIndicatorConfig);
			}

			return newState;

		default:
			return state;
	}
}
