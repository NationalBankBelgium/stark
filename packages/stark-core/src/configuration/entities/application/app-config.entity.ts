"use strict";

import { IsBoolean, IsDefined, IsNotEmpty, IsPositive, IsString, IsUrl, Matches, Min, ValidateIf, validateSync } from "class-validator";
import { autoserialize, autoserializeAs } from "cerialize";
import { StarkApplicationConfig } from "./app-config.entity.intf";
import { StarkBackend, StarkBackendImpl } from "../../../http/entities/backend/index";
import { stringMap } from "../../../serialization/index";
import { StarkValidationErrorsUtil } from "../../../util/index";
// FIXME Implement the following decorators as before
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

	@ValidateIf(StarkApplicationConfigImpl.validateIfLoggingFlushEnabled)
	@IsPositive()
	@Min(2)
	@autoserialize
	public loggingFlushPersistSize?: number;

	@ValidateIf(StarkApplicationConfigImpl.validateIfLoggingFlushEnabled)
	@IsDefined()
	@IsString()
	@autoserialize
	public loggingFlushApplicationId?: string;

	@ValidateIf(StarkApplicationConfigImpl.validateIfLoggingFlushEnabled)
	@IsDefined()
	@IsString()
	@autoserialize
	public loggingFlushResourceName?: string;

	@IsBoolean()
	@autoserialize
	public loggingFlushDisabled?: boolean;

	@IsDefined()
	@IsBoolean()
	@autoserialize
	public routerLoggingEnabled: boolean;

	@IsBoolean()
	@autoserialize
	public routerVisualizerEnabled: boolean;

	@IsNotEmpty()
	@IsString()
	@Matches(/^[a-z]{2}$/)
	@autoserialize
	public defaultLanguage: string;

	@IsDefined()
	@IsPositive()
	@autoserialize
	public sessionTimeout: number;

	@IsPositive()
	@autoserialize
	public sessionTimeoutWarningPeriod: number;

	@ValidateIf(StarkApplicationConfigImpl.validateIfKeepAliveEnabled)
	@IsPositive()
	@autoserialize
	public keepAliveInterval?: number;

	@ValidateIf(StarkApplicationConfigImpl.validateIfKeepAliveEnabled)
	@IsUrl()
	@autoserialize
	public keepAliveUrl?: string;

	@IsBoolean()
	@autoserialize
	public keepAliveDisabled?: boolean;

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

		this.loggingFlushDisabled = false;
		this.loggingFlushResourceName = "logging";
		this.sessionTimeout = 900; // default timeout of the F5
		this.sessionTimeoutWarningPeriod = 15;
		this.keepAliveDisabled = false;
		this.keepAliveInterval = 15;
		this.routerVisualizerEnabled = false;
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

	public static validateIfKeepAliveEnabled(instance: StarkApplicationConfig): boolean {
		return instance.keepAliveDisabled !== true;
	}

	public static validateIfLoggingFlushEnabled(instance: StarkApplicationConfig): boolean {
		return instance.loggingFlushDisabled !== true;
	}
}
