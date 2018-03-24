"use strict";

import { StarkHttpResponse } from "./http-response.entity.intf";

export interface StarkResponseWrapper<T> extends StarkHttpResponse {
	data: T;
}
