import { MatDateFormats } from "@angular/material/core";
/**
 * Object containing the format of the dates displayed in the date picker
 * Because we are using MomentJS internally, we are waiting for MomentJS formats in the configuration.
 * All formats can be found here: https://momentjs.com/docs/#/displaying/
 */
export const STARK_DATE_FORMATS: MatDateFormats = {
	parse: {
		/**
		 * Defines the dateInput parser for date-picker component.
		 * This can be a string for a single value or an array for multiple possibilities (ordered by priority).
		 * In case of array, if we have `dateInput: ["DD/MM/YYYY", "MM/DD/YYYY"]`
		 * If we set the date "02/10/2019", the result date will be "October 2, 2019" and not "February 10, 2019".
		 * Of course, if we set the date "02/20/2019", it will result in "February 20, 2019" because cannot be parsed with "DD/MM/YYYY".
		 */
		dateInput: ["DD/MM/YYYY", "LL"]
	},
	display: {
		dateInput: "LL",
		monthYearLabel: "MMM YYYY",
		dateA11yLabel: "LL",
		monthYearA11yLabel: "MMMM YYYY"
	}
};
