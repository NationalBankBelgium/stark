import { StarkLogMessageType } from "./log-message-type.entity";
import { StarkError } from "../../common";

export interface StarkLogMessage {
	timestamp: string;
	message: string;
	type: StarkLogMessageType;
	correlationId: string;
	error?: StarkError;
}
