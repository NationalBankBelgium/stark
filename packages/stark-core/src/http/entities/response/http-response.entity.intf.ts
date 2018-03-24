"use strict";

import { StarkHttpStatusCodes } from "../../enumerators/index";

export interface StarkHttpResponse {
	starkHttpStatusCode: StarkHttpStatusCodes;
	starkHttpHeaders: Map<string, string>;
}
