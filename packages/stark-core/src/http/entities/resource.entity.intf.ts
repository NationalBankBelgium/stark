"use strict";

import { StarkSingleItemMetadata } from "./metadata";

export interface StarkResource {
	uuid: string;
	etag?: string;

	/**
	 * Optionally, in single item responses only, the backend may return warnings along with the resource itself
	 * @link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Error-handling-Warnings
	 */
	metadata?: StarkSingleItemMetadata;
}
