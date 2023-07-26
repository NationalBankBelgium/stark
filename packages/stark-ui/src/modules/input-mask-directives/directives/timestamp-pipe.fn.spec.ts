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
		it("should return the date time string if the partial date time string is correct", () => {
			const validDateTimeStrings = [
				"31",
				"29-02", // valid date until no year is entered
				"29-02-20",
				"29-02-200",
				"30-12-2017",
				"0", // when typing a day starting with 0
				"29-0" // when typing a month starting with 0
			];

			assertTimestampsValidity(validDateTimeStrings, true);
		});

		it("should return the date time string if the partial date time string is correct including placeholder characters", () => {
			// FIXME: uncomment the date strings below that should be valid once we enhance the logic of the createTimestampPipe function (https://github.com/NationalBankBelgium/stark/issues/1277)
			const validDateTimeStrings = [
				"3_",
				"__-02", // valid date until no year is entered
				"29-__-20",
				"29-0_-200",
				"30-1_-2017",
				"30-12-____",
				"30-12-2___",
				"30-12-20__",
				"30-12-201_",
				// "30-12-2017 __:15:20",
				// "30-12-2017 1_:15:20",
				// "30-12-2017 10:__:20",
				// "30-12-2017 10:1_:20",
				"30-12-2017 10:15:__",
				"30-12-2017 10:15:2_",
				"0_", // when typing a day starting with 0
				"29-0_" // when typing a month starting with 0
			];

			assertTimestampsValidity(validDateTimeStrings, true);
		});

		it("should return FALSE if the day-month combination in the date time string is incorrect", () => {
			const invalidDateTimeStrings = [
				"32-01",
				"30-02", // although 29-02 might be valid in case of a leap year
				"32-03",
				"31-04",
				"32-05",
				"31-06",
				"32-07",
				"32-08",
				"31-09",
				"32-10",
				"31-11",
				"32-12"
			];

			assertTimestampsValidity(invalidDateTimeStrings, false);
		});

		it("should return FALSE if the date time string doesn't match the format", () => {
			const invalidDateTimeStrings = ["30/12/2000", "12/30/2000 12:12:12", "12-30-2000 12:12:12"];

			assertTimestampsValidity(invalidDateTimeStrings, false);
		});

		it("should return the date time string if it is 29 February and is a leap year or FALSE otherwise", () => {
			const invalidDateTimeStrings = [
				"02-29-2017 10:15:20", // non leap year
				"02-29-2018" // non leap year
			];

			assertTimestampsValidity(invalidDateTimeStrings, false);

			const validDateTimeStrings = [
				"29-02-2016 10:15:20", // leap year
				"29-02-2012" // leap year
			];

			assertTimestampsValidity(validDateTimeStrings, true);
		});

		it("should return FALSE if any of the parts of the date time string is not within the valid range of values", () => {
			const invalidDateTimeStrings = [
				"32-12-2000 12:12:12", // day
				"00-12-2000 12:12:12",
				"20-13-2000 12:12:12", // month
				"20-00-2000 12:12:12",
				"20-12-2000 24:12:12", // hours
				"20-12-2000 13:60:12", // minutes
				"20-12-2000 13:12:60" // seconds
			];

			assertTimestampsValidity(invalidDateTimeStrings, false);

			const validDateTimeStrings = [
				"20-12-9999 12:12:12", // year
				"20-12-0000 12:12:12", // year
				"20-12-2000 23:12:12", // hours
				"20-12-2000 00:12:12", // hours
				"20-12-2000 13:00:12", // minutes
				"20-12-2000 13:59:12", // minutes
				"20-12-2000 13:12:59", // seconds
				"20-12-2000 13:12:00" // seconds
			];

			assertTimestampsValidity(validDateTimeStrings, true);
		});
	});

	describe("with a custom format", () => {
		it("should return the date time string if the partial date time string is correct", () => {
			let validDateTimeStrings = [
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

		it("should return the date time string if the partial date time string is correct including placeholder characters", () => {
			// FIXME: uncomment the date strings below that should be valid once we enhance the logic of the createTimestampPipe function (https://github.com/NationalBankBelgium/stark/issues/1277)
			let validDateTimeStrings = [
				// "____-30-12",
				// "2___-30-12",
				// "20__-30-12",
				// "201_-30-12",
				"2017-__-12",
				"2017-3_-12",
				"2017-3_-__",
				"2017-3_-1_",
				// "2016-29-02 __:15:20", // leap year
				// "2016-29-02 1_:15:20", // leap year
				// "2016-29-02 10:__:20", // leap year
				// "2016-29-02 10:1_:20", // leap year
				"2016-29-02 10:15:__", // leap year
				"2016-29-02 10:15:2_" // leap year
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeLongYearFormat);

			validDateTimeStrings = [
				"__-11-15 12:12:12",
				"2_-11-15 12:12:12",
				"22-__-15 12:12:12",
				"22-1_-15 12:12:12",
				"__-02",
				"2_-02",
				"29-__",
				"29-0_",
				// "29-02-16 __:15:20", // leap year
				// "29-02-16 1_:15:20", // leap year
				// "29-02-16 10:__:20", // leap year
				// "29-02-16 10:1_:20", // leap year
				"29-02-16 10:15:__", // leap year
				"29-02-16 10:15:2_" // leap year
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeShortYearFormat);
		});

		it("should return FALSE if the day-month combination in the date time string is incorrect", () => {
			let invalidDateTimeStrings = [
				"2019-32-01",
				"2019-30-02",
				"2019-32-03",
				"2019-31-04",
				"2019-32-05",
				"2019-31-06",
				"2019-32-07",
				"2019-32-08",
				"2019-31-09",
				"2019-32-10",
				"2019-31-11",
				"2019-32-12"
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeLongYearFormat);

			invalidDateTimeStrings = [
				"32-01",
				"30-02", // although 29-02 might be valid in case of a leap year
				"32-03",
				"31-04",
				"32-05",
				"31-06",
				"32-07",
				"32-08",
				"31-09",
				"32-10",
				"31-11",
				"32-12"
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeShortYearFormat);
		});

		it("should return FALSE if 29 February is given and the format given has no year and current year is NOT leap", () => {
			const isALeapYear = new Date().getFullYear() % 4 === 0;

			let invalidDateTimeStrings = ["29-02"];

			assertTimestampsValidity(invalidDateTimeStrings, isALeapYear, "DD-MM");

			invalidDateTimeStrings = ["02-29"];

			assertTimestampsValidity(invalidDateTimeStrings, isALeapYear, "MM-DD");
		});

		it("should return FALSE if the date time string doesn't match the format", () => {
			let invalidDateTimeStrings = ["2017/30/12", "2017/30/12 12:12:12", "31-12-2000"];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeLongYearFormat);

			invalidDateTimeStrings = ["30/12/17", "30/12/2017 12:12:12", "31-12-2000"];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeShortYearFormat);
		});

		it("should return the date time string if it is 29 February and is a leap year or FALSE otherwise", () => {
			let invalidDateTimeStrings = [
				"2017-29-02 10:15:20", // non leap year
				"2018-29-02" // non leap year
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeLongYearFormat);

			let validDateTimeStrings = [
				"2016-29-02 10:15:20", // leap year
				"2012-29-02" // leap year
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeLongYearFormat);

			invalidDateTimeStrings = [
				"29-02-17 10:15:20", // non leap year
				"29-02-18" // non leap year
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeShortYearFormat);

			validDateTimeStrings = [
				"29-02-16 10:15:20", // leap year
				"29-02-12" // leap year
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeShortYearFormat);
		});

		it("should return FALSE if any of the parts of the date time string is not within the valid range of values", () => {
			let invalidDateTimeStrings = [
				"2000-32-12 12:12:12", // day
				"2000-00-12 12:12:12",
				"2000-20-13 12:12:12", // month
				"2000-20-00 12:12:12",
				"2000-20-12 24:12:12", // hours
				"2000-20-12 13:60:12", // minutes
				"2000-20-12 13:12:60" // seconds
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeLongYearFormat);

			let validDateTimeStrings = [
				"9999-20-12 12:12:12", // year
				"0000-20-12 12:12:12", // year
				"2000-20-12 23:12:12", // hours
				"2000-20-12 00:12:12", // hours
				"2000-20-12 13:00:12", // minutes
				"2000-20-12 13:59:12", // minutes
				"2000-20-12 13:12:59", // seconds
				"2000-20-12 13:12:00" // seconds
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeLongYearFormat);

			invalidDateTimeStrings = [
				"32-12-00 12:12:12", // day
				"00-12-00 12:12:12",
				"20-13-00 12:12:12", // month
				"20-00-00 12:12:12",
				"20-12-00 24:12:12", // hours
				"20-12-00 13:60:12", // minutes
				"20-12-00 13:12:60" // seconds
			];

			assertTimestampsValidity(invalidDateTimeStrings, false, fullDateTimeShortYearFormat);

			validDateTimeStrings = [
				"20-12-99 12:12:12", // year
				"20-12-00 12:12:12", // year
				"20-12-00 23:12:12", // hours
				"20-12-00 00:12:12", // hours
				"20-12-00 13:00:12", // minutes
				"20-12-00 13:59:12", // minutes
				"20-12-00 13:12:59", // seconds
				"20-12-00 13:12:00" // seconds
			];

			assertTimestampsValidity(validDateTimeStrings, true, fullDateTimeShortYearFormat);
		});
	});
});
