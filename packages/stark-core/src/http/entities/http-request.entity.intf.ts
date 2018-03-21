"use strict";

import {StarkBackend} from "../entities/backend";
import {StarkSortItem} from "./metadata/index";
import {StarkHttpRequestType} from "./http-request-type.entity";
import {StarkResource} from "./resource.entity.intf";
import {StarkHttpSerializer} from "../serializer";

export interface StarkHttpRequest<P extends StarkResource = StarkResource> {
	backend: StarkBackend;
	resourcePath: string;
	sortItems?: StarkSortItem[];
	fieldsToInclude?: string[];
	headers: Map<string, string>;
	queryParameters: Map<string, string | string[] | undefined>;
	requestType: StarkHttpRequestType;
	item?: P | { [param: string]: any };
	serializer: StarkHttpSerializer<P>;
	retryCount?: number;
}
