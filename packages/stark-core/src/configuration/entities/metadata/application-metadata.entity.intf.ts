"use strict";

import { StarkLanguage } from "../language/index";

/**
 * Metadata that describes the current application build
 * An implementation should be instantiated and be available under the name defined in the constants.
 */
export interface StarkApplicationMetadata {
	/**
	 * Application name
	 */
	name: string;

	/**
	 * Description
	 */
	description: string;

	/**
	 * Application version
	 */
	version: string;

	/**
	 * Target environment of the current build: Production, Development, ...
	 */
	environment: string;

	/**
	 * Timestamp when the current build was generated
	 */
	buildTimestamp: string;

	/**
	 * Timestamp when the current build was deployed
	 */
	deploymentTimestamp: string;

	/**
	 * Array of languages to be supported in the application
	 */
	supportedLanguages: StarkLanguage[];
}
