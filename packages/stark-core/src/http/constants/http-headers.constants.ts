export class StarkHttpHeaders {
	public static ACCEPT_LANGUAGE: string = "Accept-Language";
	public static ETAG: string = "etag";
	public static IF_MATCH: string = "If-Match";
	public static CONTENT_TYPE: string = "Content-Type";
	public static XSRF_TOKEN: string = "X-XSRF-TOKEN";

	// NBB HTTP headers
	// correlation ID
	public static NBB_CORRELATION_ID: string = "nbb-correlation-id";
	// authentication
	public static NBB_USER_NAME: string = "nbbuser";
	public static NBB_FIRST_NAME: string = "nbbfirstname";
	public static NBB_LAST_NAME: string = "nbblastname";
	public static NBB_MAIL: string = "nbbmail";
	public static NBB_LANGUAGE: string = "nbblanguage";
	public static NBB_DESCRIPTION: string = "nbbdescription";
	public static NBB_ROLES: string = "nbbgroups";
}
