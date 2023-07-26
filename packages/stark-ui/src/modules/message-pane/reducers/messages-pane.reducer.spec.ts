import { StarkMessage, StarkMessageType } from "../../../common/message";

import { StarkMessagePaneActions } from "../actions";
import { StarkMessageCollection } from "../entities";

import { messagesReducer } from "./messages-pane.reducer";

const deepFreeze: Function = require("deep-freeze-strict");

const mockInfoMessage: StarkMessage = {
	id: "3",
	key: "MESSAGES.INFOS.DUMMY",
	code: "1234",
	type: StarkMessageType.INFO
};
const mockWarningMessage: StarkMessage = {
	id: "2",
	key: "MESSAGES.WARNINGS.DUMMY",
	code: "4321",
	type: StarkMessageType.WARNING
};
const mockErrorMessage: StarkMessage = {
	id: "1",
	key: "MESSAGES.ERRORS.DUMMY",
	code: "0159",
	type: StarkMessageType.ERROR
};

function createMessage(id: string, priority: number, messageType: StarkMessageType): StarkMessage {
	return {
		id: id,
		key: "MESSAGES.INFOS.DUMMY",
		code: "Some Code",
		type: messageType,
		priority: priority
	};
}

describe("Reducer: MessagesReducer", () => {
	let initialState: StarkMessageCollection;
	let changedState: StarkMessageCollection;

	beforeEach(() => {
		// create the initial state object
		initialState = {
			infoMessages: [],
			warningMessages: [],
			errorMessages: []
		};
	});

	describe("on ADD_MESSAGES", () => {
		let mockMessages: StarkMessage[];

		beforeEach(() => {
			mockMessages = [mockInfoMessage, mockWarningMessage, mockErrorMessage];
		});

		it("should add the messages when state given", () => {
			deepFreeze(initialState); // Enforce immutability
			deepFreeze(mockMessages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(initialState, StarkMessagePaneActions.addMessages({ messages: mockMessages }));

			expect(changedState.infoMessages.length).toBe(1);
			expect(changedState.infoMessages[0]).toBe(mockInfoMessage);
			expect(changedState.warningMessages.length).toBe(1);
			expect(changedState.warningMessages[0]).toBe(mockWarningMessage);
			expect(changedState.errorMessages.length).toBe(1);
			expect(changedState.errorMessages[0]).toBe(mockErrorMessage);
		});

		it("should add the messages when state not defined", () => {
			deepFreeze(mockMessages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(<any>undefined, StarkMessagePaneActions.addMessages({ messages: mockMessages }));

			expect(changedState.infoMessages.length).toBe(1);
			expect(changedState.infoMessages[0]).toBe(mockInfoMessage);
			expect(changedState.warningMessages.length).toBe(1);
			expect(changedState.warningMessages[0]).toBe(mockWarningMessage);
			expect(changedState.errorMessages.length).toBe(1);
			expect(changedState.errorMessages[0]).toBe(mockErrorMessage);
		});

		it("should update the state only for those arrays of messages that are affected and leave the current state of the others", () => {
			initialState.warningMessages.push(mockWarningMessage);

			mockMessages = [mockInfoMessage, mockErrorMessage];

			deepFreeze(initialState); // Enforce immutability
			deepFreeze(mockMessages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(initialState, StarkMessagePaneActions.addMessages({ messages: mockMessages }));

			expect(changedState.infoMessages).not.toBe(initialState.infoMessages);
			expect(changedState.infoMessages.length).toBe(1);
			expect(changedState.infoMessages[0]).toBe(mockInfoMessage);
			expect(changedState.errorMessages).not.toBe(initialState.errorMessages);
			expect(changedState.errorMessages.length).toBe(1);
			expect(changedState.errorMessages[0]).toBe(mockErrorMessage);
			expect(changedState.warningMessages).toBe(initialState.warningMessages);
			expect(changedState.warningMessages.length).toBe(1);
			expect(changedState.warningMessages[0]).toBe(mockWarningMessage);
		});

		it("should throw in case one of the messages to be added is of an unknown type", () => {
			const mockUnknownMessage: StarkMessage = {
				id: "1",
				key: "MESSAGES.ERRORS.DUMMY",
				code: "0159",
				type: <any>"unknown type"
			};

			mockMessages = [mockInfoMessage, mockErrorMessage, mockUnknownMessage];

			deepFreeze(mockMessages); // Enforce immutability

			deepFreeze(initialState); // Enforce immutability
			expect(() => messagesReducer(initialState, StarkMessagePaneActions.addMessages({ messages: mockMessages }))).toThrowError(
				/Unknown/
			);
		});

		it("should create an array with 1 message when the first message is added", () => {
			const newMessage: StarkMessage = createMessage("1", 1, StarkMessageType.INFO);
			const messages: StarkMessage[] = [newMessage];

			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(initialState, StarkMessagePaneActions.addMessages({ messages: messages }));

			expect(changedState.infoMessages.length).toBe(1);
			expect(changedState.infoMessages[0]).toBe(newMessage);
		});
	});

	describe("on ADD_MESSAGES order by priority", () => {
		let testBaseState: StarkMessageCollection;

		const infoMessage1: StarkMessage = createMessage("1", 10, StarkMessageType.INFO);
		const infoMessage2: StarkMessage = createMessage("2", 20, StarkMessageType.INFO);
		const infoMessage3: StarkMessage = createMessage("3", 20, StarkMessageType.INFO);
		const infoMessage4: StarkMessage = createMessage("4", 50, StarkMessageType.INFO);

		beforeEach(() => {
			const messages: StarkMessage[] = [
				infoMessage1,
				infoMessage3, // adding infoMessage3 before infoMessage3 so that in the resulting array
				infoMessage2, // they are in the logical order 1, 2, 3, 4 (newest message first)
				infoMessage4
			];

			deepFreeze(initialState); // Enforce immutability
			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			testBaseState = messagesReducer(initialState, StarkMessagePaneActions.addMessages({ messages: messages }));

			deepFreeze(testBaseState); // Enforce immutability
		});

		it("should put the message with priority 1 before the existing messages", () => {
			const newMessage: StarkMessage = createMessage("100", 1, StarkMessageType.INFO);
			const messages: StarkMessage[] = [newMessage];

			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(testBaseState, StarkMessagePaneActions.addMessages({ messages: messages }));

			expect(changedState.infoMessages.length).toBe(5);
			expect(changedState.infoMessages[0]).toBe(newMessage);
			expect(changedState.infoMessages[1]).toBe(infoMessage1);
			expect(changedState.infoMessages[2]).toBe(infoMessage2);
			expect(changedState.infoMessages[3]).toBe(infoMessage3);
			expect(changedState.infoMessages[4]).toBe(infoMessage4);
		});

		it("should put the message with priority 10 " + "before the existing message with priority 10", () => {
			const newMessage: StarkMessage = createMessage("100", 10, StarkMessageType.INFO);
			const messages: StarkMessage[] = [newMessage];

			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(testBaseState, StarkMessagePaneActions.addMessages({ messages: messages }));

			expect(changedState.infoMessages.length).toBe(5);
			expect(changedState.infoMessages[0]).toBe(newMessage);
			expect(changedState.infoMessages[1]).toBe(infoMessage1);
			expect(changedState.infoMessages[2]).toBe(infoMessage2);
			expect(changedState.infoMessages[3]).toBe(infoMessage3);
			expect(changedState.infoMessages[4]).toBe(infoMessage4);
		});

		it("should put the message with priority 20 after the message with 10 and as the first message with priority 20", () => {
			const newMessage: StarkMessage = createMessage("100", 20, StarkMessageType.INFO);
			const messages: StarkMessage[] = [newMessage];

			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(testBaseState, StarkMessagePaneActions.addMessages({ messages: messages }));

			expect(changedState.infoMessages.length).toBe(5);
			expect(changedState.infoMessages[0]).toBe(infoMessage1);
			expect(changedState.infoMessages[1]).toBe(newMessage);
			expect(changedState.infoMessages[2]).toBe(infoMessage2);
			expect(changedState.infoMessages[3]).toBe(infoMessage3);
			expect(changedState.infoMessages[4]).toBe(infoMessage4);
		});

		it("should put priority 40 between 20 and 50", () => {
			const newMessage: StarkMessage = createMessage("100", 40, StarkMessageType.INFO);
			const messages: StarkMessage[] = [newMessage];

			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(testBaseState, StarkMessagePaneActions.addMessages({ messages: messages }));

			expect(changedState.infoMessages.length).toBe(5);
			expect(changedState.infoMessages[0]).toBe(infoMessage1);
			expect(changedState.infoMessages[1]).toBe(infoMessage2);
			expect(changedState.infoMessages[2]).toBe(infoMessage3);
			expect(changedState.infoMessages[3]).toBe(newMessage);
			expect(changedState.infoMessages[4]).toBe(infoMessage4);
		});

		it("should put priority 50 before the existing 50", () => {
			const newMessage: StarkMessage = createMessage("100", 50, StarkMessageType.INFO);
			const messages: StarkMessage[] = [newMessage];

			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(testBaseState, StarkMessagePaneActions.addMessages({ messages: messages }));

			expect(changedState.infoMessages.length).toBe(5);
			expect(changedState.infoMessages[0]).toBe(infoMessage1);
			expect(changedState.infoMessages[1]).toBe(infoMessage2);
			expect(changedState.infoMessages[2]).toBe(infoMessage3);
			expect(changedState.infoMessages[3]).toBe(newMessage);
			expect(changedState.infoMessages[4]).toBe(infoMessage4);
		});

		it("should put the highest priority last", () => {
			const newMessage: StarkMessage = createMessage("100", 60, StarkMessageType.INFO);
			const messages: StarkMessage[] = [newMessage];

			deepFreeze(messages); // Enforce immutability

			// Send the ADD_MESSAGES action to the messagesReducer
			changedState = messagesReducer(testBaseState, StarkMessagePaneActions.addMessages({ messages: messages }));

			expect(changedState.infoMessages.length).toBe(5);
			expect(changedState.infoMessages[0]).toBe(infoMessage1);
			expect(changedState.infoMessages[1]).toBe(infoMessage2);
			expect(changedState.infoMessages[2]).toBe(infoMessage3);
			expect(changedState.infoMessages[3]).toBe(infoMessage4);
			expect(changedState.infoMessages[4]).toBe(newMessage);
		});
	});

	describe("on REMOVE_MESSAGES", () => {
		let mockMessages: StarkMessage[];

		beforeEach(() => {
			initialState = {
				infoMessages: [mockInfoMessage],
				warningMessages: [mockWarningMessage],
				errorMessages: [mockErrorMessage]
			};

			mockMessages = [mockInfoMessage, mockWarningMessage, mockErrorMessage];
		});

		it("should remove the messages when state given", () => {
			deepFreeze(initialState); // Enforce immutability
			deepFreeze(mockMessages); // Enforce immutability

			// Send the REMOVE_MESSAGES action to the messagesReducer
			changedState = messagesReducer(initialState, StarkMessagePaneActions.removeMessages({ messages: mockMessages }));

			expect(changedState.infoMessages.length).toBe(0);
			expect(changedState.warningMessages.length).toBe(0);
			expect(changedState.errorMessages.length).toBe(0);
		});

		it("should NOT remove any message when state not defined", () => {
			deepFreeze(mockMessages); // Enforce immutability

			// Send the CLEAR_MESSAGES action to the messagesReducer
			changedState = messagesReducer(<any>undefined, StarkMessagePaneActions.removeMessages({ messages: mockMessages }));

			expect(changedState).toBeDefined();
			expect(changedState.infoMessages.length).toBe(0);
			expect(changedState.warningMessages.length).toBe(0);
			expect(changedState.errorMessages.length).toBe(0);
		});

		it("should update the state only for those arrays of messages that are affected and leave the current state of the others", () => {
			mockMessages = [mockInfoMessage, mockErrorMessage];

			deepFreeze(initialState); // Enforce immutability
			deepFreeze(mockMessages); // Enforce immutability

			// Send the REMOVE_MESSAGES action to the messagesReducer
			changedState = messagesReducer(initialState, StarkMessagePaneActions.removeMessages({ messages: mockMessages }));

			expect(changedState.infoMessages).not.toBe(initialState.infoMessages);
			expect(changedState.infoMessages.length).toBe(0);
			expect(changedState.errorMessages).not.toBe(initialState.errorMessages);
			expect(changedState.errorMessages.length).toBe(0);
			expect(changedState.warningMessages).toBe(initialState.warningMessages);
			expect(changedState.warningMessages.length).toBe(1);
			expect(changedState.warningMessages[0]).toBe(mockWarningMessage);
		});

		it("should throw in case one of the messages to be removed is of an unknown type", () => {
			const mockUnknownMessage: StarkMessage = {
				id: "1",
				key: "MESSAGES.ERRORS.DUMMY",
				code: "0159",
				type: <any>"unknown type"
			};

			mockMessages = [mockInfoMessage, mockErrorMessage, mockUnknownMessage];

			deepFreeze(mockMessages); // Enforce immutability

			deepFreeze(initialState); // Enforce immutability
			expect(() => messagesReducer(initialState, StarkMessagePaneActions.removeMessages({ messages: mockMessages }))).toThrowError(
				/Unknown/
			);
		});
	});

	describe("on CLEAR_MESSAGES", () => {
		beforeEach(() => {
			initialState = {
				infoMessages: [mockInfoMessage],
				warningMessages: [mockWarningMessage],
				errorMessages: [mockErrorMessage]
			};
		});

		it("should remove ALL the messages when state given", () => {
			deepFreeze(initialState); // Enforce immutability

			// Send the CLEAR_MESSAGES action to the messagesReducer
			changedState = messagesReducer(initialState, StarkMessagePaneActions.clearMessages());

			expect(changedState.infoMessages).not.toBe(initialState.infoMessages);
			expect(changedState.infoMessages.length).toBe(0);
			expect(changedState.errorMessages).not.toBe(initialState.errorMessages);
			expect(changedState.errorMessages.length).toBe(0);
			expect(changedState.warningMessages).not.toBe(initialState.warningMessages);
			expect(changedState.warningMessages.length).toBe(0);
		});

		it("should NOT modify the state when it does not contain any message", () => {
			initialState.infoMessages = [];
			initialState.warningMessages = [];
			initialState.errorMessages = [];

			// Send the CLEAR_MESSAGES action to the messagesReducer
			changedState = messagesReducer(initialState, StarkMessagePaneActions.clearMessages());

			expect(changedState).toBeDefined();
			expect(changedState.infoMessages).toBe(initialState.infoMessages);
			expect(changedState.infoMessages.length).toBe(0);
			expect(changedState.warningMessages).toBe(initialState.warningMessages);
			expect(changedState.warningMessages.length).toBe(0);
			expect(changedState.errorMessages).toBe(initialState.errorMessages);
			expect(changedState.errorMessages.length).toBe(0);
		});

		it("should NOT remove any message when state not defined", () => {
			// Send the CLEAR_MESSAGES action to the messagesReducer
			changedState = messagesReducer(<any>undefined, StarkMessagePaneActions.clearMessages());

			expect(changedState).toBeDefined();
			expect(changedState.infoMessages.length).toBe(0);
			expect(changedState.warningMessages.length).toBe(0);
			expect(changedState.errorMessages.length).toBe(0);
		});
	});

	describe("on any other Action", () => {
		it("should invoke the default state", () => {
			deepFreeze(initialState); // Enforce immutability

			// Send the MOCK_ACTION action to the messagesReducer
			changedState = messagesReducer(initialState, <any>{
				type: "MOCK_ACTION"
			});

			expect(changedState).toBe(initialState);
		});
	});
});
