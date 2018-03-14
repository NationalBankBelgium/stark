"use strict";

import {StarkSerializable} from "../../serialization";

export interface StarkHttpRequestParams {
	/**
	 * Whether to allow query parameters with undefined value or not. Default: false.
	 * @type {boolean}
	 */
	allowUndefinedQueryParams?: boolean;

	/**
	 * Whether to allow query parameters with empty value ('') or not. Default: false.
	 * @type {boolean}
	 */
	allowEmptyQueryParams?: boolean;

	/**
	 * Path parameters to be added in the url when working with nested resources
	 * @type {object}
	 */
	pathParameters?: { [param: string]: string };

	/**
	 * Query parameters to be added to the request
	 * @type {Map}
	 */
	queryParameters?: { [param: string]: string | string[] | undefined };

	/**
	 * Maximum number of times the request should be retried in case of error before emitting the failure. Default: 0
	 * @type {number}
	 */
	retryCount?: number;

	/**
	 * Custom type to be used to serialize/deserialize the resource instead of the default serialization type for the request
	 * @type {object}
	 */
	serializationType?: StarkSerializable;
}

export interface StarkHttpCreateRequestParams extends StarkHttpRequestParams {
}

export interface StarkHttpGetRequestParams extends StarkHttpRequestParams {
}

export interface StarkHttpUpdateRequestParams extends StarkHttpRequestParams {
	/**
	 * When true, the request-type uses HTTP PUT else it uses HTTP POST. Default: false
	 * @type boolean
	 */
	isIdempotent?: boolean;
}

export interface StarkHttpDeleteRequestParams extends StarkHttpRequestParams {
	/**
	 * Whether the delete should be enforced or not. Default: false
	 * When set to true, the ETag value is not passed.
	 * Only set this to true if it makes sense for the use case and if your back-end allows it!
	 * @type boolean
	 */
	force?: boolean;
}

export interface StarkHttpGetCollectionRequestParams extends StarkHttpRequestParams {
}

export interface StarkHttpSearchRequestParams extends StarkHttpRequestParams {
	/**
	 * Whether to allow criteria with empty value ('') or not. Default: false.
	 * @type {boolean}
	 */
	allowEmptyCriteria?: boolean;
}
