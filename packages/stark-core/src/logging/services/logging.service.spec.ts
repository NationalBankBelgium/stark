"use strict";

import Spy = jasmine.Spy;
import { Action, Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import { Serialize } from "cerialize";

import { StarkLoggingActionTypes, FlushLogMessages } from "../../logging/actions/index";
import { StarkLoggingServiceImpl } from "./logging.service";
import { StarkApplicationConfig, StarkApplicationConfigImpl } from "../../configuration/entities/index";
import { StarkLogging, StarkLoggingImpl, StarkLogMessage, StarkLogMessageImpl, StarkLogMessageType } from "../../logging/entities/index";
import { StarkBackend } from "../../http/entities/backend";
import { StarkCoreApplicationState } from "../../common/store/starkCoreApplicationState";
// import {StarkXSRFService} from "../../xsrf";
// import {UnitTestingUtils} from "../../test/unit-testing";

describe("Service: StarkLoggingService", () => {
	let appConfig: StarkApplicationConfig;
	let mockStore: Store<any>;
	// let mockXSRFService: StarkXSRFService;
	let loggingService: LoggingServiceHelper;
	const loggingBackend: StarkBackend = {
		name: "logging",
		url: "http://localhost:5000",
		authenticationType: 1,
		fakePreAuthenticationEnabled: true,
		fakePreAuthenticationRolePrefix: "",
		loginResource: "logging",
		token: ""
	};
	const dummyObject: object = {
		prop1: "dummy prop",
		prop2: 123,
		method1: () => "dummy method"
	};
	let mockStarkLogging: StarkLogging;
	const loggingFlushPersistSize: number = 11;

	beforeEach(() => {
		mockStore = jasmine.createSpyObj("store", ["dispatch", "select"]);
		appConfig = new StarkApplicationConfigImpl();
		appConfig.debugLoggingEnabled = true;
		appConfig.loggingFlushDisabled = false;
		appConfig.loggingFlushApplicationId = "TEST";
		appConfig.loggingFlushPersistSize = loggingFlushPersistSize;
		appConfig.addBackend(loggingBackend);
		appConfig.sessionTimeout = 123;
		appConfig.sessionTimeoutWarningPeriod = 13;
		appConfig.keepAliveDisabled = true;
		appConfig.logoutUrl = "http://localhost:5000/logout";
		appConfig.rootStateUrl = "";
		appConfig.rootStateName = "";
		appConfig.homeStateName = "";
		appConfig.errorStateName = "";
		appConfig.angularDebugInfoEnabled = false;
		appConfig.defaultLanguage = "fr";
		appConfig.baseUrl = "/";
		appConfig.publicApp = false;
		appConfig.routerLoggingEnabled = false;

		// mockXSRFService = UnitTestingUtils.getMockedXSRFService();
		mockStarkLogging = {
			uuid: "dummy uuid",
			applicationId: "dummy app id",
			messages: []
		};
		(<Spy>mockStore.select).and.returnValue(Observable.of(mockStarkLogging));
		loggingService = new LoggingServiceHelper(mockStore, appConfig /*, mockXSRFService*/);
		// reset the calls counter because there is a log in the constructor
		(<Spy>mockStore.dispatch).calls.reset();
	});

	describe("on initialization", () => {
		it("should throw an error in case the logging flushing is enabled but the backend config is missing", () => {
			appConfig.loggingFlushDisabled = false;
			appConfig.backends.delete("logging");

			expect(() => new LoggingServiceHelper(mockStore, appConfig /*, mockXSRFService*/)).toThrowError(/backend/);
		});

		it("should throw an error in case the logging flushing is enabled but the loggingFlushPersistSize option is not greater than 0", () => {
			appConfig.loggingFlushPersistSize = 0;

			expect(() => new LoggingServiceHelper(mockStore, appConfig /*, mockXSRFService*/)).toThrowError(/loggingFlushPersistSize/);

			appConfig.loggingFlushPersistSize = -1;

			expect(() => new LoggingServiceHelper(mockStore, appConfig /*, mockXSRFService*/)).toThrowError(/loggingFlushPersistSize/);
		});

		it("should generate a new correlation id", () => {
			expect(loggingService.correlationId).toBeDefined();
			expect(typeof loggingService.correlationId).toBe("string");
			expect(loggingService.correlationId).not.toBe("");
		});
	});

	describe("debug", () => {
		it("should dispatch LOG_MESSAGE action with an StarkLogMessageType of type DEBUG", () => {
			loggingService.debug("dummy debug message", dummyObject, "end of message");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);

			const dispatchedAction: Action = (<Spy>mockStore.dispatch).calls.mostRecent().args[0];
			expect(dispatchedAction.type).toBe(StarkLoggingActionTypes.LOG_MESSAGE);

			const { message }: any = dispatchedAction;
			expect(message instanceof StarkLogMessageImpl).toBe(true);
			expect((<StarkLogMessage>message).type).toBe(StarkLogMessageType.DEBUG);
			expect((<StarkLogMessage>message).message).toContain("dummy debug message");
			expect((<StarkLogMessage>message).message).toContain(JSON.stringify(dummyObject));
			expect((<StarkLogMessage>message).message).toContain("end of message");
			expect((<StarkLogMessage>message).timestamp).toBeDefined();
			expect((<StarkLogMessage>message).error).toBeUndefined();
		});

		it("should NOT dispatch any action nor log any message if appConfig,debugLoggingEnabled property is FALSE", () => {
			appConfig.debugLoggingEnabled = false;
			loggingService.debug("dummy debug message");

			expect(mockStore.dispatch).not.toHaveBeenCalled();
		});
	});

	describe("info", () => {
		it("should dispatch LOG_MESSAGE action with an StarkLogMessageType of type INFO", () => {
			loggingService.info("dummy info message", dummyObject, "end of message");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);

			const dispatchedAction: Action = (<Spy>mockStore.dispatch).calls.mostRecent().args[0];
			expect(dispatchedAction.type).toBe(StarkLoggingActionTypes.LOG_MESSAGE);

			const { message }: any = dispatchedAction;
			expect(message instanceof StarkLogMessageImpl).toBe(true);
			expect((<StarkLogMessage>message).type).toBe(StarkLogMessageType.INFO);
			expect((<StarkLogMessage>message).message).toContain("dummy info message");
			expect((<StarkLogMessage>message).message).toContain(JSON.stringify(dummyObject));
			expect((<StarkLogMessage>message).message).toContain("end of message");
			expect((<StarkLogMessage>message).timestamp).toBeDefined();
			expect((<StarkLogMessage>message).error).toBeUndefined();
		});
	});

	describe("warn", () => {
		it("should dispatch LOG_MESSAGE action with an StarkLogMessageType of type WARNING", () => {
			loggingService.warn("dummy warning message", dummyObject, "end of message");

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);

			const dispatchedAction: Action = (<Spy>mockStore.dispatch).calls.mostRecent().args[0];
			expect(dispatchedAction.type).toBe(StarkLoggingActionTypes.LOG_MESSAGE);

			const { message }: any = dispatchedAction;
			expect(message instanceof StarkLogMessageImpl).toBe(true);
			expect((<StarkLogMessage>message).type).toBe(StarkLogMessageType.WARNING);
			expect((<StarkLogMessage>message).message).toContain("dummy warning message");
			expect((<StarkLogMessage>message).message).toContain(JSON.stringify(dummyObject));
			expect((<StarkLogMessage>message).message).toContain("end of message");
			expect((<StarkLogMessage>message).timestamp).toBeDefined();
			expect((<StarkLogMessage>message).error).toBeUndefined();
		});
	});

	describe("error", () => {
		it("should dispatch LOG_MESSAGE action with an StarkLogMessageType of type ERROR", () => {
			const errorMsg: string = "dummy error message" + JSON.stringify(dummyObject) + "end of message";
			loggingService.error(errorMsg, new Error("this is the error"));
			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			const dispatchedAction: Action = (<Spy>mockStore.dispatch).calls.mostRecent().args[0];
			expect(dispatchedAction.type).toBe(StarkLoggingActionTypes.LOG_MESSAGE);
			const { message }: any = dispatchedAction;
			expect(message instanceof StarkLogMessageImpl).toBe(true);
			expect((<StarkLogMessage>message).type).toBe(StarkLogMessageType.ERROR);
			expect((<StarkLogMessage>message).message).toContain("dummy error message");
			expect((<StarkLogMessage>message).message).toContain(JSON.stringify(dummyObject));
			expect((<StarkLogMessage>message).message).toContain("end of message");
			expect((<StarkLogMessage>message).timestamp).toBeDefined();
			expect((<StarkLogMessage>message).error).toBeDefined();
			expect((<StarkLogMessage>message).error).toContain("this is the error");
		});
	});

	describe("constructLogMessage", () => {
		describe("Debug / Info / Warning messages ", () => {
			it("should return an StarkLogMessage instance of the type specified and the message containing the arguments", () => {
				let message: StarkLogMessage;
				message = (<LoggingServiceHelper>loggingService).constructLogMessageHelper(StarkLogMessageType.INFO, "arg1", dummyObject);

				expect(message.type).toBe(StarkLogMessageType.INFO);
				expect(message.message).toContain("arg1 | " + JSON.stringify(dummyObject));
				expect(message.timestamp).toBeDefined();
				expect(message.error).toBeUndefined();

				message = (<LoggingServiceHelper>loggingService).constructLogMessageHelper(StarkLogMessageType.DEBUG, "arg3", dummyObject);

				expect(message.type).toBe(StarkLogMessageType.DEBUG);
				expect(message.message).toContain("arg3 | " + JSON.stringify(dummyObject));
				expect(message.timestamp).toBeDefined();
				expect(message.error).toBeUndefined();

				message = (<LoggingServiceHelper>loggingService).constructLogMessageHelper(
					StarkLogMessageType.WARNING,
					"arg5",
					dummyObject
				);

				expect(message.type).toBe(StarkLogMessageType.WARNING);
				expect(message.message).toContain("arg5 | " + JSON.stringify(dummyObject));
				expect(message.timestamp).toBeDefined();
				expect(message.error).toBeUndefined();
			});
		});

		describe("Error messages ", () => {
			it("should return an StarkLogMessage instance of the type ERROR containing a message and the error string", () => {
				let message: StarkLogMessage;
				const error: Error = new Error("this is the error");
				message = (<LoggingServiceHelper>loggingService).constructLogMessageHelper(
					StarkLogMessageType.ERROR,
					"dummy error message",
					error
				);

				expect(message.type).toBe(StarkLogMessageType.ERROR);
				expect(message.message).toContain("dummy error message");
				expect(message.timestamp).toBeDefined();
				expect(message.error).toBeDefined();
				expect(message.error).toContain("this is the error");
			});
		});
	});

	describe("persistLogMessages", () => {
		beforeEach(() => {
			for (let i: number = 1; i <= loggingFlushPersistSize; i++) {
				const message: StarkLogMessage = (<LoggingServiceHelper>loggingService).constructLogMessageHelper(
					StarkLogMessageType.INFO,
					"Message " + i,
					dummyObject
				);
				mockStarkLogging.messages = [...mockStarkLogging.messages, message];
			}
		});

		it("should persist messages to the back-end when the persist size exceeds", () => {
			expect(mockStarkLogging.messages.length).toBe(loggingFlushPersistSize);

			const sendRequestSpy: Spy = spyOn(loggingService, "sendRequest").and.callFake(() => Observable.of("ok"));
			const data: string = JSON.stringify(Serialize(mockStarkLogging, StarkLoggingImpl));
			(<LoggingServiceHelper>loggingService).persistLogMessagesHelper();
			expect(sendRequestSpy).toHaveBeenCalledTimes(1);
			expect(sendRequestSpy.calls.mostRecent().args[0]).toBe(loggingBackend.url + "/" + loggingBackend.loginResource);
			expect(sendRequestSpy.calls.mostRecent().args[1]).toBe(data);
			expect(sendRequestSpy.calls.mostRecent().args[2]).toBe(true);

			expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
			expect(mockStore.dispatch).toHaveBeenCalledWith(new FlushLogMessages(loggingFlushPersistSize));
		});

		it("should fail to persist messages when the back-end fails", () => {
			expect(mockStarkLogging.messages.length).toBe(loggingFlushPersistSize);

			const sendRequestSpy: Spy = spyOn(loggingService, "sendRequest").and.callFake(() => Observable.throw("ko"));
			const errorSpy: Spy = spyOn(loggingService, "error");
			const data: string = JSON.stringify(Serialize(mockStarkLogging, StarkLoggingImpl));
			(<LoggingServiceHelper>loggingService).persistLogMessagesHelper();
			expect(sendRequestSpy).toHaveBeenCalledTimes(1);
			expect(sendRequestSpy.calls.mostRecent().args[0]).toBe(loggingBackend.url + "/" + loggingBackend.loginResource);
			expect(sendRequestSpy.calls.mostRecent().args[1]).toBe(data);
			expect(sendRequestSpy.calls.mostRecent().args[2]).toBe(true);
			expect(errorSpy).toHaveBeenCalledTimes(1);
			expect(errorSpy.calls.mostRecent().args[0]).toContain("an error occurred while persisting log messages. (retry 1)");
		});
	});
});

class LoggingServiceHelper extends StarkLoggingServiceImpl {
	public constructor(store: Store<StarkCoreApplicationState>, appConfig: StarkApplicationConfig /*, xsrfService: StarkXSRFService*/) {
		super(store, appConfig /*, xsrfService*/);
	}
	public constructLogMessageHelper(messageType: StarkLogMessageType, ...args: any[]): StarkLogMessage {
		return this.constructLogMessage(messageType, ...args);
	}

	public persistLogMessagesHelper(isForced: boolean = false): void {
		this.persistLogMessages(isForced);
	}

	// override parent's implementation to prevent actual HTTP request to be sent!
	public sendRequest(): Observable<void> {
		/* dummy function to be mocked */
		return Observable.of(undefined);
	}

	// override parent's implementation to prevent logging to the console
	public getConsole(): Function {
		return () => {
			/* noop */
		};
	}
}
