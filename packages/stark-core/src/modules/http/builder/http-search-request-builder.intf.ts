import { StarkHttpBaseRequestBuilder } from "./http-abstract-base-request-builder.intf";
import { StarkHttpFetchResourceRequestBuilder } from "./http-abstract-fetch-resource-request-builder.intf";
import { StarkResource } from "../entities/resource.entity.intf";

/**
 * Describes the different operations supported by Http request builders for resource-searching requests
 */
export interface StarkHttpSearchRequestBuilder<T extends StarkResource>
	extends StarkHttpBaseRequestBuilder<T>,
		StarkHttpFetchResourceRequestBuilder {}
