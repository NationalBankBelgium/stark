import { StarkBackend } from "../../../modules/http/entities/backend";
import { InjectionToken } from "@angular/core";

/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkApplicationConfig}
 */
export const STARK_APP_CONFIG: InjectionToken<StarkApplicationConfig> = new InjectionToken<StarkApplicationConfig>("STARK_APP_CONFIG");

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

	// FIXME: remove obsolete property
	/**
	 * Enable Angular's debug runtime information.
	 *
	 * See https://docs.angularjs.org/guide/production#disabling-debug-data.
	 *
	 * See https://docs.angularjs.org/api/ng/provider/$compileProvider#debugInfoEnabled
	 */
	angularDebugInfoEnabled: boolean;

	/**
	 * Enable logging of debug level messages
	 */
	debugLoggingEnabled: boolean;

	/**
	 * When the number of log messages reaches the `loggingFlushPersistSize` value,
	 * the log messages are sent to the back-end and removed from the redux store.
	 *
	 * Default: `15`
	 */
	loggingFlushPersistSize?: number;

	/**
	 * Id that uniquely identifies the application when flushing the logs to the back-end.
	 * It allows the back-end to recognize your application.
	 */
	loggingFlushApplicationId?: string;

	/**
	 * Defines the name of the logging resource on the back-end.
	 *
	 * Default: `logging`
	 */
	loggingFlushResourceName?: string;

	/**
	 * Option to disable the logging flush if it not needed for the application.
	 *
	 * Default: `false`
	 */
	loggingFlushDisabled?: boolean;

	/**
	 * This name will be used as the http header field that passes the correlationId to a backend.
	 */
	loggingCorrelationIdHttpHeaderName: string;

	/**
	 * Enable router logging
	 */
	routerLoggingEnabled: boolean;

	/**
	 * Enable router visualizer. Only in DEV (the router visualizer is not available in PROD)
	 *
	 * Default: `false`
	 */
	routerVisualizerEnabled?: boolean;

	/**
	 * Timeout period before the session is ended if no user interaction occurs
	 */
	sessionTimeout: number;

	/**
	 * Seconds before the session is ended (due to no user interaction) when the timeout warning event will be emitted.
	 *
	 * Default: `15`
	 */
	sessionTimeoutWarningPeriod: number;

	/**
	 * Interval in seconds between every `keepalive` ping.
	 *
	 * Default: `15`
	 */
	keepAliveInterval?: number;

	/**
	 * Url where the `keepalive` pings should be sent to
	 */
	keepAliveUrl?: string;

	/**
	 * Option to disable the `keepAlive` mechanism if it is not needed for the application.
	 *
	 * Default: `false`
	 */
	keepAliveDisabled?: boolean;

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
	 * Map containing the different {@link StarkBackend} objects that the application will interact with.
	 */
	backends: Map<string, StarkBackend>;

	/**
	 * Get a {@link StarkBackend} by name
	 *
	 * @param name - Name of the back-end object to get
	 * @returns The requested `StarkBackend` object
	 */
	getBackend(name: string): StarkBackend;

	/**
	 * Add a {@link StarkBackend}
	 *
	 * @param backend - `StarkBackend` object to add
	 */
	addBackend(backend: StarkBackend): void;

	/**
	 * Define all {@link StarkBackend} objects
	 *
	 * @param backends - Array of `StarkBackend` objects to add
	 */
	setBackends(backends: StarkBackend[]): void;

	/**
	 * Get all currently defined {@link StarkBackend} objects
	 *
	 * @returns A Map containing the different `StarkBackend` objects
	 */
	getBackends(): Map<string, StarkBackend>;
}
