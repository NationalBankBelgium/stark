import { StarkLanguage } from "../../configuration/entities/language";
import { StarkSortItem } from "../entities";

export interface StarkHttpFetchResourceRequestBuilder {
	/**
	 * Adds language codes to the "Accept-Language" header
	 * @param languages - Language(s) in which the response should be returned
	 * @returns The current builder
	 */
	addAcceptedLanguage(...languages: StarkLanguage[]): this;

	/**
	 * Adds the fields that should be included in the response
	 * @param fields - Name of the fields to be included
	 * @returns The current builder
	 */
	addFilterByInclude(...fields: string[]): this;

	/**
	 * Adds the "style" (a label put on a set of fields) that should be included in the response
	 * @param style - Name of the style to be included
	 * @returns The current builder
	 */
	addFilterByStyle(style: string): this;

	/**
	 * Adds a "sort" query parameter to the request
	 * @param sortItems - Sort parameters to define the order in which the items will be returned
	 * @returns The current builder
	 */
	addSortBy(...sortItems: StarkSortItem[]): this;
}
