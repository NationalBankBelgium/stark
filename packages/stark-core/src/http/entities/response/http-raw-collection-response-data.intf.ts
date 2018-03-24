"use strict";

import { StarkCollectionMetadata } from "../metadata";

export interface StarkHttpRawCollectionResponseData<P> {
	items: P[];
	metadata: StarkCollectionMetadata;
}
