import { StarkSortItem } from "./metadata-sort-item.entity.intf";
import { StarkPaginationMetadata } from "./metadata-pagination.entity.intf";
import { StarkETags } from "./metadata-etags.entity.intf";
import { StarkWarnings } from "./metadata-warnings.entity.intf";

/**
 * Describes all the metadata related to the collection of items in
 * the response of a request built via the [StarkHttpRequestBuilder getCollection()]{@link StarkHttpRequestBuilder#getCollection} or [StarkHttpRequestBuilder search()]{@link StarkHttpRequestBuilder#search} method.
 */
export interface StarkCollectionMetadata extends StarkETags, StarkWarnings {
	/**
	 * Object containing sorting metadata.
	 *
	 * See {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Sorting-Metadata|NBB REST API Design Guide: Sorting Metadata}
	 */
	sortedBy: StarkSortItem[];

	/**
	 * Object containing pagination metadata.
	 *
	 * See {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Pagination-Rules-and-metadata#pagination-metadata|NBB REST API Design Guide: Pagination Rules and Metadata - pagination metadata}
	 */
	pagination: StarkPaginationMetadata;

	/**
	 * Object containing any other custom metadata (if any).
	 *
	 * See {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Pagination-Rules-and-metadata#custom-metadata|NBB REST API Design Guide: Pagination Rules and Metadata - custom metadata}
	 */
	custom?: object;
}
