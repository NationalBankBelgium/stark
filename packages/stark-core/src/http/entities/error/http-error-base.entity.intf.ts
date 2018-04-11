"use strict";

import { StarkError } from "../../../common/index";

export interface StarkHttpErrorBase extends StarkError {
	type: string;
	title: string;
	titleKey: string;
	titleKeyParameters?: string[];
	instance?: string;
	timestamp?: string;
	metadata?: object;
}
