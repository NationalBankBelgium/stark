import { HttpParams } from "@angular/common/http";
import { StarkQueryParam } from "../modules/http/entities/http-request.entity.intf";
import { STARK_HTTP_PARAM_ENCODER, StarkHttpUtil } from "./http.util";

describe("Stark HTTP helpers", () => {
	describe("convertStarkQueryParamsIntoHttpParams", () => {
		it("basic", () => {
			const initial: Map<string, StarkQueryParam> = new Map();
			initial.set("param1", "value1");
			initial.set("param2", "value2");
			const expected: HttpParams = new HttpParams({ encoder: STARK_HTTP_PARAM_ENCODER })
				.set("param1", "value1")
				.set("param2", "value2");
			const expectedString = "param1=value1&param2=value2";

			const result: HttpParams = StarkHttpUtil.convertStarkQueryParamsIntoHttpParams(initial);

			expect(result).toEqual(expected);
			expect(result.toString()).toBe(expectedString);
		});

		it("with special characters", () => {
			const initial: Map<string, StarkQueryParam> = new Map();
			initial.set("special", ";/?:@&=+,$");
			const expectedString = "special=%3B%2F%3F%3A%40%26%3D%2B%2C%24";

			const result: HttpParams = StarkHttpUtil.convertStarkQueryParamsIntoHttpParams(initial);

			expect(result.toString()).toEqual(expectedString);
		});

		it("with 'undefined'", () => {
			const initial: Map<string, StarkQueryParam> = new Map();
			initial.set("nothing", undefined);
			initial.set("something", "value");
			const expectedString = "nothing=&something=value";

			const result: HttpParams = StarkHttpUtil.convertStarkQueryParamsIntoHttpParams(initial);

			expect(result.toString()).toBe(expectedString);
		});

		it("with '0'", () => {
			const initial: Map<string, StarkQueryParam> = new Map();
			initial.set("zero", <any>0);
			initial.set("something", "value");
			const expectedString = "zero=0&something=value";

			const result: HttpParams = StarkHttpUtil.convertStarkQueryParamsIntoHttpParams(initial);

			expect(result.toString()).toBe(expectedString);
		});

		it("with 'null'", () => {
			const initial: Map<string, StarkQueryParam> = new Map();
			// eslint-disable-next-line no-null/no-null
			initial.set("NULL", <any>null);
			initial.set("something", "value");
			const expectedString = "NULL=null&something=value";

			const result: HttpParams = StarkHttpUtil.convertStarkQueryParamsIntoHttpParams(initial);

			expect(result.toString()).toBe(expectedString);
		});

		it("with array", () => {
			const initial: Map<string, StarkQueryParam> = new Map();
			initial.set("list", ["1", "2", "3"]);
			const expectedString = "list=1&list=2&list=3";

			const result: HttpParams = StarkHttpUtil.convertStarkQueryParamsIntoHttpParams(initial);

			expect(result.toString()).toBe(expectedString);
		});
	});
});
