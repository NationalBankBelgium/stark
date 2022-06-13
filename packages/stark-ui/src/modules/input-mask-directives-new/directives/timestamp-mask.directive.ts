import { StarkTextMaskBaseDirective } from "./stark-text-mask-base.directive";
import IMask from "imask";
import { StarkTimestampMaskConfigNew } from "./timestamp-mask-config-new.intf";
import { Directive, ElementRef, forwardRef, Inject, Input, Optional, PLATFORM_ID, Provider, Renderer2, SimpleChanges } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR } from "@angular/forms";
import moment from "moment";
import { IMaskFactory } from "angular-imask";
import { StarkDateInput } from "../../date-picker/components/date-picker.component";

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

	@Input()
	public set max(value: moment.Moment | null) {
		if (value === undefined) {
			// tslint:disable-next-line:no-null-keyword
			this._max = null;
		} else if (value instanceof Date) {
			this._max = moment(value);
		} else {
			this._max = value;
		}
	}

	public get max(): moment.Moment | null {
		return this._max;
	}

	// Information about input setter coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	// tslint:disable-next-line:variable-name
	public static ngAcceptInputType_max: StarkDateInput;

	/**
	 * @ignore
	 * Angular expects a Moment or null value.
	 */
	// tslint:disable-next-line:no-null-keyword
	private _max: moment.Moment | null = null;

	/**
	 * Minimum date of the date picker
	 *
	 * Supported types: `Date | moment.Moment | undefined | null`
	 */
	@Input()
	public set min(value: moment.Moment | null) {
		if (value === undefined) {
			// tslint:disable-next-line:no-null-keyword
			this._min = null;
		} else if (value instanceof Date) {
			this._min = moment(value);
		} else {
			this._min = value;
		}
	}

	public get min(): moment.Moment | null {
		return this._min;
	}

	// Information about input setter coercion https://angular.io/guide/template-typecheck#input-setter-coercion
	// tslint:disable-next-line:variable-name
	public static ngAcceptInputType_min: StarkDateInput;

	/**
	 * @ignore
	 * Angular expects a Moment or null value.
	 */
	// tslint:disable-next-line:no-null-keyword
	public _min: moment.Moment | null = null;

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
			validateFn: this.defaultValidateFunction(),
			guide: true
		};
	}

	protected override mergeMaskConfig(
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

	protected override rebuildMaskNgOnChanges(changes: SimpleChanges): boolean {
		return !!changes["maskConfig"] || !!changes["min"] || !!changes["max"];
	}

	protected override normalizeMaskConfig(
		maskConfig: string | StarkTimestampMaskConfigNew,
		defaultMask: StarkTimestampMaskConfigNew
	): IMask.MaskedDateOptions {
		const mask: StarkTimestampMaskConfigNew = this.mergeMaskConfig(maskConfig, defaultMask);
		const iMask: IMask.MaskedDateOptions = {
			mask: Date,
			pattern: mask.format,
			format: mask.formatFn,
			parse: (str: string): Date => {
				if (!mask.parseFn) {
					throw new Error("Parse function must be defined");
				}
				const value = mask.parseFn(str);
				if (moment.isMoment(value)) {
					return value.toDate();
				}
				return value;
			},
			blocks: this.createBlocks(!!mask.format ? mask.format : DEFAULT_DATE_TIME_FORMAT),
			min: this.minDateForMask(mask),
			max: this.maxDateForMask(mask),
			validate: mask.validateFn
		};

		//If min date and max date are set restrict the accepted values for the years,
		if (iMask.blocks && (iMask.blocks["YY"] || iMask.blocks["YYYY"])) {
			let yearBlock: IMask.MaskedRangeOptions = <IMask.MaskedRangeOptions>(
				(!!iMask.blocks["YY"] ? iMask.blocks["YY"] : iMask.blocks["YYYY"])
			);
			if (iMask.min) {
				yearBlock = {
					...yearBlock,
					from: iMask.min.getFullYear()
				};
			}
			if (iMask.max) {
				yearBlock = {
					...yearBlock,
					to: iMask.max.getFullYear()
				};
			}
			if (iMask.blocks["YY"]) {
				iMask.blocks["YY"] = yearBlock;
			} else {
				iMask.blocks["YYYY"] = yearBlock;
			}

			// min date are set and for the same year
			if (yearBlock.from === yearBlock.to && iMask.blocks["MM"] && iMask.min && iMask.max) {
				const monthBlock: IMask.MaskedRangeOptions = {
					...(<IMask.MaskedRangeOptions>iMask.blocks["MM"]),
					from: iMask.min.getMonth() + 1,
					to: iMask.max.getMonth() + 1
				};
				iMask.blocks["MM"] = monthBlock;

				if (monthBlock.from === monthBlock.to && iMask.blocks["DD"]) {
					const dayBlock: IMask.MaskedRangeOptions = {
						...(<IMask.MaskedRangeOptions>iMask.blocks["DD"]),
						from: iMask.min.getDate(),
						to: iMask.max.getDate()
					};
					iMask.blocks["DD"] = dayBlock;
					console.log(dayBlock);
				}
			}
		}

		return iMask;
	}

	private minDateForMask(mask: StarkTimestampMaskConfigNew): Date | undefined {
		if (this.min) {
			return this.min.toDate();
		}
		if (mask.minDate) {
			if (moment.isMoment(mask.minDate)) {
				return mask.minDate.toDate();
			}
			return mask.minDate;
		}
		return undefined;
	}

	private maxDateForMask(mask: StarkTimestampMaskConfigNew): Date | undefined {
		if (this.max) {
			return this.max.toDate();
		}
		if (mask.maxDate) {
			if (moment.isMoment(mask.maxDate)) {
				return mask.maxDate.toDate();
			}
			return mask.maxDate;
		}
		return undefined;
	}

	private defaultFormatFunction(): (value: Date | moment.Moment) => string {
		let format = DEFAULT_DATE_TIME_FORMAT;
		if (typeof this.maskConfig === "string") {
			format = this.maskConfig;
		} else if (!!this.maskConfig.format) {
			format = this.maskConfig.format;
		}

		return (value: Date | moment.Moment): string => {
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

	private defaultValidateFunction(): (value: string, mask: IMask.Masked<DateConstructor>, appends: any) => boolean {
		return ((value: string, mask: IMask.Masked<DateConstructor>, _appends: any): boolean => {
			const pattern = (<IMask.MaskedDate>mask).pattern;
			// parse the input string with the pattern
			const dateParsed = this.parseDate(value, pattern);

			const inputValid = this.validateTypedDate(dateParsed);
			// TODO add filter for min date and max date, and day of week or weekend

			return inputValid;
		}).bind(this);
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
						maxLength: 2,
						eager: true
					};
					break;
				case "M":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 1,
						to: 12,
						maxLength: 2,
						eager: true
					};
					break;
				case "Y":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 1900,
						to: frm.length === 2 ? 99 : 9999,
						maxLength: frm.length,
						eager: true
					};
					break;
				case "H":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 0,
						to: 23,
						maxLength: 2,
						eager: true
					};
					break;
				case "m":
				case "s":
					blocks[frm] = {
						mask: IMask.MaskedRange,
						from: 0,
						to: 59,
						maxLength: 2,
						eager: true
					};
					break;
				default:
					break;
			}
		}

		return blocks;
	}

	public parseDate(value: string, pattern: string): DateParsed {
		const dateParsed: DateParsed = {
			year: new DateFragment(),
			month: new DateFragment(),
			day: new DateFragment()
		};

		for (let i = 0; i < pattern.length; i++) {
			switch (pattern.charAt(i)) {
				case "D":
					dateParsed.day.append(value.length > i ? value.charAt(i) : "");
					break;
				case "M":
					dateParsed.month.append(value.length > i ? value.charAt(i) : "");
					break;
				case "Y":
					dateParsed.year.append(value.length > i ? value.charAt(i) : "");
					break;
				default:
					break;
			}
		}
		return dateParsed;
	}

	public validateTypedDate(dateParsed: DateParsed): boolean {
		if (dateParsed.day.isValid && dateParsed.month.isValid) {
			switch (dateParsed.month.value) {
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					return dateParsed.day.value >= 1 && dateParsed.day.value <= 31;
				case 4:
				case 6:
				case 9:
				case 11:
					return dateParsed.day.value >= 1 && dateParsed.day.value <= 30;
				case 2:
					if (dateParsed.year.isValid) {
						const year = dateParsed.year.fieldLength === 2 ? dateParsed.year.value + 2000 : dateParsed.year.value;
						return moment(year + "-" + dateParsed.month.valueS + "-" + dateParsed.day.valueS, "YYYY-MM-DD").isValid();
					}
					// february but do not know the year
					return dateParsed.day.value >= 1 && dateParsed.day.value <= 29;
				default:
					return false;
			}
		}
		return true;
	}
}

interface DateParsed {
	year: DateFragment;
	month: DateFragment;
	day: DateFragment;
}

class DateFragment {
	public valueS = "";
	public fieldLength = 0;

	public get value(): number {
		return Number.parseInt(this.valueS, 10);
	}

	public get isValid(): boolean {
		return this.fieldLength === this.valueS.length;
	}

	public append(character: string): void {
		this.valueS = this.valueS + character;
		this.fieldLength++;
	}
}
