/* tslint:disable:completed-docs*/
import { Inject, Injectable, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { StarkSerializable } from "../../../serialization";
import { STARK_USER_PROFILE_RESOURCE_PATH, StarkUser } from "../entities";
import { StarkHttpRequest, StarkSingleItemResponseWrapper } from "../../http/entities";
import { STARK_APP_CONFIG, StarkApplicationConfig } from "../../../configuration/entities/application";
import { StarkUserRepository, starkUserRepositoryName } from "./user.repository.intf";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "../../logging/services/logging.service.intf";
import { STARK_HTTP_SERVICE, StarkHttpService } from "../../http/services";
import { AbstractStarkHttpRepository } from "../../http/repository";
import { StarkConfigurationUtil } from "../../../util/configuration.util";

/**
 * The resource path to be used for the User profile fetching if no other resource path is specified.
 */
export const DEFAULT_USER_PROFILE_RESOURCE_PATH = "security/userprofile";

/**
 * @ignore
 */
@Injectable()
export class StarkUserRepositoryImpl extends AbstractStarkHttpRepository<StarkUser> implements StarkUserRepository {
	public constructor(
		@Inject(STARK_HTTP_SERVICE) starkHttpService: StarkHttpService<StarkUser>,
		@Inject(STARK_LOGGING_SERVICE) logger: StarkLoggingService,
		@Inject(STARK_APP_CONFIG) appConfig: StarkApplicationConfig,
		@Optional() @Inject(STARK_USER_PROFILE_RESOURCE_PATH) userProfileResourcePath?: string
	) {
		// ensuring that the app config is valid before doing anything
		StarkConfigurationUtil.validateConfig(appConfig, ["http"], starkUserRepositoryName);

		super(
			starkHttpService,
			logger,
			appConfig.getBackend("userProfile"),
			userProfileResourcePath ? userProfileResourcePath : DEFAULT_USER_PROFILE_RESOURCE_PATH
		);

		this.logger.debug(starkUserRepositoryName + " loaded");
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
