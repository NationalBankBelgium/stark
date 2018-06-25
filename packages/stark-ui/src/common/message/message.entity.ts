"use strict";

import { StarkMessage } from "./message.intf";
import { StarkMessageType } from "./message-type.intf";

/**
 * UniqueId of the message pane
 */
const _uniqueId: any = require("lodash/uniqueId");

export class StarkMessageImpl implements StarkMessage {
	public id: string;
	public key: string;
	public interpolateValues: object;
	public code: string;
	public type: StarkMessageType;

	public constructor() {
		// set random id
		this.id = _uniqueId();
	}
}
