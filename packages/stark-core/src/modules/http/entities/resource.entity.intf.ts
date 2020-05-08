import { StarkSingleItemMetadata } from "./metadata";

/**
 * This interface describes a `Resource` and it must be implemented by all entities that are related to back-end REST resources.
 */
export interface StarkResource {
	/**
	 * The uuid of this item.
	 * This **should** always be the UUID of the resource!
	 */
	uuid: string;

	/**
	 * The ETAG of this item.
	 * This value will be handled by the Stark HTTP API automatically for you.
	 */
	etag?: string;

	/**
	 * Optionally, **in single item responses only**, the backend may return warnings along with the resource itself.
	 *
	 * See {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Error-handling-Warnings|NBB REST API Design Guide: Error Handling Warnings}
	 */
	metadata?: StarkSingleItemMetadata;
}
