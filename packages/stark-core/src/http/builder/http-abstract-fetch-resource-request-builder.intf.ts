"use strict";
import {StarkLanguage} from "../../configuration/entities/language";
import {StarkSortItem} from "../entities";

export interface StarkHttpFetchResourceRequestBuilder {
	/**
	 * Adds language codes to the "Accept-Language" header
	 * @param languages {Array<StarkLanguage>} Language(s) in which the response should be returned
	 * @returns {this} The current builder
	 */
	addAcceptedLanguage(...languages: StarkLanguage[]): this;

	/**
	 * Adds the fields that should be included in the response
	 * @param fields {Array<string>} Name of the fields to be included
	 * @returns {this} The current builder
	 */
	addFilterByInclude(...fields: string[]): this;

	/**
	 * Adds the "style" (a label put on a set of fields) that should be included in the response
	 * @param style {string} Name of the style to be included
	 * @returns {this} The current builder
	 */
	addFilterByStyle(style: string): this;

	/**
	 * Adds a "sort" query parameter to the request
	 * @param sortItems {Array<StarkSortItem>} Sort parameters to define the order in which the items will be returned
	 * @returns {this} The current builder
	 */
	addSortBy(...sortItems: StarkSortItem[]): this;
}
