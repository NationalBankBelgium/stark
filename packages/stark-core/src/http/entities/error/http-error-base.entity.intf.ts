"use strict";

export interface StarkHttpErrorBase {
	type: string;
	title: string;
	titleKey: string;
	titleKeyParameters?: string[];
	instance?: string;
	timestamp?: string;
	metadata?: object;
}
