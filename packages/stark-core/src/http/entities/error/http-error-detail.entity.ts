"use strict";

import {deserialize, inheritSerialization} from "cerialize";
import {StarkHttpErrorBaseImpl} from "./http-error-base.entity";
import {StarkHttpErrorDetail} from "./http-error-detail.entity.intf";

@inheritSerialization(StarkHttpErrorBaseImpl)
export class StarkHttpErrorDetailImpl extends StarkHttpErrorBaseImpl implements StarkHttpErrorDetail {

	@deserialize
	public detail: string;

	@deserialize
	public detailKey: string;

	@deserialize
	public detailKeyParameters: string[];

	@deserialize
	public fields: string[];

	@deserialize
	public status: string;

	@deserialize
	public index: number;
}
