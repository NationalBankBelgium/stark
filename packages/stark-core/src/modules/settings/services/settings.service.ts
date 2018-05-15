import { Inject, Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { filter } from "rxjs/operators";

import { StarkLoggingService, starkLoggingServiceName } from "../../logging/services";
import { StarkSettingsService, starkSettingsServiceName } from "./settings.service.intf";
import { SetPreferredLanguage } from "../actions";
import {
	STARK_APP_CONFIG,
	STARK_APP_METADATA,
	StarkApplicationConfig,
	StarkApplicationMetadata,
	StarkLanguage
} from "../../../configuration/entities";
import { StarkUser } from "../../user/entities";
import { StarkCoreApplicationState } from "../../../common/store";
import { selectStarkUser } from "../../user";

/**
 * @ngdoc service
 * @name stark-core.service:StarkSettingsService
 * @description Service that allows the manipulation of application settings, some of which can be persisted.
 *
 * @requires StarkLoggingService
 * @requires ngrx-store.Store
 * @requires StarkApplicationConfig
 */
@Injectable()
export class StarkSettingsServiceImpl implements StarkSettingsService {
	public preferredLanguage: string;

	public constructor(
		@Inject(starkLoggingServiceName) public logger: StarkLoggingService,
		public store: Store<StarkCoreApplicationState>,
		@Inject(STARK_APP_METADATA) private appMetadata: StarkApplicationMetadata,
		@Inject(STARK_APP_CONFIG) private appConfig: StarkApplicationConfig
	) {
		this.logger.debug(starkSettingsServiceName + " loaded");

		this.preferredLanguage = this.appConfig.defaultLanguage;
	}

	public initializeSettings(): void {
		this.store
			.pipe(
				select(selectStarkUser),
				filter((user?: StarkUser) => typeof user !== "undefined" && typeof user.language !== "undefined")
			)
			.subscribe((user?: StarkUser) => {
				if (
					(<StarkUser>user).language !== null &&
					typeof (<StarkUser>user).language === "string" &&
					this.appMetadata.supportedLanguages.findIndex((language: StarkLanguage) => {
						return language.code.toLowerCase() === (<string>(<StarkUser>user).language).toLowerCase();
					}) > -1
				) {
					this.setPreferredLanguage(<string>(<StarkUser>user).language);
				} else {
					const browserLanguage: string = navigator.language || navigator["userLanguage"];
					if (typeof browserLanguage === "string") {
						let languageIndex: number = this.appMetadata.supportedLanguages.findIndex((language: StarkLanguage) => {
							return language.isoCode === browserLanguage;
						});
						if (languageIndex < 0) {
							const browserLanguageCode: string = browserLanguage.split("-")[0];
							languageIndex = this.appMetadata.supportedLanguages.findIndex((language: StarkLanguage) => {
								return language.code === browserLanguageCode;
							});
						}
						if (languageIndex > -1) {
							this.setPreferredLanguage(this.appMetadata.supportedLanguages[languageIndex].code);
						} else {
							this.setPreferredLanguage(this.appConfig.defaultLanguage);
						}
					} else {
						this.setPreferredLanguage(this.appConfig.defaultLanguage);
					}
				}
			});
	}

	public persistPreferredLanguage(): void {
		// implement
	}

	public getPreferredLanguage(): string {
		return this.preferredLanguage;
	}

	public setPreferredLanguage(language: string): void {
		this.preferredLanguage = language;
		this.store.dispatch(new SetPreferredLanguage(language));
	}
}
