import { Deserialize, ISerializable, Serialize } from "cerialize";

/**
 * Solution proposed by `@weichx` for Maps having string keys
 * in this way the custom behavior for handling ES6 Maps is defined once instead of doing it every time a Map is used.
 *
 * See:
 * - {@link https://github.com/weichx/cerialize/issues/32}
 * - {@link https://github.com/weichx/cerialize/issues/33}
 * @param targetType - The type in which we want to serialize a file
 */
export const stringMap: Function = (targetType: any): ISerializable => ({
	Serialize: (map: Map<string, any>): object => {
		const obj: object = {};
		map.forEach((value: any, key: string) => {
			obj[key] = Serialize(value);
		});
		return obj;
	},

	Deserialize: (json: any): Map<string, any> => {
		const map: Map<string, any> = new Map<string, unknown>();
		for (const key of Object.keys(json)) {
			map.set(key, Deserialize(json[key], targetType));
		}
		return map;
	}
});
