"use strict";

import {StarkHttpRequest, StarkResource} from "../entities";

export interface StarkHttpBaseRequestBuilder<T extends StarkResource> {

	/**
	 * Adds a header to the request
	 * @param name {string} Header name
	 * @param value {string} Header value
	 * @returns {this} The current builder
	 */
	setHeader(name: string, value: string): this;

	/**
	 * Adds a query parameter to the request (if the parameter already exists it will be overwritten)
	 * @param name {string} Query parameter name
	 * @param value {string|string[]|undefined} Query parameter value
	 * @param allowUndefined {boolean} Whether to include the query parameter even if it has an undefined value. Default: false.
	 * @param allowEmpty {boolean} Whether to include the query parameter even if it is an empty string. Default: false.
	 * @returns {this} The current builder
	 */
	addQueryParameter(name: string, value: string | string[] | undefined,
					  allowUndefined?: boolean, allowEmpty?: boolean): this;

	/**
	 * Adds query parameters to the request (adds them to the existing query parameters)
	 * @param params {object} Object with the query parameters to be added to the request
	 * @param allowUndefined {boolean} Whether to include the query parameters even if they have undefined values. Default: false.
	 * @param allowEmpty {boolean} Whether to include the query parameter even if it is an empty string. Default: false.
	 * @returns {this} The current builder
	 */
	addQueryParameters(params: { [param: string]: string | string[] | undefined },
					   allowUndefined?: boolean, allowEmpty?: boolean): this;

	/**
	 * Sets query parameters to the request (all existing query parameters will be lost)
	 * @param params {object} Object with the query parameters to be added to the request
	 * @param allowUndefined {boolean} Whether to include the query parameters even if they have undefined values. Default: false.
	 * @param allowEmpty {boolean} Whether to include the query parameter even if it is an empty string. Default: false.
	 * @returns {this} The current builder
	 */
	setQueryParameters(params: { [param: string]: string | string[] | undefined },
					   allowUndefined?: boolean, allowEmpty?: boolean): this;

	/**
	 * Interpolates the parameters in the resource path with actual values
	 * @param params {object} Object with the values to interpolate in the resource path
	 * @returns {this} The current builder
	 */
	setPathParameters(params: { [param: string]: string }): this;

	/**
	 * Sets the number of times the request should be retried in case of error before emitting the failure
	 * @param retryCount {number} Maximum number of attempts
	 * @returns {this} The current builder
	 */
	retry(retryCount: number): this;

	/**
	 * Returns an instance of the constructed StarkHttpRequest. It should be always the last method to be called.
	 * @returns {StarkHttpRequest} The constructed request
	 */
	build(): StarkHttpRequest<T>;
}
