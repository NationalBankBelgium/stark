import { Observable } from "rxjs";
import { StarkBackend } from "../entities/backend";
import { StarkCollectionResponseWrapper, StarkResource, StarkSingleItemResponseWrapper } from "../entities";
import {
	StarkHttpCreateRequestParams,
	StarkHttpDeleteRequestParams,
	StarkHttpGetCollectionRequestParams,
	StarkHttpGetRequestParams,
	StarkHttpRequestBuilder,
	StarkHttpRequestBuilderImpl,
	StarkHttpSearchRequestParams,
	StarkHttpUpdateRequestParams
} from "../builder";
import { StarkHttpService } from "../services/http.service.intf";
import { StarkLoggingService } from "../../logging/services";
import { StarkSerializable } from "../../../serialization";
import { StarkHttpSerializer, StarkHttpSerializerImpl } from "../serializer";

/**
 * This abstract class provides methods for the most common requests to be performed so it can be extended by your own Http repositories.
 */
export abstract class AbstractStarkHttpRepository<T extends StarkResource> {
	/**
	 * @ignore
	 */
	private _serializer?: StarkHttpSerializer<T>;
	protected get serializer(): StarkHttpSerializer<T> {
		// set the default serializer in case no custom serializer was defined
		// it should be set here to prevent exceptions when the type() getter returns values depending on the actual instance ('return this.xxxx')
		this._serializer = this._serializer || new StarkHttpSerializerImpl<T>(this.type);
		return this._serializer;
	}

	/**
	 * Class constructor
	 * @param starkHttpService The Http Service provided by Stark.
	 * @param logger The logging service. @link StarkLoggingService.
	 * @param backend The backend that this HttpRepository will target.
	 * @param resourcePath The resource path that will be used as default for all the requests performed by this HttpRepository. This will be replaced by the resourcePath provided (if any) in the getRequestBuilder() method.
	 * @param serializer The serializer that will be attached by default to every StarkHttpRequest sent by this HttpRepository to serialize/deserialize the items to be sent/received to/from the backend.
	 */
	public constructor(
		protected starkHttpService: StarkHttpService<T>,
		protected logger: StarkLoggingService,
		protected backend: StarkBackend,
		protected resourcePath: string,
		serializer?: StarkHttpSerializer<T>
	) {
		if (!backend) {
			throw new Error(`AbstractStarkHttpRepository: backend config missing for resourcePath "${resourcePath}".`);
		}
		if (typeof resourcePath === "undefined") {
			throw new Error(`AbstractStarkHttpRepository: resourcePath missing in Http Repository with backend "${backend.name}".`);
		}

		this._serializer = serializer;
	}

	/**
	 * Perform an Http request to create a resource item.
	 * @param item - the item to create
	 * @param params - the parameters used to create the item
	 */
	public create(item: T, params?: StarkHttpCreateRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.create(item, params)
				.build()
		);
	}

	/**
	 * Perform an Http request to update an existing resource item.
	 * @param item - the item to update
	 * @param params - the parameters used to update the item
	 */
	public update(item: T, params?: StarkHttpUpdateRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.update(item, params)
				.build()
		);
	}

	/**
	 * Perform an Http request to delete a resource item.
	 * @param item - the item to delete
	 * @param params - the parameters used to delete the item
	 */
	public delete(item: T, params?: StarkHttpDeleteRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.delete(item, params)
				.build()
		);
	}

	/**
	 * Perform an Http request to fetch a resource item.
	 * @param uuid - the uuid of the item to fetch
	 * @param params - the parameters used to fetch the item
	 */
	public get(uuid: string, params?: StarkHttpGetRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.get(uuid, params)
				.build()
		);
	}

	/**
	 * Perform an Http request to fetch a range of resource items based on the limit and offset.
	 * @param limit - the limit to apply to the request
	 * @param offset - the offset to apply to the request
	 * @param params - the parameters to apply to the request
	 */
	public getCollection(
		limit: number,
		offset: number,
		params?: StarkHttpGetCollectionRequestParams
	): Observable<StarkCollectionResponseWrapper<T>> {
		return this.starkHttpService.executeCollectionRequest(
			this.getRequestBuilder()
				.getCollection(limit, offset, params)
				.build()
		);
	}

	/**
	 * Perform an Http request to fetch a range of resource items that match with the given criteria.
	 * @param criteria - the criteria of the request
	 * @param limit - the limit to apply to the request
	 * @param offset - the offset to apply to the request
	 * @param params - the parameters to apply to the request
	 */
	public search(
		criteria: { [param: string]: string },
		limit: number,
		offset: number,
		params?: StarkHttpSearchRequestParams
	): Observable<StarkCollectionResponseWrapper<T>> {
		return this.starkHttpService.executeCollectionRequest(
			this.getRequestBuilder()
				.search(criteria, limit, offset, params)
				.build()
		);
	}

	/**
	 * Return a new instance of StarkHttpRequestBuilder which can be used to construct an StarkHttpRequest via one of the StarkHttpBuilder variants.
	 * @param resourcePath: the resourcePath of the requestBuilder
	 */
	// the default resourcePath of the returned builder will be replaced with the one that is passed here (if any)
	public getRequestBuilder(resourcePath?: string): StarkHttpRequestBuilder<T> {
		return new StarkHttpRequestBuilderImpl(this.backend, resourcePath || this.resourcePath, this.serializer);
	}

	/**
	 * Return the type of a class to be used in order to deserialize (using the default StarkHttpSerializerImpl
	 * or a custom serializer) the Http response of the different requests.
	 * This method must be implemented in every Http repository that extends this abstract class
	 * and the returned class should have the correct serialization decorators.
	 */
	protected abstract get type(): StarkSerializable;
}
