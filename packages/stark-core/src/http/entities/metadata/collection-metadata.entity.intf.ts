"use strict";

import {StarkSortItem} from "./metadata-sort-item.entity.intf";
import {StarkPaginationMetadata} from "./metadata-pagination.entity.intf";
import {StarkETags} from "./metadata-etags.entity.intf";
import {StarkWarnings} from "./metadata-warnings.entity.intf";

export interface StarkCollectionMetadata extends StarkETags, StarkWarnings {
	/**
	 * Object containing sorting metadata
	 * @link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Sorting-Metadata
	 */
	sortedBy: StarkSortItem[];

	/**
	 * Object containing pagination metadata
	 * @link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Pagination-Rules-and-metadata#pagination-metadata
	 */
	pagination: StarkPaginationMetadata;

	/**
	 * Object containing any other custom metadata (if any)
	 * @link https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki/Pagination-Rules-and-metadata#custom-metadata
	 */
	custom?: object;
}
