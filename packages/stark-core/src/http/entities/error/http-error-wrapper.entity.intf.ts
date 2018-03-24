"use strict";

import { StarkHttpResponse } from "../response";
import { StarkHttpError } from "./http-error.entity.intf";

export interface StarkHttpErrorWrapper extends StarkHttpResponse {
	httpError: StarkHttpError;
}
