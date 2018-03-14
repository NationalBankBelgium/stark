"use strict";

import {StarkLanguage} from "../language";

/**
 * Metadata that describes the current application build
 * An implementation should be instantiated and be available under the name defined in the constants.
 */
export interface StarkApplicationMetadata {
	/**
	 * Application name
	 * @type string
	 */
	name: string;

	/**
	 * Description
	 * @type string
	 */
	description: string;

	/**
	 * Application version
	 * @type string
	 */
	version: string;

	/**
	 * Target environment of the current build: Production, Development, ...
	 * @type string
	 */
	environment: string;

	/**
	 * Timestamp when the current build was generated
	 * @type string
	 */
	buildTimestamp: string;

	/**
	 * Timestamp when the current build was deployed
	 * @type string
	 */
	deploymentTimestamp: string;

	/**
	 * Array of languages to be supported in the application
	 * @type Array<StarkLanguage>
	 */
	supportedLanguages: StarkLanguage[];
}
