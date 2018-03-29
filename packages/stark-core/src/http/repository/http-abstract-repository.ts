"use strict";

import { Observable } from "rxjs/Observable";
import { StarkBackend } from "../entities/backend";
import { StarkCollectionResponseWrapper, StarkResource, StarkSingleItemResponseWrapper } from "../entities/index";
import {
	StarkHttpCreateRequestParams,
	StarkHttpDeleteRequestParams,
	StarkHttpGetCollectionRequestParams,
	StarkHttpGetRequestParams,
	StarkHttpRequestBuilder,
	StarkHttpRequestBuilderImpl,
	StarkHttpSearchRequestParams,
	StarkHttpUpdateRequestParams
} from "../builder/index";
import { StarkHttpService } from "../services/http.service.intf";
import { StarkLoggingService } from "../../logging/index";
import { StarkSerializable } from "../../serialization/index";
import { StarkHttpSerializer, StarkHttpSerializerImpl } from "../serializer/index";

export abstract class AbstractStarkHttpRepository<T extends StarkResource> {
	protected starkHttpService: StarkHttpService<T>;
	protected logger: StarkLoggingService;
	protected backend: StarkBackend;
	protected resourcePath: string;
	protected serializer: StarkHttpSerializer<T>;

	public constructor(
		starkHttpService: StarkHttpService<T>,
		logger: StarkLoggingService,
		backend: StarkBackend | undefined,
		resourcePath: string | undefined,
		serializer?: StarkHttpSerializer<T>
	) {
		this.starkHttpService = starkHttpService;
		this.logger = logger;

		if (serializer) {
			this.serializer = serializer;
		}

		if (!backend) {
			throw new Error('AbstractStarkHttpRepository: backend config missing for resourcePath "' + this.resourcePath + '".');
		} else {
			this.backend = backend;
		}
		if (typeof resourcePath === "undefined") {
			throw new Error(
				'AbstractStarkHttpRepository: resourcePath missing in Http Repository with backend "' + this.backend.name + '".'
			);
		} else {
			this.resourcePath = resourcePath;
		}
	}

	public create(item: T, params?: StarkHttpCreateRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.create(item, params)
				.build()
		);
	}

	public update(item: T, params?: StarkHttpUpdateRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.update(item, params)
				.build()
		);
	}

	public delete(item: T, params?: StarkHttpDeleteRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.delete(item, params)
				.build()
		);
	}

	public get(uuid: string, params?: StarkHttpGetRequestParams): Observable<StarkSingleItemResponseWrapper<T>> {
		return this.starkHttpService.executeSingleItemRequest(
			this.getRequestBuilder()
				.get(uuid, params)
				.build()
		);
	}

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

	// the default resourcePath of the returned builder will be replaced with the one that is passed here (if any)
	public getRequestBuilder(resourcePath?: string): StarkHttpRequestBuilder<T> {
		// set the default serializer in case no custom serializer was defined
		// it should be set here to prevent exceptions when the type() getter returns values depending on the actual instance ('return this.xxxx')
		this.serializer = this.serializer || new StarkHttpSerializerImpl<T>(this.type);
		return new StarkHttpRequestBuilderImpl(this.backend, resourcePath || this.resourcePath, this.serializer);
	}

	protected abstract get type(): StarkSerializable;
}
