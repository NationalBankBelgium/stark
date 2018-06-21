/**
 * This class contains http headers needed when performing a Http Request
 */
export class StarkHttpHeaders {
	/**
	 * Contains information about the language preference of a user
	 */
	public static ACCEPT_LANGUAGE: string = "Accept-Language";
	/**
	 * The ETag value
	 */
	public static ETAG: string = "etag";
	/**
	 * The request will perform the action only if the entity given by the client matches the same entity on the server.
	 */
	public static IF_MATCH: string = "If-Match";
	/**
	 * The media type of the body request
	 */
	public static CONTENT_TYPE: string = "Content-Type";
	/**
	 * Used to prevent Cross Site Request Forgery
	 */
	public static XSRF_TOKEN: string = "X-XSRF-TOKEN";

	// NBB HTTP headers
	/**
	 * The correlation id between front-end and back-end.
	 * It is generated in the front-end and is sent on every request to the backend.
	 */
	public static NBB_CORRELATION_ID: string = "nbb-correlation-id";
	// authentication
	/**
	 * The user's username
	 */
	public static NBB_USER_NAME: string = "nbbuser";
	/**
	 * The user's firstname
	 */
	public static NBB_FIRST_NAME: string = "nbbfirstname";
	/**
	 * The user's lastname
	 */
	public static NBB_LAST_NAME: string = "nbblastname";
	/**
	 * The user's email adress
	 */
	public static NBB_MAIL: string = "nbbmail";
	/**
	 * The user's language
	 */
	public static NBB_LANGUAGE: string = "nbblanguage";
	/**
	 * Used to describe the user (team, workspace, ...)
	 */
	public static NBB_DESCRIPTION: string = "nbbdescription";
	/**
	 * The user's groups (ADMIN, ...)
	 */
	public static NBB_ROLES: string = "nbbgroups";
}
