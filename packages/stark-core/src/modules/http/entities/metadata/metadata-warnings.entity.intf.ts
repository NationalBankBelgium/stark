import { StarkHttpErrorDetail } from "../error";

/**
 * Interface that describes the warnings array to be included in an http response.
 */
export interface StarkWarnings {
	/**
	 * Array of warnings ({@link StarkHttpErrorDetail} objects) sent by the backend as a result of server-side validations.
	 * Warnings can be included in the resource itself inside a "metadata" object for single item responses or
	 * in the collection "metadata" object for collection responses.
	 *
	 * See:
	 * - {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Pagination-Rules-and-metadata|NBB REST API Design Guide: Pagination Rules and Metadata}
	 * - {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Error-handling-Warnings|NBB REST API Design Guide: Error Handling Warnings}
	 */
	warnings?: StarkHttpErrorDetail[];
}
