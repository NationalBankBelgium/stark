import { StarkBackend } from "../entities/backend";
import { StarkSortItem } from "./metadata";
import { StarkHttpRequestType } from "./http-request-type.entity";
import { StarkResource } from "./resource.entity.intf";
import { StarkHttpSerializer } from "../serializer";

export type StarkQueryParam = string | string[] | undefined;

export interface StarkHttpRequest<P extends StarkResource = StarkResource> {
	backend: StarkBackend;
	resourcePath: string;
	sortItems?: StarkSortItem[];
	fieldsToInclude?: string[];
	headers: Map<string, string>;
	queryParameters: Map<string, StarkQueryParam>;
	requestType: StarkHttpRequestType;
	item?: P | { [param: string]: any };
	serializer: StarkHttpSerializer<P>;
	retryCount?: number;
}
