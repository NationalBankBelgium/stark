import { StarkHttpBaseRequestBuilder } from "./http-abstract-base-request-builder.intf";
import { StarkHttpFetchResourceRequestBuilder } from "./http-abstract-fetch-resource-request-builder.intf";
import { StarkResource } from "../entities/resource.entity.intf";

export interface StarkHttpGetCollectionRequestBuilder<T extends StarkResource>
	extends StarkHttpBaseRequestBuilder<T>,
		StarkHttpFetchResourceRequestBuilder {}
