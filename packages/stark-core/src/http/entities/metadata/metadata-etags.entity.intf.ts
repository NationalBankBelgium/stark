"use strict";

export interface StarkETags {
	/**
	 * For collection responses only.
	 * Object containing the mapping between the items in the collection "items" array and the ETag value for each.
	 * @link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Concurrency-vs-Pagination#metadata
	 */
	etags?: { [uuid: string]: string };
}
