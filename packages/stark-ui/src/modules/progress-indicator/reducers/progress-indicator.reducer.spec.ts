/* tslint:disable:completed-docs*/
import { progressIndicatorReducer } from "./progress-indicator.reducer";
import { StarkProgressIndicatorFullConfig, StarkProgressIndicatorFullConfigImpl, StarkProgressIndicatorType } from "../entities";
import { StarkProgressIndicatorActionTypes, StarkProgressIndicatorRegister } from "../actions";

const deepFreeze: Function = require("deep-freeze-strict");

describe("Reducer: ProgressIndicatorReducer", () => {
	let initialState: Map<string, StarkProgressIndicatorFullConfig>;
	let changedState: Map<string, StarkProgressIndicatorFullConfig>;
	let mockProgressIndicator: StarkProgressIndicatorFullConfig;

	beforeEach(() => {
		// create the initial state object
		initialState = new Map<string, StarkProgressIndicatorFullConfig>();
		changedState = new Map<string, StarkProgressIndicatorFullConfig>();
		mockProgressIndicator = new StarkProgressIndicatorFullConfigImpl("dummy", StarkProgressIndicatorType.SPINNER, false);
	});

	describe("on PROGRESS_INDICATOR_REGISTER", () => {
		it("should add the progressIndicator when state given", () => {
			deepFreeze(initialState); // Enforce immutability
			const config = mockProgressIndicator;
			deepFreeze(config); // Enforce immutability

			changedState = progressIndicatorReducer(initialState, new StarkProgressIndicatorRegister(config));
			expect(changedState.size).toBe(1);
			expect(changedState.get(mockProgressIndicator.topic)).toBe(mockProgressIndicator);
		});

		it("should add the progressIndicator when state not defined", () => {
			const config = mockProgressIndicator;
			deepFreeze(config); // Enforce immutability

			// Send the PROGRESS_INDICATOR_REGISTER action to the progressIndicatorReducer
			changedState = progressIndicatorReducer(<any>undefined, new StarkProgressIndicatorRegister(config));

			expect(changedState.size).toBe(1);
			expect(changedState.get(mockProgressIndicator.topic)).toBe(mockProgressIndicator);
		});
	});

	describe("on PROGRESS_INDICATOR_DEREGISTER", () => {
		it("should remove the progressIndicator when state given", () => {
			// create the initial state object
			initialState.set(mockProgressIndicator.topic, mockProgressIndicator);
			deepFreeze(initialState); // Enforce immutability
			const topic = mockProgressIndicator.topic;
			deepFreeze(topic); // Enforce immutability

			// Send the PROGRESS_INDICATOR_DEREGISTER action to the progressIndicatorReducer
			changedState = progressIndicatorReducer(initialState, {
				type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_DEREGISTER,
				topic
			});

			expect(changedState.size).toBe(0);
			expect(changedState.get(mockProgressIndicator.topic)).toBeUndefined();
		});

		it("should NOT remove any progressIndicator when state not defined", () => {
			const topic = mockProgressIndicator.topic;
			deepFreeze(topic); // Enforce immutability

			// Send the PROGRESS_INDICATOR_DEREGISTER action to the progressIndicatorReducer
			changedState = progressIndicatorReducer(<any>undefined, {
				type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_DEREGISTER,
				topic
			});

			expect(changedState.size).toBe(0);
			expect(changedState.get(mockProgressIndicator.topic)).toBeUndefined();
		});
	});

	describe("on PROGRESS_INDICATOR_SHOW", () => {
		it("should set the progressConfig 'visible' property to TRUE and 'pendingListenersCount' to 1 when state given", () => {
			// create the initial state object
			initialState.set(mockProgressIndicator.topic, mockProgressIndicator);
			deepFreeze(initialState); // Enforce immutability
			const topic = mockProgressIndicator.topic;
			deepFreeze(topic); // Enforce immutability

			// Send the PROGRESS_INDICATOR_SHOW action to the progressIndicatorReducer
			changedState = progressIndicatorReducer(initialState, {
				type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_SHOW,
				topic
			});

			expect(changedState.size).toBe(1);
			expect(changedState.has(mockProgressIndicator.topic)).toBe(true);
			const changedConfig = <StarkProgressIndicatorFullConfig>changedState.get(mockProgressIndicator.topic);
			expect(changedConfig.visible).toBe(true);
			expect(changedConfig.pendingListenersCount).toBe(1);
		});

		it("should NOT do anything when state not defined", () => {
			const topic = mockProgressIndicator.topic;
			deepFreeze(topic); // Enforce immutability

			// Send the PROGRESS_INDICATOR_SHOW action to the progressIndicatorReducer
			changedState = progressIndicatorReducer(<any>undefined, {
				type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_SHOW,
				topic
			});

			expect(changedState.size).toBe(0);
			expect(changedState.get(mockProgressIndicator.topic)).toBeUndefined();
		});
	});

	describe("on PROGRESS_INDICATOR_HIDE", () => {
		it("should set the progressConfig 'visible' property to FALSE and 'pendingListenersCount' to 0 when state given", () => {
			// create the initial state object
			mockProgressIndicator.visible = true;
			initialState.set(mockProgressIndicator.topic, mockProgressIndicator);
			deepFreeze(initialState); // Enforce immutability
			const topic = mockProgressIndicator.topic;
			deepFreeze(topic); // Enforce immutability

			// Send the PROGRESS_INDICATOR_HIDE action to the progressIndicatorReducer
			changedState = progressIndicatorReducer(initialState, {
				type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_HIDE,
				topic
			});

			expect(changedState.size).toBe(1);
			expect(changedState.has(mockProgressIndicator.topic)).toBe(true);
			const changedConfig = <StarkProgressIndicatorFullConfig>changedState.get(mockProgressIndicator.topic);
			expect(changedConfig.visible).toBe(false);
			expect(changedConfig.pendingListenersCount).toBe(0);
		});

		it("should NOT do anything when state not defined", () => {
			const topic = mockProgressIndicator.topic;
			deepFreeze(topic); // Enforce immutability

			// Send the PROGRESS_INDICATOR_HIDE action to the progressIndicatorReducer
			changedState = progressIndicatorReducer(<any>undefined, {
				type: StarkProgressIndicatorActionTypes.PROGRESS_INDICATOR_HIDE,
				topic
			});

			expect(changedState.size).toBe(0);
			expect(changedState.get(mockProgressIndicator.topic)).toBeUndefined();
		});
	});
});
