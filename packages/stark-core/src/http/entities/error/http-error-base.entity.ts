"use strict";

import { deserialize } from "cerialize";

import { StarkHttpErrorBase } from "./http-error-base.entity.intf";

export class StarkHttpErrorBaseImpl implements StarkHttpErrorBase {
	@deserialize public type: string;

	@deserialize public title: string;

	@deserialize public titleKey: string;

	@deserialize public titleKeyParameters: string[];

	@deserialize public instance: string;

	@deserialize public timestamp: string;

	@deserialize public metadata?: object;
}
