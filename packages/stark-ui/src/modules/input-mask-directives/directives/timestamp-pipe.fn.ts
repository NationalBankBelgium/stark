import { starkIsDateTime } from "@nationalbankbelgium/stark-core";
import { PipeFunction, PipeResultObject } from "text-mask-core";

// TODO: refactor this function to reduce its cognitive complexity
/**
 * Creates a PipeFunction to be used with the {@link StarkTimestampMaskDirective} to enforce an specific timestamp format.
 * @param timestampFormat - Timestamp format to be enforced by the pipe function to be created
 */
// tslint:disable-next-line:cognitive-complexity
export function createTimestampPipe(timestampFormat: string = "DD-MM-YYYY HH:mm:ss"): PipeFunction {
	return (conformedValue: string): false | string | PipeResultObject => {
		const dateFormatArray: string[] = timestampFormat.split(/[^DMYHms]+/);
		const maxValue: object = { DD: 31, MM: 12, YYYY: 2999, HH: 24, mm: 60, ss: 60 };
		const minValue: object = { DD: 0, MM: 0, YYYY: 1, HH: 0, mm: 0, ss: 0 };

		let skipValidation = false;

		// Check for invalid date
		const isInvalid: boolean = dateFormatArray.some((format: string) => {
			const position: number = timestampFormat.indexOf(format);
			const length: number = format.length;
			const textValue: string = conformedValue.substr(position, length).replace(/\D/g, "");
			const value: number = parseInt(textValue, 10);

			// skip the validation if the day starts with 0, but is not 00
			// because if we would validate it would give not valid, because day 0 doesn't exist
			// but maybe we want to type for example 02
			// it should not give invalid if we only already have typed the 0
			if (format === "DD" && (value === 0 && textValue !== "00")) {
				skipValidation = true;
				// same for month
			} else if (format === "MM" && (value === 0 && textValue !== "00")) {
				skipValidation = true;
			}
			return value > maxValue[format] || (textValue.length === length && value < minValue[format]);
		});

		// remove all non digits at the end of the conformed value
		const inputValue: string = conformedValue.replace(/\D*$/, "");
		const partialFormat: string = timestampFormat.substring(0, inputValue.length);

		// MomentJs gives always false for input 31, but it depends on the month
		// so we say it is always true
		// if 31 is a month or year or hour than we couldn't even type the 3
		if (inputValue === "31") {
			skipValidation = true;

			// 29 february must be checked after we have typed the year if there is a year in the format
		} else if (isLeapDay(inputValue, partialFormat, timestampFormat)) {
			skipValidation = true;
		}

		if (!skipValidation && !isInvalid && inputValue.length > 0 && !starkIsDateTime(inputValue, partialFormat)) {
			return false;
		}

		skipValidation = false;

		if (isInvalid) {
			return false;
		}

		return conformedValue;
	};
}

/**
 * @ignore
 */
function isLeapDay(value: string, format: string, fullFormat: string): boolean {
	const textValue: string = value.replace(/\D/, ""); // removing all non digits
	const dayMonthFormat: string = format.replace(/[^DM]/, ""); // keeping only day and month parts
	const leapDays: { format: string; date: string }[] = [{ format: "DDMM", date: "2902" }, { format: "MMDD", date: "0229" }];

	// is leap day as long as there is no year entered yet and the full format does have a year part
	for (const leapDay of leapDays) {
		const indexOfDayMonth: number = dayMonthFormat.indexOf(leapDay.format);
		if (
			textValue.substr(indexOfDayMonth, 4) === leapDay.date &&
			dayMonthFormat.substr(indexOfDayMonth, 4) === leapDay.format &&
			((fullFormat.indexOf("YYYY") > 0 && value.length < fullFormat.indexOf("YYYY") + 4) ||
				(fullFormat.indexOf("YY") > 0 && value.length < fullFormat.indexOf("YY") + 2))
		) {
			return true;
		}
	}
	return false;
}
