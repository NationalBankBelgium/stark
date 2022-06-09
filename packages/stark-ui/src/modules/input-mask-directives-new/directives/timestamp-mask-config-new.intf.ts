import { Moment } from "moment";

export interface StarkTimestampMaskConfigNew {
	/**
	 *  format og the timestamp
	 * YYYY: placeholder for year
	 * MM: placeholder for month
	 * DD: placeholder for day of the month
	 * HH: placeholder for Hours (24 hours format)
	 * mm: placeholder for minute
	 * ss: placeholder for second
	 */
	format?: string;

	usingMoment?: boolean;
	/**
	 * custom formatting function
	 * @param value the date
	 */
	formatFn?: (value: Date | Moment) => string;

	/**
	 * custom parsing function
	 * @param value the input value to parse
	 */
	parseFn?: (value: string) => Date | Moment;

	/**
	 * show guide
	 */
	guide?: boolean;

	minDate?: Date | Moment;
	maxDate?: Date | Moment;
}
