"use strict";

import { StarkZipCityService } from "./zip-city.service.intf";
import { StarkZipCityServiceImpl } from "./zip-city.service";
import { StarkZipCityOptionsItem } from "./zip-city-options-item.intf";

describe("Service: StarkZipCityService", () => {
	let zipCityService: StarkZipCityService;

	beforeEach(() => {
		zipCityService = new StarkZipCityServiceImpl();
	});

	describe("toCity", () => {
		it("with zipcode should return the correct city", () => {
			const result: string = <string>zipCityService.toCity("8780");
			expect(result).toBe("Oostrozebeke");
		});
		it("with wrong zipcode should return undefined", () => {
			const result: string | undefined = zipCityService.toCity("8781");
			expect(result).toBeUndefined();
		});
	});
	describe("toZip", () => {
		it("with city name should return correct zip", () => {
			const result: string = <string>zipCityService.toZip("Antwerpen");
			expect(result).toBe("2000");
		});
		it("with wrong city should return undefined", () => {
			const result: string | undefined = zipCityService.toZip("Anwxxxen");
			expect(result).toBeUndefined();
		});
	});

	describe("isValid", () => {
		it("with matching zip and city should return true", () => {
			const result: boolean = zipCityService.isValid("2000", "Antwerpen");
			expect(result).toBe(true);
		});
		it("with none matching zip and city should return false", () => {
			const result: boolean = zipCityService.isValid("2000", "Oostrozebeke");
			expect(result).toBe(false);
		});
	});

	describe("zipsLike", () => {
		it("'30' should return an array with 19 zips", () => {
			const result: string[] = zipCityService.zipsLike("30");
			expect(result.length).toBe(19);
		});
		it("with no results should return an empty array", () => {
			const result: string[] = zipCityService.zipsLike("00");
			expect(result.length).toBe(0);
		});
	});

	describe("citiesLike", () => {
		it("'bru' should return an array with 9 zips", () => {
			const result: string[] = zipCityService.citiesLike("bru");
			expect(result.length).toBe(9);
		});
		it("with no results should return an empty array", () => {
			const result: string[] = zipCityService.citiesLike("xxx");
			expect(result.length).toBe(0);
		});
	});

	describe("getZipOptions", () => {
		it("for zip '1320' should return an array with 5 items", () => {
			const result: StarkZipCityOptionsItem[] = zipCityService.getZipOptions("1320");
			expect(result.length).toBe(5);
		});
		it("for zip '1320' should return an array of objects with zip, city and label properties", () => {
			const result: StarkZipCityOptionsItem[] = zipCityService.getZipOptions("1320");
			expect(result[0].zip).toBe("1320");
			expect(result[0].city).toBe("BEAUVECHAIN");
			expect(result[0].label).toBe("1320 Beauvechain");
		});
		it("for invalid zip '1234' should return an empty array", () => {
			const result: StarkZipCityOptionsItem[] = zipCityService.getZipOptions("1234");
			expect(result.length).toBe(0);
		});
	});
});
