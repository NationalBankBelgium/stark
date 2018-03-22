"use strict";

import { StarkLogMessage } from "./log-message.entity.intf";

export interface StarkLogging {
	uuid: string;
	applicationId: string;
	messages: StarkLogMessage[];
}
