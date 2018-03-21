"use strict";

import {StarkHttpError} from "./http-error.entity.intf";
import {StarkHttpErrorWrapper} from "./http-error-wrapper.entity.intf";
import {StarkHttpStatusCodes} from "../../enumerators/index";

export class StarkHttpErrorWrapperImpl implements StarkHttpErrorWrapper {

	/** @internal */
	private _starkHttpStatusCode: StarkHttpStatusCodes;
	// TODO: return the Angular HttpHeaders or still return our own Map?
	/** @internal */
	private _starkHttpHeaders: Map<string, string>;
	/** @internal */
	private _httpError: StarkHttpError;

	public constructor(starkHttpStatusCode: StarkHttpStatusCodes,
					   starkHttpHeaders: Map<string, string>,
					   httpError: StarkHttpError) {
		this._starkHttpStatusCode = starkHttpStatusCode;
		this._starkHttpHeaders = starkHttpHeaders;
		this._httpError = httpError;
	}

	public get starkHttpStatusCode(): StarkHttpStatusCodes {
		return this._starkHttpStatusCode;
	}

	public get starkHttpHeaders(): Map<string, string> {
		return this._starkHttpHeaders;
	}

	public get httpError(): StarkHttpError {
		return this._httpError;
	}
}
