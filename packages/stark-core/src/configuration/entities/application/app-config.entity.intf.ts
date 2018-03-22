"use strict";

import { StarkBackend } from "../../../http/entities/backend";

export const starkAppConfigConstantName: string = "StarkAppConfig";
/**
 * Minimal set of configuration options for Stark applications.
 * An implementation should be instantiated and be available under the name defined in the constants.
 */
export interface StarkApplicationConfig {
	/**
	 * Url of the state defined as root of the router state tree definition
	 */
	rootStateUrl: string;

	/**
	 * Name of the state defined as root of the router state tree definition
	 */
	rootStateName: string;

	/**
	 * Name of the state defined as home (homepage)
	 */
	homeStateName: string;

	/**
	 * Name of the state to be navigated to on generic errors
	 */
	errorStateName: string;

	/**
	 * Enable Angular's debug runtime information
	 * @link https://docs.angularjs.org/guide/production#disabling-debug-data
	 * @link https://docs.angularjs.org/api/ng/provider/$compileProvider#debugInfoEnabled
	 */
	angularDebugInfoEnabled: boolean;

	/**
	 * Enable logging of debug level messages
	 */
	debugLoggingEnabled: boolean;

	/**
	 * When the number of log messages reaches the loggingFlushPersistSize value,
	 * the log messages are sent to the back-end and removed from the redux store.
	 * Default: 15
	 */
	loggingFlushPersistSize: number;

	/**
	 * The loggingFlushApplicationId uniquely identifies the application.
	 * It makes that the back-end can recognize your application.
	 */
	loggingFlushApplicationId: string;

	/**
	 * The loggingFlushResourceName defines the name of the logging resource on the back-end. Default: "logging"
	 */
	loggingFlushResourceName: string;

	/**
	 * Enable router logging
	 */
	routerLoggingEnabled: boolean;

	/**
	 * Timeout period before the session is ended if no user interaction occurs
	 */
	sessionTimeout: number;

	/**
	 * Seconds before the session is ended (due to no user interaction) when the timeout warning event will be emitted.
	 * Default: 15
	 */
	sessionTimeoutWarningPeriod: number;

	/**
	 * Interval in seconds between every "keepalive" ping. Default: 15
	 */
	keepAliveInterval: number;

	/**
	 * Url where the "keepalive" pings should be sent to
	 */
	keepAliveUrl: string;

	/**
	 * Url to be navigated to logout the user
	 */
	logoutUrl: string;

	/**
	 * Base Url of the application
	 */
	baseUrl: string;

	/**
	 * The language to be used as default.
	 * If a translation key is not found in the current language, the one from the default language is used as fallback
	 */
	defaultLanguage: string;

	/**
	 * Whether the application is public or private.
	 * Public applications don't require authentication and usually provide read-only access to information
	 */
	publicApp: boolean;

	/**
	 * Option to disable the logging flush if it not needed for the application.
	 * default: false
	 */
	loggingFlushDisabled?: boolean;

	/**
	 * Option to disable the keepAlive if it not needed for the application.
	 * default: false
	 */
	keepAliveDisabled?: boolean;

	/**
	 * Backends that the application will interact to.
	 */
	backends: Map<string, StarkBackend>;

	/**
	 * Get a back-end by name
	 * @param name name of the back-end object to get
	 * @returns StarkBackend The requested backend
	 */
	getBackend(name: string): StarkBackend;

	/**
	 * Add a back-end
	 * @param backend back-end object to add
	 */
	addBackend(backend: StarkBackend): void;

	/**
	 * Define all back-ends
	 * @param backends the array of back-end objects
	 */
	setBackends(backends: StarkBackend[]): void;

	/***
	 * Get all currently defined back-end objects
	 * @returns Map<string,StarkBackend> A Map containing the different backends
	 */
	getBackends(): Map<string, StarkBackend>;
}
