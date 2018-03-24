"use strict";

import { StarkResponseWrapper } from "./response-wrapper.entity.intf";
import { StarkResource } from "../resource.entity.intf";
import { StarkCollectionMetadata } from "../metadata";

export interface StarkCollectionResponseWrapper<P extends StarkResource> extends StarkResponseWrapper<P[]> {
	metadata: StarkCollectionMetadata;
}
