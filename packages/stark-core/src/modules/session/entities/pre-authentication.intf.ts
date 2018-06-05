/**
 * NBB's Java back-ends are usually configured to expect pre-authentication; that is the fact that when a request comes in, if should have been authenticated before by "something else".
 * The way it works is that each request must include NBB-specific HTTP headers along with each request.
 * When you are working against a development environment (e.g., back-end running on your own machine), the infrastructure is not there, so we must simulate it.
 */
export interface StarkPreAuthentication {
	/**
	 * The separator to use for the roles (must match the role separator defined on the back-end)
	 */
	roleSeparator: string;
	/**
	 * The separator to use for the description (must match the role separator defined on the back-end)
	 */
	descriptionSeparator: string;
	/**
	 * The default headers
	 */
	defaults: {
		/**
		 * The user's language
		 */
		language: string;
		/**
		 * The user's workpost
		 */
		workpost: string;
		/**
		 * The user's reference number
		 */
		referenceNumber: string;
	};
}
