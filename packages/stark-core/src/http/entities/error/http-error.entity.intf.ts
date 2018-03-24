"use strict";

import { StarkHttpErrorBase } from "./http-error-base.entity.intf";
import { StarkHttpErrorDetail } from "./http-error-detail.entity.intf";

export interface StarkHttpError extends StarkHttpErrorBase {
	errors: StarkHttpErrorDetail[];
}
