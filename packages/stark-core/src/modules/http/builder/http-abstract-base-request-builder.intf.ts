import { StarkHttpRequest, StarkQueryParam, StarkResource } from "../entities";

/**
 * The `StarkHttpBaseRequestBuilder` interface is used to build a {@link https://v12.angular.io/api/common/http/HttpRequest|HttpRequest}.
 * Thanks to this class, headers, query parameters, etc. can be added to the request.
 */
export interface StarkHttpBaseRequestBuilder<T extends StarkResource> {
	/**
	 * Adds a header to the request
	 * @param name - Header name
	 * @param value - Header value. In case of multiple values, they should be provided in an array.
	 * @returns The current builder
	 */
	setHeader(name: string, value: string | string[]): this;

	/**
	 * Adds a query parameter to the request (if the parameter already exists it will be overwritten)
	 *
	 * @param name - Query parameter name
	 * @param value - `StarkQueryParam` object to be used as the query parameter value
	 * @param allowUndefined - (Optional) Whether to include the query parameter even if it has an `undefined` value. Default: `false`.
	 * @param allowEmpty - (Optional) Whether to include the query parameter even if it is an empty string. Default: `false`.
	 * @returns The current builder
	 */
	addQueryParameter(name: string, value: StarkQueryParam, allowUndefined?: boolean, allowEmpty?: boolean): this;

	/**
	 * Adds query parameters to the request (adds them to the existing query parameters)
	 *
	 * @param params - Object containing the `StarkQueryParam` objects to be added to the request
	 * @param allowUndefined - (Optional) Whether to include the query parameters even if they have `undefined` values. Default: `false`.
	 * @param allowEmpty - (Optional) Whether to include the query parameter even if it is an empty string. Default: `false`.
	 * @returns The current builder
	 */
	addQueryParameters(params: { [param: string]: StarkQueryParam }, allowUndefined?: boolean, allowEmpty?: boolean): this;

	/**
	 * Sets query parameters to the request (all existing query parameters will be lost)
	 *
	 * @param params - Object containing the `StarkQueryParam` objects to be added to the request
	 * @param allowUndefined - (Optional) Whether to include the query parameters even if they have `undefined` values. Default: `false`.
	 * @param allowEmpty - (Optional) Whether to include the query parameter even if it is an empty string. Default: `false`.
	 * @returns The current builder
	 */
	setQueryParameters(params: { [param: string]: StarkQueryParam }, allowUndefined?: boolean, allowEmpty?: boolean): this;

	/**
	 * Interpolates the parameters in the resource path with actual values
	 * @param params - Object with the values to interpolate in the resource path
	 * @returns The current builder
	 */
	setPathParameters(params: { [param: string]: string }): this;

	/**
	 * Sets the number of times the request should be retried in case of error before emitting the failure
	 * @param retryCount - Maximum number of attempts
	 * @returns The current builder
	 */
	retry(retryCount: number): this;

	/**
	 * Returns an instance of the constructed {@link StarkHttpRequest}.
	 *
	 * **It should be always the last method to be called.**
	 *
	 * @returns The constructed request
	 */
	build(): StarkHttpRequest<T>;
}
