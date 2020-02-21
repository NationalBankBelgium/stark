import { StarkMessage } from "./message.intf";
import { StarkMessageType } from "./message-type.intf";
import uniqueId from "lodash-es/uniqueId";

/**
 * @ignore
 */
export class StarkMessageImpl implements StarkMessage {
	public id: string;

	public constructor(
		id: string | undefined,
		public key: string,
		public code: string,
		public type: StarkMessageType,
		public interpolateValues?: object,
		public priority?: number
	) {
		this.id = id || uniqueId();
	}
}
