"use strict";

import {StarkCollectionResponseWrapper} from "./collection-response-wrapper.entity.intf";
import {StarkResource} from "../resource.entity.intf";
import {StarkCollectionMetadata} from "../metadata";
import {StarkHttpStatusCodes} from "../../enumerators";

export class StarkCollectionResponseWrapperImpl<T extends StarkResource> implements StarkCollectionResponseWrapper<T> {
	private _starkHttpStatusCode: StarkHttpStatusCodes;
	// TODO: return the Angular HttpHeaders or still return our own Map?
	private _starkHttpHeaders: Map<string, string>;
	private _data: T[];
	private _metadata: StarkCollectionMetadata;

	public constructor(starkHttpStatusCode: StarkHttpStatusCodes,
					   starkHttpHeaders: Map<string, string>,
					   data: T[],
					   metadata: StarkCollectionMetadata) {
		this._starkHttpStatusCode = starkHttpStatusCode;
		this._starkHttpHeaders = starkHttpHeaders;
		this._data = data;
		this._metadata = metadata;
	}

	public get starkHttpStatusCode(): StarkHttpStatusCodes {
		return this._starkHttpStatusCode;
	}

	public get starkHttpHeaders(): Map<string, string> {
		return this._starkHttpHeaders;
	}

	public get data(): T[] {
		return this._data;
	}

	public get metadata(): StarkCollectionMetadata {
		return this._metadata;
	}
}
