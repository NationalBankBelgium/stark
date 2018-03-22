"use strict";

export const starkLoggingServiceName: string = "StarkLoggingService";

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
	error(message: string, error?: Error): void;
}
