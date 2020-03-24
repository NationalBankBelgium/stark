import { HttpResponse } from "@angular/common/http";
import { StarkHttpRawCollectionResponseData, StarkHttpRequest, StarkResource } from "../entities";

/**
 * This is the base interface for entities' serializers used mainly by the {@link StarkHttpService}.
 *
 * It is a generic interface defined by these types:
 * - `ResourceType`: type that this serializer handles.
 * - `RequestType`: defaults to {@link StarkHttpRequest}
 * - `ResponseType`: defaults to the Angular {@link https://v7.angular.io/api/common/http/HttpResponse|HttpResponse}
 */
export interface StarkHttpSerializer<
	ResourceType extends StarkResource,
	RequestType = StarkHttpRequest,
	ResponseType = HttpResponse<ResourceType | StarkHttpRawCollectionResponseData<ResourceType>>
> {
	/**
	 * Serialize the given resource entity into an object or a string
	 *
	 * @param resource - The entity to serialize
	 * @param request - Optional request object
	 *
	 * @returns The serialized form of the provided resource
	 */
	serialize(resource: ResourceType, request?: RequestType): string | object;

	/**
	 * Deserialize provided string or object into the corresponding resource entity
	 *
	 * @param raw - The raw format to deserialize from
	 * @param request - Optional request object
	 * @param response - Optional response object
	 *
	 * @returns The entity instance created out of the deserialization process.
	 */
	deserialize(raw: string | object, request?: RequestType, response?: ResponseType): ResourceType;
}
