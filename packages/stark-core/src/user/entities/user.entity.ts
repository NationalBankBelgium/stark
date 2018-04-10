"use strict";

import { autoserialize } from "cerialize";
import { StarkUserProfile } from "./user-profile.entity.intf";
import { StarkUserSecurityProfile } from "./user-security-profile.entity.intf";
import { StarkResource } from "../../http/entities/index";
import { IsArray, IsBoolean, IsDefined, IsEmail, IsString, ValidateIf } from "class-validator";
import { StarkValidationMethodsUtil } from "../../util/validation-methods.util";

export class StarkUser implements StarkUserProfile, StarkUserSecurityProfile, StarkResource {
	@IsDefined()
	@IsString()
	@autoserialize
	public uuid: string;

	@IsDefined()
	@IsString()
	@autoserialize
	public username: string;

	@IsDefined()
	@IsString()
	@autoserialize
	public firstName: string;

	@IsDefined()
	@IsString()
	@autoserialize
	public lastName: string;

	@ValidateIf(StarkValidationMethodsUtil.validateIfDefined)
	@IsEmail()
	@autoserialize
	public email?: string;

	@ValidateIf(StarkValidationMethodsUtil.validateIfDefined)
	@IsString()
	@autoserialize
	public phone?: string;

	@ValidateIf(StarkValidationMethodsUtil.validateIfDefined)
	@IsString()
	@autoserialize
	public language: string;

	@ValidateIf(StarkValidationMethodsUtil.validateIfDefined)
	@IsString()
	@autoserialize
	public selectedLanguage?: string;

	@ValidateIf(StarkValidationMethodsUtil.validateIfDefined)
	@IsString()
	@autoserialize
	public referenceNumber?: string;

	@IsDefined()
	@IsArray()
	@autoserialize
	public roles: string[] = [];

	@ValidateIf(StarkValidationMethodsUtil.validateIfDefined)
	@IsString()
	@autoserialize
	public workpost?: string;

	@ValidateIf(StarkValidationMethodsUtil.validateIfDefined)
	@IsBoolean()
	@autoserialize
	public isAnonymous?: boolean;

	@autoserialize
	public custom?: object;

	/**
	 * Extract the properties coming in the "details" object.
	 * This is a callback method provided by cerialize in order to post-process the de-serialized json object.
	 * @param instance - Instantiated object with its properties already set as defined via the serializer annotations
	 * @param json - Raw json object retrieved from the http call
	 * @link https://confluence.prd.nbb/display/jag/REST+-+How-to+configure+the+user+profile+resource
	 */
	public static OnDeserialized(instance: StarkUser, json: any): void {
		if (json.details) {
			instance.language = json.details.language;
			instance.firstName = json.details.firstName;
			instance.lastName = json.details.lastName;
			instance.email = json.details.mail;
			instance.referenceNumber = json.details.referenceNumber;
		}
	}
}
