import { StarkHttpResponse } from "./http-response.entity.intf";

/**
 * This class is used by the {@link StarkHttpService} in order to wrap the Http response from all requests aimed to return item(s).
 */
export interface StarkResponseWrapper<DataType> extends StarkHttpResponse {
	/**
	 * Holds the data if the Http request was successful.
	 */
	data: DataType;
}
