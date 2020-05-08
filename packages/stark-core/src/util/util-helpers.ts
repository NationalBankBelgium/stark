/**
 * Converts a map (used for params and headers) into a plain object
 * @param map - The Map to convert
 */
export function convertMapIntoObject(map: Map<string, any>): { [param: string]: any } {
	const resultObj: { [param: string]: any } = {};

	map.forEach((value: any, key: string) => {
		resultObj[key] = value;
	});

	return resultObj;
}
