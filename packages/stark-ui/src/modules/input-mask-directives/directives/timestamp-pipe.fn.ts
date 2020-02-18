import { starkIsDateTime } from "@nationalbankbelgium/stark-core";
import { PipeFunction, PipeResultObject } from "text-mask-core";

// TODO: refactor this function to reduce its cognitive complexity
/**
 * Creates a PipeFunction to be used with the {@link StarkTimestampMaskDirective} to enforce an specific timestamp format.
 * @param timestampFormat - Timestamp format to be enforced by the pipe function to be created
 */
// tslint:disable-next-line:cognitive-complexity
export function createTimestampPipe(timestampFormat: string = "DD-MM-YYYY HH:mm:ss"): PipeFunction {
	const dateFormatArray: string[] = timestampFormat.split(/[^DMYHms]+/);

	return (conformedValue: string): false | string | PipeResultObject => {
		const maxValue: object = { DD: 31, MM: 12, YYYY: 9999, HH: 23, mm: 59, ss: 59 };
		const minValue: object = { DD: 1, MM: 1, YYYY: 0, HH: 0, mm: 0, ss: 0 };

		let skipValidation = false;

		// Check for invalid date
		const isInvalid: boolean = dateFormatArray.some((format: string) => {
			const position: number = timestampFormat.indexOf(format);
			const length: number = format.length;
			const textValue: string = conformedValue.substr(position, length).replace(/\D/g, "");
			const value: number = parseInt(textValue, 10);

			// Skip the validation in these cases:
			// 1) if the day/month starts with 0, but is not "00" because if we would validate it, it would give not valid because day 0 doesn't exist
			//    but maybe we want to type for example "02" so it should not give invalid if we only have typed the "0"
			// 2) if the textValue is empty (not filled by the user or maybe he deleted the day/month completely)
			// 3) if the day/month has just one character (instead of two like "0X") otherwise the strict validation of starkIsDateTime would treat it as invalid
			// FIXME: for use case 3 we should enhance the logic to prepend the missing 0's so that the date string aligns with the expected format and it passes the strict validation of starkIsDateTime
			// See https://github.com/NationalBankBelgium/stark/issues/1277
			if (
				(format === "DD" || format === "MM") &&
				((value === 0 && textValue !== "00") || textValue === "" || (value < 10 && textValue.length === 1))
			) {
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
	const leapDays: { format: string; date: string }[] = [
		{ format: "DDMM", date: "2902" },
		{ format: "MMDD", date: "0229" }
	];

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
