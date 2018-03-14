"use strict";

import {deserializeAs, inheritSerialization} from "cerialize";
import {StarkHttpErrorBaseImpl} from "./http-error-base.entity";
import {StarkHttpError} from "./http-error.entity.intf";
import {StarkHttpErrorDetail} from "./http-error-detail.entity.intf";
import {StarkHttpErrorDetailImpl} from "./http-error-detail.entity";

@inheritSerialization(StarkHttpErrorBaseImpl)
export class StarkHttpErrorImpl extends StarkHttpErrorBaseImpl implements StarkHttpError {
	@deserializeAs(StarkHttpErrorDetailImpl)
	public errors: StarkHttpErrorDetail[];
}
