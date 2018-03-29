"use strict";

import { StarkLogging, StarkLogMessageImpl, StarkLogMessageType } from "../entities/index";
import { loggingReducer } from "./logging.reducer";
import { SetApplicationId, LogMessage, FlushLogMessages } from "../actions/index";

const deepFreeze: Function = require("deep-freeze-strict");

describe("Reducer: LoggingReducer", () => {
	let starkLogging: StarkLogging;

	beforeEach(() => {
		starkLogging = { uuid: "dummyUuid", applicationId: "dummyAppId", messages: [] };
	});

	describe("on LOG_MESSAGE", () => {
		it("should add the given messages to the array when state given", () => {
			// create the initial state object
			const initialState: StarkLogging = starkLogging;
			initialState.messages = [
				new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message 1", ""),
				new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message 2", "")
			];

			expect(initialState.messages.length).toBe(2);

			deepFreeze(initialState); //Enforce immutability
			const changedState: StarkLogging = loggingReducer(
				initialState,
				new LogMessage(new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message N", ""))
			);

			expect(changedState.messages.length).toBe(3);
			expect(changedState.messages[0].message).toBe("Message 1");
			expect(changedState.messages[1].message).toBe("Message 2");
			expect(changedState.messages[2].message).toBe("Message N");
		});

		it("should add the given messages to the array even if the state is not defined", () => {
			const changedState: StarkLogging = loggingReducer(
				<any>undefined,
				new LogMessage(new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message N", ""))
			);

			expect(changedState.messages.length).toBe(1);
			expect(changedState.messages[0].message).toBe("Message N");
		});
	});

	describe("on FLUSH_LOG", () => {
		it("should remove from the log messages array the first X number of messages specified in the payload", () => {
			// create the initial state object
			const initialState: StarkLogging = starkLogging;
			initialState.messages = [
				new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message 1", ""),
				new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message 2", ""),
				new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message 3", ""),
				new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message 4", ""),
				new StarkLogMessageImpl(StarkLogMessageType.DEBUG, "Message 5", "")
			];

			expect(initialState.messages.length).toBe(5);

			deepFreeze(initialState); //Enforce immutability
			const changedState: StarkLogging = loggingReducer(initialState, new FlushLogMessages(3));

			expect(changedState.messages.length).toBe(2);
			expect(changedState.messages[0].message).toBe("Message 4");
			expect(changedState.messages[1].message).toBe("Message 5");
		});
	});

	describe("on LOGGING_SET_APPLICATION_ID", () => {
		it("should set the application id when state given", () => {
			// create the initial state object
			const initialState: StarkLogging = starkLogging;
			initialState.applicationId = "whatever";

			deepFreeze(initialState); //Enforce immutability
			const changedState: StarkLogging = loggingReducer(initialState, new SetApplicationId("new appID"));

			expect(changedState.applicationId).toBe("new appID");
		});
		it("should set the application id even if the state is not defined", () => {
			const changedState: StarkLogging = loggingReducer(<any>undefined, new SetApplicationId("new appID"));

			expect(changedState.applicationId).toBe("new appID");
		});
	});
});
