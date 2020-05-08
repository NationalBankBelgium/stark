import { StarkBackend } from "../entities/backend";
import { StarkSortItem } from "./metadata";
import { StarkHttpRequestType } from "./http-request-type.entity";
import { StarkResource } from "./resource.entity.intf";
import { StarkHttpSerializer } from "../serializer";

export type StarkQueryParam = string | string[] | undefined;

/**
 * This interface describes all the available options of an Http request performed via the {@link StarkHttpService}.
 */
export interface StarkHttpRequest<P extends StarkResource = StarkResource> {
	/**
	 * The backend that the request will target.
	 */
	backend: StarkBackend;
	/**
	 * The path of the request's target resource.
	 */
	resourcePath: string;
	/**
	 * The sort criteria that will be sent along with the request as query parameters.
	 */
	sortItems?: StarkSortItem[];
	/**
	 * Array of fields that the backend is requested to include in the response.
	 */
	fieldsToInclude?: string[];
	/**
	 * Map containing the headers to be sent with the request. **Multiple values for a header are supported.**
	 */
	headers: Map<string, string | string[]>;
	/**
	 * Map containing the {@link StarkQueryParam} objects that will be included as query parameters.
	 * 
	 * The query parameters might be `undefined` values in case the `allowUndefinedQueryParams` option is enabled and passed to the corresponding builder.
	 * 
	 * **If an array of strings is defined as value, then the parameter will be added to the URL for every value in the array.**
	 */
	queryParameters: Map<string, StarkQueryParam>;
	/**
	 * The type of request according to the different CRUD operations.
	 */
	requestType: StarkHttpRequestType;
	/**
	 * The items/resources to send in the request (if needed).
	 */
	item?: P | { [param: string]: any };
	/**
	 * A serializer class that will perform the serialization/deserialization of the items to be sent/received to/from the backend.
	 */
	serializer: StarkHttpSerializer<P>;
	/**
	 * The number of times the request will be retried in case of error.
	 */
	retryCount?: number;
}
