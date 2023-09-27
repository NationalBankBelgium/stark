import { StarkProgressIndicatorFullConfig } from "../entities";
import { StarkProgressIndicatorActions } from "../actions";
import cloneDeep from "lodash-es/cloneDeep";
import { createReducer, on } from "@ngrx/store";

/**
 * Initial state of the reducer
 */
const INITIAL_PROGRESS_INDICATOR_STATE: Map<string, StarkProgressIndicatorFullConfig> = new Map<string, StarkProgressIndicatorFullConfig>();

/**
 * Definition of the reducer using `createReducer` method.
 */
const reducer = createReducer<Map<string, StarkProgressIndicatorFullConfig>, StarkProgressIndicatorActions.Types>(
	INITIAL_PROGRESS_INDICATOR_STATE,
	// on(StarkProgressIndicatorActions.register || StarkProgressIndicatorActions.deregister || StarkProgressIndicatorActions.show || StarkProgressIndicatorActions.hide, (state) => cloneDeep(state)),
	on(StarkProgressIndicatorActions.register, (_state, action) => {
		// the new state will be calculated from the data coming in the actions
		let state = cloneDeep(_state);
		const topic = action.progressIndicatorConfig.topic;

		if (state.has(topic)) {
			const progressIndicatorConfig = cloneDeep(<StarkProgressIndicatorFullConfig>state.get(topic));
			progressIndicatorConfig.listenersCount = <number>progressIndicatorConfig.listenersCount + 1;
			state = state.set(topic, progressIndicatorConfig);
		} else {
			state = state.set(topic, action.progressIndicatorConfig);
		}

		return state;
	}),
	on(StarkProgressIndicatorActions.deregister, (_state, action) => {
		// the new state will be calculated from the data coming in the actions
		let state = cloneDeep(_state);
		const topic = action.topic;

		if (state.has(topic)) {
			const progressIndicatorConfig = cloneDeep(<StarkProgressIndicatorFullConfig>state.get(topic));
			progressIndicatorConfig.listenersCount = <number>progressIndicatorConfig.listenersCount - 1;

			if (progressIndicatorConfig.listenersCount === 0) {
				state.delete(topic);
			} else {
				state = state.set(topic, progressIndicatorConfig);
			}
		}

		return state;
	}),
	on(StarkProgressIndicatorActions.show, (_state, action) => {
		// the new state will be calculated from the data coming in the actions
		let state = cloneDeep(_state);
		const topic = action.topic;

		if (state.has(topic)) {
			const progressIndicatorConfig = cloneDeep(<StarkProgressIndicatorFullConfig>state.get(topic));
			progressIndicatorConfig.visible = true;
			progressIndicatorConfig.pendingListenersCount = <number>progressIndicatorConfig.pendingListenersCount + 1;
			state = state.set(topic, progressIndicatorConfig);
		}

		return state;
	}),
	on(StarkProgressIndicatorActions.hide, (_state, action) => {
		// the new state will be calculated from the data coming in the actions
		let state = cloneDeep(_state);
		const topic = action.topic;

		if (state.has(topic)) {
			const progressIndicatorConfig = cloneDeep(<StarkProgressIndicatorFullConfig>state.get(topic));

			if (<number>progressIndicatorConfig.pendingListenersCount > 0) {
				progressIndicatorConfig.pendingListenersCount = <number>progressIndicatorConfig.pendingListenersCount - 1;
			}

			if (<number>progressIndicatorConfig.pendingListenersCount === 0) {
				progressIndicatorConfig.visible = false;
			}

			state = state.set(topic, progressIndicatorConfig);
		}

		return state;
	})
);

/**
 * Reducer for the progress indicator
 * @param state - Map<string, StarkProgressIndicatorFullConfig> the actual state of the progress indicator
 * @param action - StarkProgressIndicatorActions the action to perform
 * @returns Map<string, StarkProgressIndicatorFullConfig> the new state of the progress indicator
 */
export function progressIndicatorReducer(
	state: Map<string, StarkProgressIndicatorFullConfig> | undefined,
	action: StarkProgressIndicatorActions.Types
): Map<string, StarkProgressIndicatorFullConfig> {
	return reducer(state, action);
}
