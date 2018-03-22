"use strict";

import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsString, IsUrl, Matches, Min, /* ValidateIf,*/ validateSync } from "class-validator";
import { autoserialize, autoserializeAs } from "cerialize";
import { StarkApplicationConfig } from "./app-config.entity.intf";
import { StarkBackend, StarkBackendImpl } from "../../../http/entities/backend/index";
import { stringMap } from "../../../serialization/index";
import { StarkValidationErrorsUtil } from "../../../util/index";
// import {StarkMapIsValid, StarkMapNotEmpty} from "../../../validation/decorators";

export class StarkApplicationConfigImpl implements StarkApplicationConfig {
	@IsDefined()
	@IsString()
	@autoserialize
	public rootStateUrl: string;

	@IsDefined()
	@IsString()
	@autoserialize
	public rootStateName: string;

	@IsDefined()
	@IsString()
	@autoserialize
	public homeStateName: string;

	@IsDefined()
	@IsString()
	@autoserialize
	public errorStateName: string;

	@IsDefined()
	@IsBoolean()
	@autoserialize
	public angularDebugInfoEnabled: boolean;

	@IsDefined()
	@IsBoolean()
	@autoserialize
	public debugLoggingEnabled: boolean;

	@IsNumber()
	@Min(1)
	@autoserialize
	public loggingFlushPersistSize: number;

	@IsDefined()
	@IsString()
	@autoserialize
	public loggingFlushApplicationId: string;

	@IsDefined()
	@IsString()
	@autoserialize
	public loggingFlushResourceName: string;

	@IsDefined()
	@IsBoolean()
	@autoserialize
	public routerLoggingEnabled: boolean;

	@IsNotEmpty()
	@IsString()
	@Matches(/^[a-z]{2}$/)
	@autoserialize
	public defaultLanguage: string;

	@IsDefined()
	@IsNumber()
	@autoserialize
	public sessionTimeout: number;

	@IsNumber()
	@autoserialize
	public sessionTimeoutWarningPeriod: number;

	@IsNumber()
	@autoserialize
	public keepAliveInterval: number;

	// @ValidateIf((keepAliveUrl: string) => typeof keepAliveUrl === "string")
	@IsUrl()
	@autoserialize
	public keepAliveUrl: string;

	@IsDefined()
	@IsUrl()
	@autoserialize
	public logoutUrl: string;

	@IsNotEmpty()
	@IsString()
	@autoserialize
	public baseUrl: string;

	@IsDefined()
	@IsBoolean()
	@autoserialize
	public publicApp: boolean;

	// @ValidateIf((loggingFlushDisabled: boolean) => typeof loggingFlushDisabled === "boolean")
	@IsBoolean()
	@autoserialize
	public loggingFlushDisabled: boolean;

	// @ValidateIf((keepAliveDisabled: boolean) => typeof keepAliveDisabled === "boolean")
	@IsBoolean()
	@autoserialize
	public keepAliveDisabled: boolean;
	//FIXME Import StarkMapIsValid & StarkMapNotEmpty  from validation/decorators
	// @StarkMapNotEmpty()
	// @StarkMapIsValid()
	@autoserializeAs(stringMap(StarkBackendImpl)) // using custom serialization type (stringMap) to handle ES6 Maps
	public backends: Map<string, StarkBackend> = new Map<string, StarkBackend>();

	public constructor() {
		// Default values
		// FIXME: DEVELOPMENT env variable?
		/*if (DEVELOPMENT) {
			this.loggingFlushPersistSize = 500;
		} else {*/
		this.loggingFlushPersistSize = 15;
		// }

		this.loggingFlushResourceName = "logging";
		this.sessionTimeoutWarningPeriod = 15;
		this.keepAliveInterval = 15;
	}

	public addBackend(backend: StarkBackend): void {
		if (!backend) {
			throw new Error("A backend instance must be provided");
		}

		StarkValidationErrorsUtil.throwOnError(validateSync(backend), "The backend instance provided is not valid.");

		this.backends.set(backend.name, backend);
	}

	public setBackends(backends: StarkBackend[]): void {
		this.backends = new Map<string, StarkBackend>();

		for (const backend of backends) {
			this.addBackend(backend);
		}
	}

	public getBackend(name: string): StarkBackend {
		const backend: StarkBackend | undefined = this.backends.get(name);
		if (backend === undefined) {
			throw new Error("Backend " + name + " is undefined.");
		}
		return backend;
	}

	public getBackends(): Map<string, StarkBackend> {
		return this.backends;
	}
}
