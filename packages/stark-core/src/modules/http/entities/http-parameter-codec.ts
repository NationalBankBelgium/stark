import { HttpParameterCodec } from "@angular/common/http";

/**
 *
 * A custom implementation of Angular {@link https://v12.angular.io/api/common/http/HttpParameterCodec|HttpParameterCodec} to correctly
 * encode/decode HTTP query parameters via the {@link StarkHttpService}.
 *
 * Uses the default JavaScript method `encodeURIComponent` and `decodeURIComponent` for encoding and decoding.
 *
 * See:
 * - {@link https://github.com/NationalBankBelgium/stark/issues/1130}
 * - {@link https://github.com/angular/angular/issues/18261#issuecomment-426383787}
 */
export class StarkHttpParameterCodec implements HttpParameterCodec {
	/**
	 * Encodes a key
	 * @param key - Key to encode
	 */
	public encodeKey(key: string): string {
		return encodeURIComponent(key);
	}

	/**
	 * Encodes a value
	 * @param value - Value to encode
	 */
	public encodeValue(value: string): string {
		return encodeURIComponent(value);
	}

	/**
	 * Decodes a key
	 * @param key - Key to decode
	 */
	public decodeKey(key: string): string {
		return decodeURIComponent(key);
	}

	/**
	 * Decodes a value
	 * @param value - Value to decode
	 */
	public decodeValue(value: string): string {
		return decodeURIComponent(value);
	}
}
