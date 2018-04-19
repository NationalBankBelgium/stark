"use strict";

import moment from "moment";

export const starkIsDateTimeValidatorName: string = "starkIsDateTime";

export function starkIsDateTime(inputString: string, format: string = "DD-MM-YYYY HH:mm:ss"): boolean {
	return moment(inputString, format, true).isValid();
}
