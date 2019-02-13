import { HttpParameterCodec } from "@angular/common/http";

/**
 * A custom implementation of HttpParameterCodec (used for encoding / decoding HTTP query parameters).
 * Uses the default JavaScript method `encodeURIComponent` and `decodeURIComponent` for encoding and decoding.
 * @link https://github.com/angular/angular/issues/18261#issuecomment-426383787
 */
export class StarkHttpParameterCodec implements HttpParameterCodec {
	/**
	 * Encodes a key
	 * @param key - key to encode
	 */
	public encodeKey(key: string): string {
		return encodeURIComponent(key);
	}

	/**
	 * Encodes a value
	 * @param value - value to encode
	 */
	public encodeValue(value: string): string {
		return encodeURIComponent(value);
	}

	/**
	 * Decodes a key
	 * @param key - key to decode
	 */
	public decodeKey(key: string): string {
		return decodeURIComponent(key);
	}

	/**
	 * Decodes a value
	 * @param value - value to decode
	 */
	public decodeValue(value: string): string {
		return decodeURIComponent(value);
	}
}
