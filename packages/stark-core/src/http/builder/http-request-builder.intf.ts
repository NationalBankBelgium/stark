"use strict";

import {StarkHttpCreateRequestBuilder} from "./http-create-request-builder.intf";
import {StarkHttpDeleteRequestBuilder} from "./http-delete-request-builder.intf";
import {StarkHttpGetRequestBuilder} from "./http-get-request-builder.intf";
import {StarkHttpGetCollectionRequestBuilder} from "./http-get-collection-request-builder.intf";
import {StarkHttpSearchRequestBuilder} from "./http-search-request-builder.intf";
import {StarkHttpUpdateRequestBuilder} from "./http-update-request-builder.intf";
import {
	StarkHttpCreateRequestParams,
	StarkHttpDeleteRequestParams,
	StarkHttpGetCollectionRequestParams,
	StarkHttpGetRequestParams,
	StarkHttpSearchRequestParams,
	StarkHttpUpdateRequestParams
} from "./http-request-parameters.intf";
import {StarkResource} from "../entities/resource.entity.intf";

/**
 * Stark Http Request Builder
 * Builder to construct an StarkRequest that can be executed by the StarkHttpService
 */
export interface StarkHttpRequestBuilder<T extends StarkResource> {
	/**
	 * Gets an instance of a suitable builder to perform a Create request
	 * @param item {object} Item to be sent in the Create request
	 * @param params {StarkHttpCreateRequestParams}
	 * @returns {StarkHttpCreateRequestBuilder}
	 */
	create(item: T, params?: StarkHttpCreateRequestParams): StarkHttpCreateRequestBuilder<T>;

	/**
	 * Gets an instance of a suitable builder to perform an Update request
	 * @param item {object} Item to be sent in the Update request
	 * @param params {StarkHttpUpdateRequestParams}
	 * @returns {StarkHttpUpdateRequestBuilder}
	 */
	update(item: T, params?: StarkHttpUpdateRequestParams): StarkHttpUpdateRequestBuilder<T>;

	/**
	 * Gets an instance of a suitable builder to perform a Delete request
	 * @param item {object} Item to be sent in the Delete request
	 * @param params {StarkHttpDeleteRequestParams}
	 * @returns {StarkHttpDeleteRequestBuilder}
	 */
	delete(item: T, params?: StarkHttpDeleteRequestParams): StarkHttpDeleteRequestBuilder<T>;

	/**
	 * Gets an instance of a suitable builder to perform a Get request
	 * @param uuid {string} UUID of the item to be fetched by the Get request
	 * @param params {StarkHttpGetRequestParams}
	 * @returns {StarkHttpGetRequestBuilder}
	 */
	get(uuid: string, params?: StarkHttpGetRequestParams): StarkHttpGetRequestBuilder<T>;

	/**
	 * Gets an instance of a suitable builder to perform a GetCollection request
	 * @param limit {number} Maximum number of items to return
	 * @param offset {number} Index at which to begin the extraction of the collection to be returned
	 * @param params {StarkHttpGetCollectionRequestParams}
	 * @returns {StarkHttpGetCollectionRequestBuilder}
	 */
	getCollection(limit: number,
				  offset: number,
				  params?: StarkHttpGetCollectionRequestParams): StarkHttpGetCollectionRequestBuilder<T>;

	/**
	 * Gets an instance of a suitable builder to perform a Search request. Similar to a GetCollection request but the search
	 * parameters are sent in the request body payload whereas in the GetCollection request they are sent as URL query parameters
	 * @param criteria {object} Object containing the search criteria to be sent in the request body payload
	 * @param limit {number} Maximum number of items to return
	 * @param offset {number} Index at which to begin the extraction of the collection to be returned
	 * @param params {StarkHttpSearchRequestParams}
	 * @returns {StarkHttpSearchRequestBuilder}
	 */
	search(criteria: { [param: string]: string } | object,
		   limit: number,
		   offset: number,
		   params?: StarkHttpSearchRequestParams): StarkHttpSearchRequestBuilder<T>;
}
