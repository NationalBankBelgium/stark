/**
 * A list of all Http request types supported by Stark
 */
export enum StarkHttpRequestType {
	/**
	 * The Http Create request type.
	 */
	CREATE = "CREATE",
	/**
	 * The Http Create (bulk) request type.
	 * Used to create several items with the same characteristics at a time.
	 */
	CREATE_BULK = "CREATE_BULK",
	/**
	 * The Http Update request type (POST).
	 */
	UPDATE = "UPDATE",
	/**
	 * The Http Update request type (PUT).
	 */
	UPDATE_IDEMPOTENT = "UPDATE_IDEMPOTENT",
	/**
	 * The Http Update (bulk) request type.
	 * Used to update several items with the same characteristics at a time.
	 */
	UPDATE_BULK = "UPDATE_BULK",
	/**
	 * The Http Delete request type.
	 */
	DELETE = "DELETE",
	/**
	 * The Http Delete (bulk) request type.
	 * Used to delete several items with the same characteristics at a time.
	 */
	DELETE_BULK = "DELETE_BULK",
	/**
	 * The Http Get request type.
	 */
	GET = "GET",
	/**
	 * The Http Get Collection request type, to fetch several items at a time.
	 */
	GET_COLLECTION = "GET_COLLECTION",
	/**
	 * The Http Search request type.
	 */
	SEARCH = "SEARCH"
}
