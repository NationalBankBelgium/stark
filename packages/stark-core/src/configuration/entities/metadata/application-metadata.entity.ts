"use strict";

import {ArrayNotEmpty, IsDefined, IsNotEmpty, IsString, ValidateNested} from "class-validator";
import {autoserialize} from "cerialize";

import {StarkApplicationMetadata} from "./application-metadata.entity.intf";
import {StarkLanguageImpl} from "../language";
import {StarkLanguage} from "../language/language.entity.intf";
import {StarkLanguages} from "../language/language.constants";

export class StarkApplicationMetadataImpl implements StarkApplicationMetadata {
	@IsNotEmpty()
	@IsString()
	@autoserialize
	public name: string;

	@IsNotEmpty()
	@IsString()
	@autoserialize
	public description: string;

	@IsNotEmpty()
	@IsString()
	@autoserialize
	public version: string;

	@IsNotEmpty()
	@IsString()
	@autoserialize
	public environment: string;

	@IsNotEmpty()
	@IsString()
	@autoserialize
	public buildTimestamp: string;

	@IsNotEmpty()
	@IsString()
	@autoserialize
	public deploymentTimestamp: string;

	@IsDefined()
	@ArrayNotEmpty()
	@ValidateNested({each: true}) // validate each item of the array
	public supportedLanguages: StarkLanguageImpl[] = [];

	/**
	 * Callback method provided by cerialize in order to post-process the de-serialized json object
	 * @param instance {StarkApplicationMetadataImpl} instantiated object with its properties already
	 * set as defined via the serializer annotations
	 * @param json {Object} raw json object loaded from file
	 * @constructor
	 */
	public static OnDeserialized(instance: StarkApplicationMetadataImpl, json: any): void {
		const supportedLanguages: string[] = json["supportedLanguages"];

		for (const item of supportedLanguages) {
			if (item) {
				const languageConstant: StarkLanguage = StarkLanguages[item.toUpperCase().replace("-", "_")];
				if (languageConstant) {
					instance.supportedLanguages.push(languageConstant);
				} else {
					instance.supportedLanguages.push(new StarkLanguageImpl(item, "..."));
				}
			}
		}
	}
}
