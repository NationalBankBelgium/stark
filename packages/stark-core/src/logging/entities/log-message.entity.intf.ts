"use strict";

import { StarkLogMessageType } from "./log-message-type.entity";
import { StarkError } from "../../common/index";

export interface StarkLogMessage {
	timestamp: string;
	message: string;
	type: StarkLogMessageType;
	correlationId: string;
	error?: StarkError;
}
