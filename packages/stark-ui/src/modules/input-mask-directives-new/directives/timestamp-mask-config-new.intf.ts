import { Moment } from "moment";
import IMask from "imask";

export type FilterDateFunction = (date: Date) => boolean;

export type FilterDateType = FilterDateFunction | "OnlyWeekends" | "OnlyWeekdays";

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
	 * validate typed text
	 * @param value the typed text
	 */
	validateFn?: (value: string, mask: IMask.Masked<DateConstructor>, appends: any) => boolean;

	/**
	 * show guide
	 */
	guide?: boolean;

	/**
	 * minimum date
	 */
	minDate?: Date | Moment;

	/**
	 * maximum date
	 */
	maxDate?: Date | Moment;

	filter?: FilterDateType;
}
