"use strict";

import { StarkLogMessage } from "./log-message.entity.intf";
import { StarkLogging } from "./logging.entity.intf";
import { autoserialize, autoserializeAs } from "cerialize";
import { StarkLogMessageImpl } from "./log-message.entity";

export class StarkLoggingImpl implements StarkLogging {
	@autoserialize public uuid: string;
	@autoserialize public applicationId: string;
	@autoserializeAs(StarkLogMessageImpl) public messages: StarkLogMessage[];
}
