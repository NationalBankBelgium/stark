/* tslint:disable:completed-docs no-big-function no-duplicate-string max-union-size */
import { BehaviorSubject, Observable, Observer } from "rxjs";

import { Store } from "@ngrx/store";

import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";

import { StarkMessage, StarkMessageImpl, StarkMessageType } from "../../../common/message";
import { StarkUIApplicationState } from "../../../common/store";

import { StarkMessagePaneServiceImpl } from "./message-pane.service";
import { StarkMessageCollection } from "../entities";

import { StarkMessagePaneActions } from "../actions";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("MessagePaneService", () => {
	let mockStore: SpyObj<Store<StarkUIApplicationState>>;
	const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();
	let appMessagesState$: BehaviorSubject<StarkMessageCollection>;
	let mockMessageCollection: StarkMessageCollection;
	let messagePaneService: MessagePaneServiceHelper;

	const mockInfoMessage: StarkMessage = {
		id: "3",
		key: "MESSAGES.INFOS.DUMMY",
		interpolateValues: { var1: "some info value", var2: "whatever" },
		code: "1234",
		type: StarkMessageType.INFO
	};
	const mockWarningMessage: StarkMessage = {
		id: "2",
		key: "MESSAGES.WARNINGS.DUMMY",
		interpolateValues: { var1: "some warning value", var2: "whatever" },
		code: "4321",
		type: StarkMessageType.WARNING
	};
	const mockErrorMessage: StarkMessage = {
		id: "1",
		key: "MESSAGES.ERRORS.DUMMY",
		interpolateValues: { var1: "some error value", var2: "whatever" },
		code: "0159",
		type: StarkMessageType.ERROR
	};

	beforeEach(() => {
		mockStore = jasmine.createSpyObj<Store<StarkUIApplicationState>>("store", ["dispatch", "pipe"]);

		mockMessageCollection = {
			errorMessages: [],
			warningMessages: [],
			infoMessages: []
		};

		appMessagesState$ = new BehaviorSubject(mockMessageCollection);
		mockStore.pipe.and.returnValue(appMessagesState$);

		messagePaneService = new MessagePaneServiceHelper(mockLogger, <Store<StarkUIApplicationState>>(<unknown>mockStore));
	});

	afterEach(() => {
		appMessagesState$.complete();
	});

	describe("on initialization", () => {
		it("should subscribe to the store to fetch the latest value of the starkMessages (StarkMessageCollection)", () => {
			expect(mockStore.pipe).toHaveBeenCalledTimes(1);
			expect(messagePaneService.messages$).toBeDefined();

			const mockMessagesObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			messagePaneService.messages$.subscribe(mockMessagesObserver);

			expect(mockMessagesObserver.next).toHaveBeenCalledTimes(1);
			expect(mockMessagesObserver.next).toHaveBeenCalledWith(mockMessageCollection);
			expect(mockMessagesObserver.error).not.toHaveBeenCalled();
			expect(mockMessagesObserver.complete).not.toHaveBeenCalled();
		});
	});

	describe("add", () => {
		it("should dispatch the ADD_MESSAGES action passing the given messages in the payload", () => {
			const mockMessages: StarkMessage[] = [mockInfoMessage, mockWarningMessage, mockErrorMessage];

			messagePaneService.add(mockMessages);

			mockMessages[0] = { ...mockInfoMessage, priority: 999 };
			mockMessages[1] = { ...mockWarningMessage, priority: 999 };
			mockMessages[2] = { ...mockErrorMessage, priority: 999 };

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkMessagePaneActions.addMessages({ messages: mockMessages }));
		});
	});

	describe("addOne", () => {
		it("should dispatch the ADD_MESSAGES action and return the observable used to fetch the latest value of the starkMessages", () => {
			messagePaneService.addOne(mockInfoMessage);
			const validatedMessage: StarkMessage = { ...mockInfoMessage, priority: 999 };

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkMessagePaneActions.addMessages({ messages: [validatedMessage] }));
		});

		it("should add the default priority of 999, when it is not supplied", () => {
			const message: StarkMessage = {
				id: "3",
				key: "MESSAGES.INFOS.DUMMY",
				interpolateValues: { var1: "some info value", var2: "whatever" },
				code: "1234",
				type: StarkMessageType.INFO
			};

			messagePaneService.addOne(message);
			const validatedMessage: StarkMessage = { ...message, priority: 999 };
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkMessagePaneActions.addMessages({ messages: [validatedMessage] }));
		});

		it("should throw an error when the priority is smaller than 1", () => {
			const message: StarkMessage = {
				id: "3",
				key: "MESSAGES.INFOS.DUMMY",
				interpolateValues: { var1: "some info value", var2: "whatever" },
				code: "1234",
				type: StarkMessageType.INFO,
				priority: -1
			};

			expect(() => messagePaneService.addOne(message)).toThrowError(/priority has to be between 1 and 999/);
		});

		it("should throw an error when the priority is greater than 999", () => {
			const message: StarkMessage = new StarkMessageImpl(
				"3",
				"MESSAGES.INFOS.DUMMY",
				"1234",
				StarkMessageType.INFO,
				{ var1: "some info value", var2: "whatever" },
				1000
			);

			expect(() => messagePaneService.addOne(message)).toThrowError(/priority has to be between 1 and 999/);
		});

		it("should not change a priority between 1 and 999", () => {
			const message: StarkMessage = new StarkMessageImpl(
				"3",
				"MESSAGES.INFOS.DUMMY",
				"1234",
				StarkMessageType.INFO,
				{ var1: "some info value", var2: "whatever" },
				200
			);

			messagePaneService.addOne(message);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkMessagePaneActions.addMessages({ messages: [message] }));
		});
	});

	describe("getAll", () => {
		it("should dispatch the GET_ALL_MESSAGES action passing the given messages in the payload", () => {
			expect(messagePaneService.messages$).toBeDefined();

			const mockMessagesObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			const getAll$: Observable<StarkMessageCollection> = messagePaneService.getAll();
			expect(getAll$).toBe(messagePaneService.messages$);

			getAll$.subscribe(mockMessagesObserver);

			expect(mockMessagesObserver.next).toHaveBeenCalledTimes(1);
			expect(mockMessagesObserver.next).toHaveBeenCalledWith(mockMessageCollection);
			expect(mockMessagesObserver.error).not.toHaveBeenCalled();
			expect(mockMessagesObserver.complete).not.toHaveBeenCalled();
			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkMessagePaneActions.getAllMessages());
		});
	});

	describe("remove", () => {
		it("should dispatch the REMOVE_MESSAGES action passing the given messages in the payload", () => {
			const mockMessages: StarkMessage[] = [mockInfoMessage, mockWarningMessage, mockErrorMessage];

			messagePaneService.remove(mockMessages);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkMessagePaneActions.removeMessages({ messages: mockMessages }));
		});
	});

	describe("clearAll", () => {
		it("should dispatch the CLEAR_MESSAGES action without any payload", () => {
			messagePaneService.clearAll();

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(StarkMessagePaneActions.clearMessages());
		});
	});
});

class MessagePaneServiceHelper extends StarkMessagePaneServiceImpl {
	public declare messages$: Observable<StarkMessageCollection>;
}
