import { StarkHttpBaseRequestBuilder } from "./http-abstract-base-request-builder.intf";
import { StarkResource } from "../entities/resource.entity.intf";

export interface StarkHttpDeleteRequestBuilder<T extends StarkResource> extends StarkHttpBaseRequestBuilder<T> {}
