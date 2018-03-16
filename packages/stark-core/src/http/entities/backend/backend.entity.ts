"use strict";

import {IsDefined, IsNotEmpty, IsString, IsUrl} from "class-validator";
import {autoserialize, autoserializeAs} from "cerialize";
import {StarkBackend} from "./backend.entity.intf";
import {StarkBackendAuthenticationTypes} from "./backend-authentication-types";

export class StarkBackendImpl implements StarkBackend {
	@IsNotEmpty({message: "each backend object MUST have a name"})
	@IsString()
	@autoserialize
	public name: string;

	@IsNotEmpty({message: "each backend object MUST have an url"})
	@IsUrl()
	@autoserialize
	public url: string;

	@IsDefined({message: "each backend object MUST have an authentication type defined"})
	@autoserializeAs(StarkBackendAuthenticationTypes)
	public authenticationType: StarkBackendAuthenticationTypes;

	@autoserialize
	public fakePreAuthenticationEnabled: boolean; // optional (only needed if pre-authentication is required)

	@autoserialize
	public fakePreAuthenticationRolePrefix: string; // optional: only needed if pre-authentication is enabled

	@autoserialize
	public loginResource: string; // optional (only needed if authentication is required)

	@autoserialize
	public token: string; // optional (only needed if token-based authentication is required)
}
