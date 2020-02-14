import { IsNotEmpty, IsString, Matches } from "class-validator";
import { autoserialize } from "cerialize";
import { StarkLanguage } from "./language.entity.intf";
import { StarkIsSupportedLanguage } from "../../../validation/decorators/is-supported-language";

/**
 * This class is only for serialization purposes
 * @ignore
 */
export class StarkLanguageImpl implements StarkLanguage {
	/**
	 * Extracted regex as a workaround to avoid Angular compiler error: "Expression form not supported" due to the
	 * regex passed to the `@Matches` decorator in the `isoCode` property of this class.
	 *
	 * Using simple string instead of RegExp string since the compiler has a restricted expression syntax.
	 * See https://v7.angular.io/guide/aot-compiler#expression-syntax
	 */
	private static languageIsoCodeRegex = new RegExp("^[a-z]{2}-[A-Z]{2}$");

	@IsNotEmpty({ always: true }) // validation must be performed always, regardless of validation groups used.
	@IsString({ always: true })
	@Matches(StarkLanguageImpl.languageIsoCodeRegex, { always: true })
	@StarkIsSupportedLanguage({ always: true })
	@autoserialize
	public isoCode: string;

	@IsNotEmpty({ always: true }) // validation must be performed always, regardless of validation groups used.
	@IsString({ always: true })
	@autoserialize
	public translationKey: string;

	public constructor(isoCode: string, translationKey: string) {
		this.isoCode = isoCode;
		this.translationKey = translationKey;
	}

	public get code(): string {
		if (this.isoCode.length === 5) {
			return this.isoCode.substr(0, 2);
		}
		return "";
	}

	// FIXME: this tslint disable flag is due to a bug in 'no-identical-functions' rule (https://github.com/SonarSource/SonarTS/issues/676). Remove it once it is solved
	/*tslint:disable-next-line:no-identical-functions*/
	public get region(): string {
		if (this.isoCode.length === 5) {
			return this.isoCode.substr(3, 2);
		}
		return "";
	}
}
