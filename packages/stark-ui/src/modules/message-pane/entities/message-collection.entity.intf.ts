"use strict";

import { StarkMessage } from "../../../common/message";

/**
 * A collection of messages
 */
export interface StarkMessageCollection {
	infoMessages: StarkMessage[];
	warningMessages: StarkMessage[];
	errorMessages: StarkMessage[];
}
