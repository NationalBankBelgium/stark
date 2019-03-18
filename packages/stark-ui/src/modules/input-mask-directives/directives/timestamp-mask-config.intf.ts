/**
 * Defines the configuration for the {@link StarkTimestampMaskDirective}.
 */
export interface StarkTimestampMaskConfig {
	/**
	 * Format of the date and/or time. For example: "DD-MM-YYYY hh:mm:ss"
	 */
	format: string;
}

/**
 * Type guard for {StarkTimestampMaskConfig|StarkTimestampMaskConfig}
 * @param config - Config to validate
 */
export function isStarkTimestampMaskConfig(config: any): config is StarkTimestampMaskConfig {
	return config && typeof config.format === "string";
}
