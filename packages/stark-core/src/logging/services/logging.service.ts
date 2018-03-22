"use strict";

import * as uuid from "uuid";

import { Serialize } from "cerialize";
import { validateSync } from "class-validator";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { Inject, Injectable } from "@angular/core";

import { StarkLoggingService, starkLoggingServiceName } from "./logging.service.intf";
import { StarkApplicationConfig, starkAppConfigConstantName } from "../../configuration/entities/index";
import { StarkBackend } from "../../http/entities/backend/index";
import { StarkCoreApplicationState } from "../../common/store/starkCoreApplicationState";
import { StarkHttpStatusCodes } from "../../http/enumerators/index";
import { StarkHttpHeaders } from "../../http/constants/index";
// import {StarkXSRFService, starkXSRFServiceName} from "../../xsrf";
import { StarkValidationErrorsUtil } from "../../util/validation-errors.util";
import { StarkLogging, StarkLoggingImpl, StarkLogMessage, StarkLogMessageImpl, StarkLogMessageType } from "../entities/index";
import { LogMessage, FlushLogMessages } from "../actions/index";

const _noop: Function = require("lodash/noop");

/**
 * @ngdoc service
 * @name stark-core.service:StarkLoggingService
 * @description Basic logging service implementation.
 * Integrates logging with the Redux store
 *
 * @requires ngrx-store.Store
 * @requires StarkApplicationConfig
 * @requires StarkXSRFService
 */
@Injectable()
export class StarkLoggingServiceImpl implements StarkLoggingService {
	private backend: StarkBackend;
	private logUrl: string;
	private logPersistSize: number;
	private isPersisting: boolean;
	private retryCounter: number;
	private consoleDebug: Function;
	private consoleInfo: Function;
	private consoleWarn: Function;
	private consoleError: Function;
	private consoleTrace: Function;
	private starkLogging: StarkLogging;
	/** @internal */
	private _correlationId: string;
	// FIXME: uncomment these lines once XSRF Service is implemented
	public constructor(
		private store: Store<StarkCoreApplicationState>,
		@Inject(starkAppConfigConstantName)
		private appConfig: StarkApplicationConfig /*,
					   @Inject(starkXSRFServiceName) private xsrfService: StarkXSRFService*/
	) {
		this.isPersisting = false;
		this.retryCounter = 0;
		this.consoleDebug = this.getConsole("debug");
		this.consoleInfo = this.getConsole("info");
		this.consoleWarn = this.getConsole("warn");
		this.consoleError = this.getConsole("error");
		this.consoleTrace = this.getConsole("trace");

		if (!this.appConfig.loggingFlushDisabled) {
			// ensuring that the app config is valid before configuring the automatic logging flush
			StarkValidationErrorsUtil.throwOnError(
				validateSync(this.appConfig),
				starkLoggingServiceName + ": " + starkAppConfigConstantName + " constant is not valid."
			);

			if (!(this.backend = this.appConfig.getBackend("logging"))) {
				throw new Error(starkLoggingServiceName + ': no configuration found for "logging" backend.');
			}

			this.logPersistSize = this.appConfig.loggingFlushPersistSize;
			this.logUrl = this.backend.url + "/" + this.appConfig.loggingFlushResourceName;
			this.generateNewCorrelationId();

			this.store.select<StarkLogging>(state => state.starkLogging).subscribe((starkLogging: StarkLogging) => {
				this.starkLogging = starkLogging;
				this.persistLogMessages();
			});

			if (window) {
				window.addEventListener("beforeunload", () => {
					//ev: BeforeUnloadEvent
					// Persist the remaining log entries that are still in the store, before leaving the application.
					// We need to call the REST service synchronously,
					// because the browser has to wait for the REST service to complete.

					const data: string = JSON.stringify(Serialize(this.starkLogging, StarkLoggingImpl));
					this.sendRequest(this.logUrl, data, false);
				});
			}

			this.debug(starkLoggingServiceName + " loaded");
		}
	}

	public debug(...args: any[]): void {
		if (this.appConfig.debugLoggingEnabled) {
			const debugMessage: StarkLogMessage = this.constructLogMessage(StarkLogMessageType.DEBUG, ...args);
			this.store.dispatch(new LogMessage(debugMessage));
			// also log the message to the console
			this.consoleDebug(...args);
		}
	}

	public info(...args: any[]): void {
		const infoMessage: StarkLogMessage = this.constructLogMessage(StarkLogMessageType.INFO, ...args);
		this.store.dispatch(new LogMessage(infoMessage));
		// also log the message to the console
		this.consoleInfo(...args);
	}

	public warn(...args: any[]): void {
		const warningMessage: StarkLogMessage = this.constructLogMessage(StarkLogMessageType.WARNING, ...args);
		this.store.dispatch(new LogMessage(warningMessage));
		// also log the message to the console
		this.consoleWarn(...args);
	}

	public error(message: string, error?: Error): void {
		const errorMessage: StarkLogMessage = this.constructLogMessage(StarkLogMessageType.ERROR, message, error);
		this.store.dispatch(new LogMessage(errorMessage));
		// also log the message to the console
		this.consoleError(message, error);
		// IE Errors don't have an "stack" property so we log it manually via console.trace()
		if (error && !error.stack) {
			this.consoleTrace(message, error);
		}
	}

	public get correlationId(): string {
		return this._correlationId;
	}

	public generateNewCorrelationId(): string {
		this._correlationId = uuid.v4();
		return this._correlationId;
	}

	protected constructLogMessage(messageType: StarkLogMessageType, ...args: any[]): StarkLogMessage {
		let parsedMessage: string;
		let parsedError: string | undefined;

		if (messageType !== StarkLogMessageType.ERROR) {
			const parsedArgs: string[] = args.map((arg: any) => this.parseArg(arg));
			parsedMessage = parsedArgs.join(" | ");
		} else {
			const error: Error = <Error>args[1];
			parsedMessage = args[0];
			if (error) {
				parsedError = this.formatError(error);
			}
		}

		return new StarkLogMessageImpl(messageType, parsedMessage, this._correlationId, parsedError);
	}

	protected persistLogMessages(isForced: boolean = false): void {
		const numberOfMessages: number = this.starkLogging.messages.length;

		if (numberOfMessages > 0 && this.starkLogging.messages[numberOfMessages - 1].type === StarkLogMessageType.ERROR) {
			isForced = true;
		}

		if ((numberOfMessages >= this.logPersistSize && !this.isPersisting) || isForced) {
			if (this.retryCounter < 5) {
				this.isPersisting = true;

				const data: string = JSON.stringify(Serialize(this.starkLogging, StarkLoggingImpl));

				this.sendRequest(this.logUrl, data, true).subscribe(
					() => {
						this.isPersisting = false;
						this.retryCounter = 0;
						this.store.dispatch(new FlushLogMessages(numberOfMessages));
					},
					(error: Error) => {
						this.isPersisting = false;
						this.retryCounter++;
						const errorMsg: string =
							starkLoggingServiceName +
							": an error occurred while persisting log messages." +
							" (retry " +
							this.retryCounter +
							")";
						this.error(errorMsg, error);
					}
				);
			} else {
				// still no success after retrying 5 times, will be tried again in the next logged message
			}
		}
	}

	protected sendRequest(url: string, serializedData: string, async: boolean = true): Observable<void> {
		const httpRequest$: Subject<void> = new Subject<void>();

		const emitXhrResult: Function = (xhrRequest: XMLHttpRequest) => {
			if (xhrRequest.readyState === XMLHttpRequest.DONE) {
				if (xhrRequest.status === StarkHttpStatusCodes.HTTP_200_OK || xhrRequest.status === StarkHttpStatusCodes.HTTP_201_CREATED) {
					httpRequest$.next();
					httpRequest$.complete();
				} else {
					httpRequest$.error(xhrRequest.status);
				}
			}
		};

		const xhr: XMLHttpRequest = new XMLHttpRequest();

		if (async) {
			xhr.onreadystatechange = () => {
				emitXhrResult(xhr);
			};
		} else {
			emitXhrResult(xhr);
		}

		// catch any error raised by the browser while opening the connection. for example:
		// Chrome "mixed content" error: https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content
		// IE "Access is denied" error: https://stackoverflow.com/questions/22098259/access-denied-in-ie-10-and-11-when-ajax-target-is-localhost
		try {
			xhr.open("POST", url, async);
			// this.xsrfService.configureXHR(xhr);
			xhr.setRequestHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			xhr.send(serializedData);
		} catch (e) {
			httpRequest$.error(e);
		}

		return httpRequest$;
	}

	private parseArg(arg: any): string {
		if (arg instanceof Error) {
			return this.formatError(arg);
		} else if (typeof arg === "string") {
			return arg;
		} else {
			// catch potential "circular reference" error
			try {
				return JSON.stringify(arg);
			} catch (e) {
				return arg; // return the arg "as is" in case of error
			}
		}
	}

	private formatError(error: Error): string {
		if (error.stack && error.message && error.stack.indexOf(error.message) === -1) {
			return "Error: " + error.message + "\n" + error.stack;
		} else if (error.stack) {
			return error.stack;
		} else if (error["sourceURL"]) {
			return error.message + "\n" + error["sourceURL"] + ":" + error["line"];
		} else {
			return error.message;
		}
	}

	/**
	 * Returns the specified window console method if it exists (debug, warn, info, error, trace),
	 * otherwise returns console.log or empty function
	 * @param type Type of console to be used: info, debug, warn, error, trace
	 */
	protected getConsole(type: string): Function {
		const console: any = window && window.console ? window.console : {};
		const logFn: Function = console[type] || console.log || _noop;

		return (...args: any[]): any => {
			const consoleArgs: any[] = [];
			for (const arg of args) {
				if (arg instanceof Error) {
					consoleArgs.push(this.formatError(arg));
				} else {
					consoleArgs.push(arg);
				}
			}
			return logFn.apply(console, consoleArgs);
		};
	}
}
