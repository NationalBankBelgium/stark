/**
 * Interface that describes the etags array to be included in the response of a request built
 * via the [StarkHttpRequestBuilder getCollection()]{@link StarkHttpRequestBuilder#getCollection} method.
 */
export interface StarkETags {
	/**
	 * **For collection responses only.**
	 *
	 * Object containing the mapping between the items in the collection `items` array and the ETag value for each.
	 *
	 * See {@link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Concurrency-vs-Pagination#metadata|NBB REST API Design Guide: Concurrency vs Pagination - metadata}
	 */
	etags?: { [uuid: string]: string };
}
