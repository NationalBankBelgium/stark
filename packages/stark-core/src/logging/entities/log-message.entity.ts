"use strict";

import moment from "moment";
import { autoserialize, autoserializeAs } from "cerialize";
import { StarkLogMessageType } from "./log-message-type.entity";
import { StarkLogMessage } from "./log-message.entity.intf";

export class StarkLogMessageImpl implements StarkLogMessage {
	@autoserialize public timestamp: string;
	@autoserialize public message: string;
	@autoserializeAs(StarkLogMessageType) public type: StarkLogMessageType;
	@autoserialize public correlationId: string;
	@autoserialize public error: string | undefined;

	public constructor(type: StarkLogMessageType, message: string, correlationId: string, error?: string | undefined) {
		this.timestamp = moment().format(); // ISO-8601 format
		this.type = type;
		this.message = message;
		this.error = error;
		this.correlationId = correlationId;
	}
}
