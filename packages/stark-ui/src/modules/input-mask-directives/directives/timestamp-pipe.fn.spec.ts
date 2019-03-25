/* tslint:disable:completed-docs */
import { createTimestampPipe } from "./timestamp-pipe.fn";

describe("createTimestampPipe", () => {
	const fullDateTimeLongYearFormat = "YYYY-DD-MM HH:mm:ss";
	const fullDateTimeShortYearFormat = "DD-MM-YY HH:mm:ss";

	function assertTimestampsValidity(dateTimeStrings: string[], shouldBeValid: boolean, customFormat?: string): void {
		const timestampPipeFn: Function = createTimestampPipe(customFormat);

		for (const dateTimeStr of dateTimeStrings) {
			const expectedResult: boolean | string = shouldBeValid ? dateTimeStr : false;
			expect(timestampPipeFn(dateTimeStr)).toBe(expectedResult);
		}
	}

	it("should return a pipe function regardless of whether a custom format is passed or not", () => {
		let timestampPipeFn: Function = createTimestampPipe(fullDateTimeLongYearFormat);
		expect(typeof timestampPipeFn).toBe("function");

		timestampPipeFn = createTimestampPipe(fullDateTimeShortYearFormat);
		expect(typeof timestampPipeFn).toBe("function");

		timestampPipeFn = createTimestampPipe();
		expect(typeof timestampPipeFn).toBe("function");
	});

	describe("with the default format: 'DD-MM-YYYY HH:mm:ss'", () => {
		it("should return the same date time string if a part of date time string is correct", () => {
			const validDateTimeStrings: string[] = [
				"31",
				"29-02",
				"29-02-20",
				"29-02-200",
				"0", // when typing a day starting with 0
				"29-0" // when typing a month starting with 0
			];

			assertTimestampsValidity(validDateTimeStrings, true);
		});

		it("should return FALSE if a part of date time string is incorrect", () => {
			const invalidDateTimeStrings: string[] = ["02-13", "30-02", "31-04"];

			assertTimestampsValidity(invalidDateTimeStrings, false);
		});

		it("should return FALSE if the date time string doesn't match the format", () => {
			const invalidDateTimeStrings: string[] = [
				"32-12-2000 12:12:12",
				"40-12-2000 12:12:12",
				"22-13-2000 12:12:12",
				"22-20-2000 12:12:12",
				"22-11-3000 12:12:12",
				"22-11-2000 62:12:12",
				"22-11-2000 70:12:12",
				"22-11-2000 44:13:12",
				"22-11-2000 44:70:12",
				"22-11-2000 44:44:62",
				"22-11-2000 44:44:70"
			];

			assertTimestampsValidity(invalidDateTimeStrings, false);
		});
	});

	describe("with a custom format", () => {
		it("should return the same date time string if a part of date time string is correct", () => {
			let validDateTimeStrings: string[] = [
				"2017-30-12",
				"2016-29-02 10:15:20" // leap year
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeLongYearFormat);

			validDateTimeStrings = [
				"22-11-15 12:12:12",
				"29-02",
				"29-02-16 10:15:20" // leap year
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeShortYearFormat);
		});

		it("should return FALSE if 29 February is given and the format given has no year", () => {
			// it is invalid because when there is no year specified, it is assumed to be something recurrent
			// and you shouldn't put something recurrent on a Feb 29!

			let validDateTimeStrings: string[] = [
				"29-02" // valid date until no year is entered
			];

			assertTimestampsValidity(validDateTimeStrings, false, "DD-MM");

			validDateTimeStrings = [
				"02-29" // valid date until no year is entered
			];

			assertTimestampsValidity(validDateTimeStrings, false, "MM-DD");
		});

		it("should return FALSE if the date time string doesn't match the format", () => {
			let invalidDateTimeStrings: string[] = [
				"2017/30/12",
				"2017/30/12 12:12:12",
				"2017-29-02 10:15:20", // non leap year
				"31-12-2000"
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeLongYearFormat);

			invalidDateTimeStrings = [
				"30/12/17",
				"30/12/2017 12:12:12",
				"29-02-17 10:15:20", // non leap year
				"31-12-2000"
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeShortYearFormat);
		});
	});
});
