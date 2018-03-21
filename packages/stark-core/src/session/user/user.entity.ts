"use strict";

import {autoserialize} from "cerialize";
import {StarkUserProfile} from "./user-profile.entity.intf";
import {StarkUserSecurityProfile} from "./user-security-profile.entity.intf";
import {StarkResource} from "../../http/index";
// import {IsArray, IsBoolean, IsDefined, IsEmail, IsString, ValidateIf} from "class-validator";
import {IsArray, IsBoolean, IsDefined, IsEmail, IsString} from "class-validator";

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

	// @ValidateIf((user: StarkUser) => typeof user.email !== "undefined" && user.email !== null)
	@IsEmail()
	@autoserialize
	public email?: string;

	// @ValidateIf((user: StarkUser) => typeof user.phone !== "undefined" && user.phone !== null)
	@IsString()
	@autoserialize
	public phone?: string;

	// @ValidateIf((user: StarkUser) => typeof user.language !== "undefined" && user.language !== null)
	@IsString()
	@autoserialize
	public language: string;

	// @ValidateIf((user: StarkUser) => typeof user.selectedLanguage !== "undefined" && user.selectedLanguage !== null)
	@IsString()
	@autoserialize
	public selectedLanguage?: string;

	// @ValidateIf((user: StarkUser) => typeof user.referenceNumber !== "undefined" && user.referenceNumber !== null)
	@IsString()
	@autoserialize
	public referenceNumber?: string;

	@IsDefined()
	@IsArray()
	@autoserialize
	public roles: string[] = [];

	// @ValidateIf((user: StarkUser) => typeof user.workpost !== "undefined" && user.workpost !== null)
	@IsString()
	@autoserialize
	public workpost?: string;

	// @ValidateIf((user: StarkUser) => typeof user.isAnonymous !== "undefined" && user.isAnonymous !== null)
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
