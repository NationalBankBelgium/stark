import { HttpParameterCodec, HttpParams } from "@angular/common/http";
import { StarkQueryParam } from "../modules/http/entities/http-request.entity.intf";
import { StarkHttpParameterCodec } from "../modules/http/entities/http-parameter-codec";
import { convertMapIntoObject } from "./util-helpers";
import reduce from "lodash-es/reduce";

/**
 * An instance of the {@link StarkHttpParameterCodec} which is internally used by
 * the [StarkHttpUtil convertStarkQueryParamsIntoHttpParams]{@link StarkHttpUtil#convertStarkQueryParamsIntoHttpParams} method.
 *
 * See {@link https://github.com/NationalBankBelgium/stark/issues/1130}
 */
export const STARK_HTTP_PARAM_ENCODER: HttpParameterCodec = new StarkHttpParameterCodec();

/**
 * Util class used for the {@link StarkHttpModule}
 */
export class StarkHttpUtil {
	/**
	 * Converts the `Map<string, StarkQueryParam>` required by the {@link StarkHttpService} into a
	 * {@link https://v12.angular.io/api/common/http/HttpParams|HttpParams} object required by Angular
	 * @param starkQueryParam - Params to convert
	 */
	public static convertStarkQueryParamsIntoHttpParams(starkQueryParam: Map<string, StarkQueryParam>): HttpParams {
		return reduce(
			convertMapIntoObject(starkQueryParam), // convert to object
			StarkHttpUtil.reduceCallbackFn,
			new HttpParams({ encoder: STARK_HTTP_PARAM_ENCODER })
		);
	}

	/**
	 * Extracted callback function as a workaround to avoid Angular compiler error: ""Lambda not supported"
	 * See https://github.com/ng-packagr/ng-packagr/issues/696
	 * and https://github.com/angular/angular/issues/23629
	 *
	 * This is to avoid using the Angular compiler's `dynamic` flag recommended in:
	 * https://github.com/angular/angular/issues/19698#issuecomment-338340211 and https://v12.angular.io/guide/aot-compiler#expression-syntax-limitations
	 * cause that might suppress other important error messages for this class in case we adapt this class in the future.
	 * @ignore
	 */
	private static reduceCallbackFn(httpParams: HttpParams, value: StarkQueryParam, key: string): HttpParams {
		if (typeof value === "undefined") {
			// set key to empty string when not defined
			return httpParams.set(key, "");
		}

		if (Array.isArray(value)) {
			// append each string to the key when set to an array
			return reduce(value, (acc: HttpParams, entry: string) => acc.append(key, entry), httpParams);
		}

		return httpParams.set(key, value);
	}
}
