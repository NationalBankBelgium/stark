import { StarkTextMaskBaseDirective } from "./stark-text-mask-base.directive";
import IMask from "imask";
import { StarkTimestampMaskConfigNew } from "./timestamp-mask-config-new.intf";
import { Directive, ElementRef, forwardRef, Inject, Input, Optional, PLATFORM_ID, Provider, Renderer2 } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import moment from "moment";
import { IMaskFactory } from "angular-imask";

/**
 * @ignore
 */
const directiveName = "[starkTimestampMaskNew]";

/**
 * The Time date format that is used when no other is specified.
 */
const DEFAULT_DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";

/**
 * @ignore
 */
export const STARK_TIMESTAMP_MASK_NEW_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// tslint:disable-next-line:no-forward-ref
	useExisting: forwardRef(() => StarkTimestampMaskNewDirective),
	multi: true
};

@Directive({
	host: {
		"(input)": "_handleInput($event)",
		"(blur)": "onTouched()",
		"(compositionstart)": "_compositionStart()",
		"(compositionend)": "_compositionEnd($event.target.value)"
	},
	selector: directiveName,
	exportAs: "starkTextMaskNew",
	providers: [STARK_TIMESTAMP_MASK_NEW_VALUE_ACCESSOR]
})
export class StarkTimestampMaskNewDirective extends StarkTextMaskBaseDirective<IMask.MaskedDateOptions, StarkTimestampMaskConfigNew> {
	// tslint:disable-next-line:no-input-rename
	@Input("starkTimestampMaskNew")
	public override maskConfig: StarkTimestampMaskConfigNew | string = {};

	public constructor(
		_renderer: Renderer2,
		_elementRef: ElementRef,
		_factory: IMaskFactory,
		@Inject(PLATFORM_ID) _platformId: string,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
	) {
		super(_renderer, _elementRef, _factory, _platformId, _compositionMode);
	}

	protected override defaultMask(): StarkTimestampMaskConfigNew {
		return {
			format: DEFAULT_DATE_TIME_FORMAT,
			usingMoment: true,
			formatFn: this.defaultFormatFunction(),
			parseFn: this.defaultParseFunction(),
			guide: true
		};
	}

	private defaultFormatFunction(): (value: Date | moment.Moment) => string {
		let format = DEFAULT_DATE_TIME_FORMAT;
		if (typeof this.maskConfig === "string") {
			format = this.maskConfig;
		} else if (!!this.maskConfig.format) {
			format = this.maskConfig.format;
		}

		return (value: Date | moment.Moment): string => {
			console.log("format", value);
			let val: moment.Moment;
			if (moment.isMoment(value)) {
				val = value;
			} else {
				val = moment(value);
			}
			if (val.isValid()) {
				return val.format(format);
			}
			return "";
		};
	}

	private defaultParseFunction(): (value: string) => Date | moment.Moment {
		let format = DEFAULT_DATE_TIME_FORMAT;
		let usingMoment = true;
		if (typeof this.maskConfig === "string") {
			format = this.maskConfig;
		} else {
			if (!!this.maskConfig.format) {
				format = this.maskConfig.format;
			}
			if (this.maskConfig.usingMoment !== undefined) {
				usingMoment = this.maskConfig.usingMoment;
			}
		}

		return (value: string): Date | moment.Moment => {
			const retVal = moment(value, format);
			if (usingMoment) {
				return retVal;
			}
			return retVal.toDate();
		};
	}

	protected override mergedMaskConfig(
		maskConfig: string | StarkTimestampMaskConfigNew,
		defaultMask: StarkTimestampMaskConfigNew
	): StarkTimestampMaskConfigNew {
		let mask: StarkTimestampMaskConfigNew;
		if (typeof maskConfig === "string") {
			if (maskConfig === "") {
				mask = {
					format: DEFAULT_DATE_TIME_FORMAT
				};
			} else {
				mask = {
					format: maskConfig
				};
			}
		} else {
			mask = maskConfig;
		}

		return {
			...defaultMask,
			...mask
		};
	}

	private createBlocks(format: string): any {
		const dateFormatArray: string[] = format.split(/[^DMYHms]+/);

		const blocks: any = {};

		for (const frm of dateFormatArray) {
			switch (frm.charAt(0)) {
				case "D":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 1,
						to: 31,
						maxLength: 2
					};
					break;
				case "M":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 1,
						to: 12,
						maxLength: 2
					};
					break;
				case "Y":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 1900,
						to: frm.length === 2 ? 99 : 9999,
						maxLength: frm.length
					};
					break;
				case "H":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 0,
						to: 23,
						maxLength: 2
					};
					break;
				case "m":
				case "s":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 0,
						to: 59,
						maxLength: 2
					};
					break;
				default:
					break;
			}
		}
		console.log(blocks);
		return blocks;
	}

	protected override normalizedMaskConfig(
		maskConfig: string | StarkTimestampMaskConfigNew,
		defaultMask: StarkTimestampMaskConfigNew
	): IMask.MaskedDateOptions {
		const mask: StarkTimestampMaskConfigNew = this.mergedMaskConfig(maskConfig, defaultMask);
		console.log(mask.format);
		const val = {
			mask: Date,
			pattern: mask.format,
			format: mask.formatFn,
			parse: (str: string): Date => {
				if (!mask.parseFn) {
					throw new Error("Parse function must be defined");
				}
				console.log("parse", str);

				const value = mask.parseFn(str);
				console.log(value);
				if (moment.isMoment(value)) {
					return value.toDate();
				}
				return value;
			},
			blocks: this.createBlocks(!!mask.format ? mask.format : DEFAULT_DATE_TIME_FORMAT),
			min: !!mask.minDate ? (moment.isMoment(mask.minDate) ? mask.minDate.toDate() : mask.minDate) : undefined,
			max: !!mask.maxDate ? (moment.isMoment(mask.maxDate) ? mask.maxDate.toDate() : mask.maxDate) : undefined
		};
		console.log(val);
		return val;
	}
}
