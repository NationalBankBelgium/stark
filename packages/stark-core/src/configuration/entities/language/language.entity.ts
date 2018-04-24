import { IsNotEmpty, IsString, Matches } from "class-validator";
import { autoserialize } from "cerialize";
import { StarkLanguage } from "./language.entity.intf";
// FIXME: cannot import both validation decorator from the barrel due to an issue with angular-compiler
// see: https://github.com/angular/angular/issues/20931
import { StarkIsSupportedLanguage } from "../../../validation/decorators/is-supported-language/is-supported-language.validator.decorator";

export class StarkLanguageImpl implements StarkLanguage {
	@IsNotEmpty()
	@IsString()
	@Matches(/^[a-z]{2}-[A-Z]{2}$/)
	@StarkIsSupportedLanguage()
	@autoserialize
	public isoCode: string;

	@IsNotEmpty()
	@IsString()
	@autoserialize
	public translationKey: string;

	public constructor(isoCode: string, translationKey: string) {
		this.isoCode = isoCode;
		this.translationKey = translationKey;
	}

	public get code(): string {
		if (this.isoCode.length === 5) {
			return this.isoCode.substr(0, 2);
		} else {
			return "";
		}
	}

	public get region(): string {
		if (this.isoCode.length === 5) {
			return this.isoCode.substr(3, 2);
		} else {
			return "";
		}
	}
}
