"use strict";

import {deserializeAs} from "cerialize";
import {StarkSingleItemMetadata} from "./single-item-metadata.entity.intf";
import {StarkHttpErrorDetail, StarkHttpErrorDetailImpl} from "../error";

export class StarkSingleItemMetadataImpl implements StarkSingleItemMetadata {
	@deserializeAs(StarkHttpErrorDetailImpl)
	public warnings?: StarkHttpErrorDetail[];
}
