export const starkMapNotEmptyValidatorName: string = "starkMapNotEmpty";

export function starkMapNotEmpty(map: Map<any, any>): boolean {
	return map instanceof Map && map.size > 0;
}
