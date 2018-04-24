import { InjectionToken } from "@angular/core";
import { StarkError } from "../../common";

export const starkLoggingServiceName: string = "StarkLoggingService";
export const STARK_LOGGING_SERVICE: InjectionToken<StarkLoggingService> = new InjectionToken<StarkLoggingService>(starkLoggingServiceName);

/**
 * Stark Logging Service.
 * Service that integrates logging with the Redux store and also integrates the notion of correlation identifier.
 */
export interface StarkLoggingService {
	readonly correlationId: string;
	generateNewCorrelationId(): string;
	debug(...args: any[]): void;
	info(...args: any[]): void;
	warn(...args: any[]): void;
	error(message: string, error?: StarkError | Error): void;
}
