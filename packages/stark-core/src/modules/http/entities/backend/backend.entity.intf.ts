import { StarkBackendAuthenticationTypes } from "./backend-authentication-types";

/**
 * Description of a back-end that the application interacts with.
 */
export interface StarkBackend {
	/**
	 * The name of the back-end. Referred to in repositories implementation.
	 */
	name: string;

	/**
	 * URL of the back-end.
	 */
	url: string;

	/**
	 * Authentication type for that back-end.
	 * @link StarkBackendAuthenticationTypes
	 */
	authenticationType: StarkBackendAuthenticationTypes;

	/**
	 * Set this to true if fake pre-authentication should be enabled.
	 * When enabled, Stark will add NBB-specific headers to each request
	 * to provide the information expected by the back-end for pre-authentication.
	 * In real environments, infrastructure takes care of this.
	 * This SHOULD NEVER be enabled for user acceptance or production environments!
	 */
	fakePreAuthenticationEnabled: boolean;

	/**
	 * Prefix for roles. Added to each role when sent to the back-end.
	 * MUST add the prefix that the back-end expects
	 * This is necessary to mimic the behavior of the WAF
	 */
	fakePreAuthenticationRolePrefix: string;

	/**
	 * Path of the login resource (optional).
	 */
	loginResource?: string;

	/**
	 * Value holder for retrieve tokens (e.g., JWT).
	 */
	token?: string;
}
