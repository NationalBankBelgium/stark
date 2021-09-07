import { StarkLanguage } from "../language";
import { InjectionToken } from "@angular/core";

/**
 * {@link https://v12.angular.io/api/core/InjectionToken|InjectionToken} used to provide the {@link StarkApplicationMetadata}
 */
export const STARK_APP_METADATA: InjectionToken<StarkApplicationMetadata> = new InjectionToken<StarkApplicationMetadata>(
	"STARK_APP_METADATA"
);

/**
 * Metadata that describes the current application build.
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
	 * Array of {@link StarkLanguage} objects to be supported in the application
	 */
	supportedLanguages: StarkLanguage[];
}
