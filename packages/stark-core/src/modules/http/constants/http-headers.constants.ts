/**
 * This class contains http headers needed when performing a Http Request
 */
export class StarkHttpHeaders {
	/**
	 * Contains information about the language preference of a user
	 */
	public static ACCEPT_LANGUAGE = "Accept-Language";
	/**
	 * The ETag value
	 */
	public static ETAG = "etag";
	/**
	 * The request will perform the action only if the entity given by the client matches the same entity on the server.
	 */
	public static IF_MATCH = "If-Match";
	/**
	 * The media type of the body request
	 */
	public static CONTENT_TYPE = "Content-Type";
	/**
	 * Used to prevent Cross Site Request Forgery
	 */
	public static XSRF_TOKEN = "X-XSRF-TOKEN";
}
