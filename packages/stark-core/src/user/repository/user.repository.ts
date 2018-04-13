"use strict";

import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { StarkSerializable } from "../../serialization/index";
import { StarkUser } from "../entities/index";
import { StarkHttpRequest, StarkSingleItemResponseWrapper } from "../../http/entities/index";
import { StarkApplicationConfig, STARK_APP_CONFIG } from "../../configuration/entities/application/index";
import { StarkUserRepository } from "./user.repository.intf";
import { StarkLoggingService, starkLoggingServiceName } from "../../logging/services/logging.service.intf";
import { StarkHttpService, starkHttpServiceName } from "../../http/services/index";
import { AbstractStarkHttpRepository } from "../../http/repository/index";

/**
 * @ngdoc service
 * @name stark-core.repository:StarkUserRepository
 * @description Repository to fetch user profile from the backend.
 *
 * @requires StarkHttpService
 * @requires StarkLoggingService
 * @requires StarkApplicationConfig
 */
@Injectable()
export class StarkUserRepositoryImpl extends AbstractStarkHttpRepository<StarkUser> implements StarkUserRepository {
	public constructor(
		@Inject(starkHttpServiceName) starkHttpService: StarkHttpService<StarkUser>,
		@Inject(starkLoggingServiceName) logger: StarkLoggingService,
		@Inject(STARK_APP_CONFIG) appConfig: StarkApplicationConfig
	) {
		super(starkHttpService, logger, appConfig.getBackend("userProfile"), "security/userprofile");
	}

	public getUser(): Observable<StarkSingleItemResponseWrapper<StarkUser>> {
		// fetch the user profile (in full-detail style) and retry 5 times in case or error
		const userProfileRequest: StarkHttpRequest = this.getRequestBuilder()
			.get(":dummyUUID")
			.addFilterByStyle("full-details")
			.retry(5)
			.build();
		// the userProfile REST service does not need a UUID
		userProfileRequest.resourcePath = userProfileRequest.resourcePath.replace("/:dummyUUID", "");
		return this.starkHttpService.executeSingleItemRequest(userProfileRequest);
	}

	protected get type(): StarkSerializable {
		return StarkUser;
	}
}
