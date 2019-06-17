import { HttpParameterCodec, HttpParams } from "@angular/common/http";
import { StarkQueryParam } from "../modules/http/entities/http-request.entity.intf";
import { StarkHttpParameterCodec } from "../modules/http/entities/http-parameter-codec";
import { convertMapIntoObject } from "./util-helpers";
import reduce from "lodash-es/reduce";

/**
 * A custom implementation of HttpParameterCodec to correctly encode query parameters.
 * @link https://github.com/NationalBankBelgium/stark/issues/1130
 */
export const STARK_HTTP_PARAM_ENCODER: HttpParameterCodec = new StarkHttpParameterCodec();

/**
 * Util class used for the HTTP module
 * @dynamic See: https://angular.io/guide/aot-compiler#strictmetadataemit
 */
export class StarkHttpUtil {
	/**
	 * Converts the Map<string, StarkQueryParam> required by the service into a HttpParams object required by Angular
	 * @param starkQueryParam - params to convert
	 */
	public static convertStarkQueryParamsIntoHttpParams(starkQueryParam: Map<string, StarkQueryParam>): HttpParams {
		return reduce(
			convertMapIntoObject(starkQueryParam), // convert to object
			(httpParams: HttpParams, value: StarkQueryParam, key: string) =>
				typeof value === "undefined"
					? // set key to empty string when not defined
					  httpParams.set(key, "")
					: Array.isArray(value)
					? // append each string to the key when set to an array
					  reduce(value, (acc: HttpParams, entry: string) => acc.append(key, entry), httpParams)
					: httpParams.set(key, value),
			new HttpParams({ encoder: STARK_HTTP_PARAM_ENCODER })
		);
	}
}
