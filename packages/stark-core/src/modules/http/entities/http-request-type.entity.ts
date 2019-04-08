/**
 * A list of all Http request types supported by Stark
 */
export class StarkHttpRequestType {
	/**
	 * The Http Create request type.
	 */
	public static CREATE = "CREATE";
	/**
	 * The Http Create (bulk) request type.
	 * Used to create several items with the same characteristics at a time.
	 */
	public static CREATE_BULK = "CREATE_BULK";
	/**
	 * The Http Update request type (POST).
	 */
	public static UPDATE = "UPDATE";
	/**
	 * The Http Update request type (PUT).
	 */
	public static UPDATE_IDEMPOTENT = "UPDATE_IDEMPOTENT";
	/**
	 * The Http Update (bulk) request type.
	 * Used to update several items with the same characteristics at a time.
	 */
	public static UPDATE_BULK = "UPDATE_BULK";
	/**
	 * The Http Delete request type.
	 */
	public static DELETE = "DELETE";
	/**
	 * The Http Delete (bulk) request type.
	 * Used to delete several items with the same characteristics at a time.
	 */
	public static DELETE_BULK = "DELETE_BULK";
	/**
	 * The Http Get request type.
	 */
	public static GET = "GET";
	/**
	 * The Http Get Collection request type, to fetch several items at a time.
	 */
	public static GET_COLLECTION = "GET_COLLECTION";
	/**
	 * The Http Search request type.
	 */
	public static SEARCH = "SEARCH";
}
