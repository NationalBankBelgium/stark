"use strict";

import { StarkLogMessageType } from "./log-message-type.entity";

export interface StarkLogMessage {
	timestamp: string;
	message: string;
	type: StarkLogMessageType;
	correlationId: string;
	error: string | undefined;
}
