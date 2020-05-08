import moment from "moment";

/**
 * Util class used to parse and format `Date` objects.
 */
export class StarkDateUtil {
	/**
	 * Returns a Date object when the specified dateString is a valid date according to the specified format,
	 * otherwise it returns `undefined`.
	 *
	 * A valid date can be an actual Date object or a string matching the specified format.
	 *
	 * Supported formats are those specified in the {@link https://momentjs.com/docs/#/parsing/string-format/|Moment.js API docs: parse string format}
	 *
	 * @param dateString - A valid ISO 8601 string or a custom one aligned to the format provided
	 * @param format - A valid format string according to Moment.js API docs
	 */
	public static parseDateWithFormat(dateString: string, format: string): Date | undefined {
		if (moment(dateString, format).isValid()) {
			return moment(dateString, format).toDate();
		}

		return undefined;
	}

	/**
	 * Returns the specified date as a string with the given format.
	 *
	 * Supported formats are those specified in the {@link https://momentjs.com/docs/#/displaying/format/|Moment.js API docs: display format}
	 *
	 * @param date - A Date object to be formatted
	 * @param format - A valid format string according to the Moment.js API docs
	 */
	public static format(date: Date, format: string = "DD-MM-YYYY"): string {
		let formattedDate = "invalid date";

		if (moment.isDate(date)) {
			const invalidTokens: RegExp = /[^AaDdEeGgHhMmQSsWwYkZXx:.\/\-\s]/g; // everything except the tokens used by moment format API
			const cleanFormat: string = format.replace(invalidTokens, "");

			formattedDate = moment(date).format(cleanFormat);

			// if the formattedDate based on the cleanFormat is not strictly aligned with the format provided
			// then it means the format provided is not valid or contains invalid format characters
			if (!moment(formattedDate, format, true).isValid()) {
				formattedDate = "invalid format";
			}
		}

		return formattedDate;
	}
}
