const _cloneDeep: Function = require("lodash/cloneDeep");
import { Deserialize, Serialize } from "cerialize";
import { Observable } from "rxjs/Observable";
import { timer } from "rxjs/observable/timer";
import { _throw as observableThrow } from "rxjs/observable/throw";
// FIXME: importing from single entry "rxjs/operators" together with webpack's scope hoisting prevents dead code removal
// see https://github.com/ReactiveX/rxjs/issues/2981
// import { catchError, map, mergeMap, retryWhen } from "rxjs/operators";
import { catchError } from "rxjs/operators/catchError";
import { map } from "rxjs/operators/map";
import { retryWhen } from "rxjs/operators/retryWhen";
import { mergeMap } from "rxjs/operators/mergeMap";
import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { StarkHttpService, starkHttpServiceName } from "./http.service.intf";

import { StarkHttpHeaders } from "../constants/index";
import {
	StarkCollectionMetadataImpl,
	StarkCollectionResponseWrapper,
	StarkCollectionResponseWrapperImpl,
	StarkHttpErrorWrapperImpl,
	StarkHttpRawCollectionResponseData,
	StarkHttpRequest,
	StarkHttpRequestType,
	StarkResource,
	StarkSingleItemResponseWrapper,
	StarkSingleItemResponseWrapperImpl
} from "../entities/index";
import { StarkLoggingService, starkLoggingServiceName } from "../../logging/services/index";
import { StarkSessionService, starkSessionServiceName } from "../../session/services/index";

/**
 * @ngdoc service
 * @name stark-core.service:StarkHttpService
 * @description Service to make HTTP calls in compliance with the guidelines from the NBB REST API Design Guide.
 *
 * @requires StarkLoggingService
 * @requires StarkSessionService
 * @requires HttpClient
 */
@Injectable()
export class StarkHttpServiceImpl<P extends StarkResource> implements StarkHttpService<P> {
	protected retryDelay: number = 1000;

	private httpClient: HttpClient;

	public constructor(
		@Inject(starkLoggingServiceName) private logger: StarkLoggingService,
		@Inject(starkSessionServiceName) private sessionService: StarkSessionService,
		httpClient: HttpClient
	) {
		this.logger = logger;
		this.sessionService = sessionService;
		this.httpClient = httpClient;
	}

	public executeSingleItemRequest(request: StarkHttpRequest<P>): Observable<StarkSingleItemResponseWrapper<P>> {
		// NG-1361: remove the etag before executing the request
		request = this.removeETagFromRequestItem(request);

		// NG-1346: fake pre-authentication support
		// FIXME: DEVELOPMENT env variable?
		if (/*DEVELOPMENT &&*/ request.backend.fakePreAuthenticationEnabled === true) {
			request = this.addFakePreAuthenticationHeaders(request);
		}

		// NG-117: add correlation identifier
		request = this.addCorrelationIdentifierHeader(request);

		// IMPORTANT: In Angular2+ HTTP service subscribing multiple times will actually do multiple requests
		// see https://angular.io/guide/http#always-subscribe
		let httpResponse$: Observable<HttpResponse<P>> | undefined;

		switch (request.requestType) {
			case StarkHttpRequestType.GET:
				httpResponse$ = this.performGetRequest(request);
				break;
			case StarkHttpRequestType.DELETE:
				httpResponse$ = this.performDeleteRequest(request);
				break;
			case StarkHttpRequestType.UPDATE:
				httpResponse$ = this.performUpdateRequest(request);
				break;
			case StarkHttpRequestType.UPDATE_IDEMPOTENT:
				httpResponse$ = this.performUpdateRequest(request);
				break;
			case StarkHttpRequestType.CREATE:
				httpResponse$ = this.performCreateRequest(request);
				break;
			default:
				httpResponse$ = undefined;
		}

		if (httpResponse$) {
			return this.getSingleItemResponseWrapperObservable(httpResponse$, request);
		} else {
			return observableThrow(
				"Unknown request type encountered " +
					request.requestType +
					". For collection requests, " +
					"call the executeCollectionRequest method"
			);
		}
	}

	public executeCollectionRequest(request: StarkHttpRequest<P>): Observable<StarkCollectionResponseWrapper<P>> {
		// NG-1346: fake pre-authentication support
		// FIXME: DEVELOPMENT env variable?
		if (/*DEVELOPMENT &&*/ request.backend.fakePreAuthenticationEnabled === true) {
			request = this.addFakePreAuthenticationHeaders(request);
		}

		// NG-117: add correlation identifier
		request = this.addCorrelationIdentifierHeader(request);

		// IMPORTANT: In Angular2+ HTTP service subscribing multiple times will actually do multiple requests
		// see https://angular.io/guide/http#always-subscribe
		let httpResponse$: Observable<HttpResponse<StarkHttpRawCollectionResponseData<P>>> | undefined;

		switch (request.requestType) {
			case StarkHttpRequestType.GET_COLLECTION:
				httpResponse$ = this.performGetCollectionRequest(request);
				break;
			case StarkHttpRequestType.SEARCH:
				httpResponse$ = this.performSearchRequest(request);
				break;
			default:
				httpResponse$ = undefined;
		}

		if (httpResponse$) {
			return this.getCollectionResponseWrapperObservable(httpResponse$, request);
		} else {
			// we return directly here because otherwise compilation fails (can't assign the ErrorObservable type to Subject)
			return observableThrow(
				"Unknown request type encountered " +
					request.requestType +
					". For single requests (no " +
					"collection), call the executeSingleItemRequest method"
			);
		}
	}

	/**
	 * NG-1361: remove the etag before executing the request
	 * We have to remove it otherwise it'll be serialized and cause issues on the back-end
	 * @param request - The request object to modify
	 * @returns The modified request object
	 */
	public removeETagFromRequestItem(request: StarkHttpRequest<P>): StarkHttpRequest<P> {
		let requestCopy: StarkHttpRequest<P> = request;

		if (request.item) {
			requestCopy = _cloneDeep(request);
			const itemWithoutETag: P = _cloneDeep(<P>requestCopy.item);
			delete itemWithoutETag.etag;
			requestCopy.item = itemWithoutETag;
		}

		return requestCopy;
	}

	/**
	 * NG-1346: add NBB-specific headers necessary for faking pre-authentication in non-production environments
	 * @param request - The request object to modify
	 * @returns The modified request object
	 */
	public addFakePreAuthenticationHeaders(request: StarkHttpRequest<P>): StarkHttpRequest<P> {
		this.logger.debug(starkHttpServiceName + ": Adding fake pre-authentication headers");

		const requestCopy: StarkHttpRequest<P> = _cloneDeep(request);

		// add the preAuthentication headers to the request headers
		this.sessionService.fakePreAuthenticationHeaders.forEach((value: string, header: string) => {
			requestCopy.headers.set(header, value);
		});

		return requestCopy;
	}

	/**
	 * NG-117: add NBB-specific header for activity correlation
	 * @param request - The request object to modify
	 * @returns The modified request object
	 */
	public addCorrelationIdentifierHeader(request: StarkHttpRequest<P>): StarkHttpRequest<P> {
		this.logger.debug(starkHttpServiceName + ": Adding correlation identifier header");

		const requestCopy: StarkHttpRequest<P> = _cloneDeep(request);

		requestCopy.headers.set(StarkHttpHeaders.NBB_CORRELATION_ID, this.logger.correlationId);

		return requestCopy;
	}

	public get rawHttpClient(): HttpClient {
		return this.httpClient;
	}

	private performCreateRequest(request: StarkHttpRequest<P>): Observable<HttpResponse<P>> {
		return this.httpClient.post<P>(
			request.backend.url + "/" + request.resourcePath,
			// serialize returns a pre-stringified json object, Angular will generate a string out of it
			this.serialize(<P>request.item, request),
			{
				params: this.convertMapIntoObject(request.queryParameters),
				headers: this.convertMapIntoObject(request.headers),
				observe: "response", // full response, not only the body
				responseType: "json" // body as JSON
			}
		);
	}

	private performUpdateRequest(request: StarkHttpRequest<P>): Observable<HttpResponse<P>> {
		const requestUrl: string = request.backend.url + "/" + request.resourcePath;
		// serialize returns a pre-stringified json object, Angular will generate a string out of it
		const requestData: string | object = this.serialize(<P>request.item, request);

		if (request.requestType === StarkHttpRequestType.UPDATE_IDEMPOTENT) {
			return this.httpClient.put<P>(requestUrl, requestData, {
				params: this.convertMapIntoObject(request.queryParameters),
				headers: this.convertMapIntoObject(request.headers),
				observe: "response", // full response, not only the body
				responseType: "json" // body as JSON
			});
		} else {
			return this.httpClient.post<P>(requestUrl, requestData, {
				params: this.convertMapIntoObject(request.queryParameters),
				headers: this.convertMapIntoObject(request.headers),
				observe: "response", // full response, not only the body
				responseType: "json" // body as JSON
			});
		}
	}

	private performDeleteRequest(request: StarkHttpRequest<P>): Observable<HttpResponse<P>> {
		return this.httpClient.delete<P>(request.backend.url + "/" + request.resourcePath, {
			params: this.convertMapIntoObject(request.queryParameters),
			headers: this.convertMapIntoObject(request.headers),
			observe: "response", // full response, not only the body
			responseType: "json" // body as JSON
		});
	}

	private performGetRequest(request: StarkHttpRequest<P>): Observable<HttpResponse<P>> {
		return this.httpClient.get<P>(request.backend.url + "/" + request.resourcePath, {
			params: this.convertMapIntoObject(request.queryParameters),
			headers: this.convertMapIntoObject(request.headers),
			observe: "response", // full response, not only the body
			responseType: "json" // body as JSON
		});
	}

	private performGetCollectionRequest(request: StarkHttpRequest<P>): Observable<HttpResponse<StarkHttpRawCollectionResponseData<P>>> {
		return this.httpClient.get<StarkHttpRawCollectionResponseData<P>>(request.backend.url + "/" + request.resourcePath, {
			params: this.convertMapIntoObject(request.queryParameters),
			headers: this.convertMapIntoObject(request.headers),
			observe: "response", // full response, not only the body
			responseType: "json" // body as JSON
		});
	}

	private performSearchRequest(request: StarkHttpRequest<P>): Observable<HttpResponse<StarkHttpRawCollectionResponseData<P>>> {
		return this.httpClient.post<StarkHttpRawCollectionResponseData<P>>(
			request.backend.url + "/" + request.resourcePath,
			// Serialize returns a pre-stringified json object, Angular will generate a string out of it
			Serialize(request.item), // the search criteria comes in the request item
			{
				params: this.convertMapIntoObject(request.queryParameters),
				headers: this.convertMapIntoObject(request.headers),
				observe: "response", // full response, not only the body
				responseType: "json" // body as JSON
			}
		);
	}

	private convertMapIntoObject(mapObj: Map<string, any>): { [param: string]: any } {
		const resultObj: { [param: string]: any } = {};

		mapObj.forEach((value: any, key: string) => {
			resultObj[key] = value;
		});

		return resultObj;
	}

	// TODO: return the Angular HttpHeaders or still return our own Map?
	private getResponseHeaders(httpHeaders: HttpHeaders): Map<string, string> {
		const httpResponseHeaders: Map<string, string> = new Map<string, string>();
		for (const headerName of httpHeaders.keys()) {
			httpResponseHeaders.set(headerName, <string>httpHeaders.get(headerName));
		}

		return httpResponseHeaders;
	}

	private getSingleItemResponseWrapperObservable(
		httpResponse$: Observable<HttpResponse<P>>,
		request: StarkHttpRequest<P>
	): Observable<StarkSingleItemResponseWrapper<P>> {
		const retryCount: number = request.retryCount || 0;

		if (retryCount > 0) {
			httpResponse$ = this.addRetryLogic(httpResponse$, retryCount);
		}

		// The stack information in the Http Error (catchError) contains the execution statements of the http call.
		// That information is not useful for the developer.
		// To get a meaningful stack, a dummyError is created before the subscription to the webservice.
		// This dummyError is send to the StarkHttpErrorWrapperImpl and contains all statements up to this method.
		let dummyError: Error = new Error(starkHttpServiceName + ": Error getting a SingleItemResponse");
		if (!dummyError.stack) {
			// IE 11 won't generate a stack unless the error is thrown
			// https://docs.microsoft.com/en-us/scripting/javascript/reference/stack-property-error-javascript#remarks
			try {
				throw dummyError;
			} catch (error) {
				dummyError = error;
			}
		}

		return httpResponse$.pipe(
			map((result: HttpResponse<P>) => {
				const httpResponseHeaders: Map<string, string> = this.getResponseHeaders(result.headers);
				const resource: P = this.deserialize(<any>result.body, request, result);

				if (resource && result.headers.has(StarkHttpHeaders.ETAG)) {
					resource.etag = <any>result.headers.get(StarkHttpHeaders.ETAG);
				}

				return new StarkSingleItemResponseWrapperImpl<P>(result.status, httpResponseHeaders, resource);
			}),
			catchError((result: HttpErrorResponse) => {
				const httpResponseHeaders: Map<string, string> = this.getResponseHeaders(result.headers);
				return observableThrow(new StarkHttpErrorWrapperImpl(result, httpResponseHeaders, dummyError));
			})
		);
	}

	private getCollectionResponseWrapperObservable(
		httpResponse$: Observable<HttpResponse<StarkHttpRawCollectionResponseData<P>>>,
		request: StarkHttpRequest<P>
	): Observable<StarkCollectionResponseWrapper<P>> {
		const retryCount: number = request.retryCount || 0;

		if (retryCount > 0) {
			httpResponse$ = this.addRetryLogic(httpResponse$, retryCount);
		}

		// The stack information in the Http Error (catchError) contains the execution statements of the http call.
		// That information is not useful for the developer.
		// To get a meaningful stack, a dummyError is created before the subscription to the webservice.
		// This dummyError is send to the StarkHttpErrorWrapperImpl and contains all statements up to this method.
		let dummyError: Error = new Error(starkHttpServiceName + ": Error getting a CollectionResponse");
		if (!dummyError.stack) {
			// IE 11 won't generate a stack unless the error is thrown
			// https://docs.microsoft.com/en-us/scripting/javascript/reference/stack-property-error-javascript#remarks
			try {
				throw dummyError;
			} catch (error) {
				dummyError = error;
			}
		}

		return httpResponse$.pipe(
			map((result: HttpResponse<StarkHttpRawCollectionResponseData<P>>) => {
				const httpResponseHeaders: Map<string, string> = this.getResponseHeaders(result.headers);
				if ((<StarkHttpRawCollectionResponseData<P>>result.body).items instanceof Array) {
					if ((<StarkHttpRawCollectionResponseData<P>>result.body).metadata) {
						if ((<StarkHttpRawCollectionResponseData<P>>result.body).metadata.etags) {
							for (const item of (<StarkHttpRawCollectionResponseData<P>>result.body).items) {
								if (typeof item === "object") {
									if (item.uuid) {
										if ((<object>(<StarkHttpRawCollectionResponseData<P>>result.body).metadata.etags)[item.uuid]) {
											item.etag = (<object>(<StarkHttpRawCollectionResponseData<P>>result.body).metadata.etags)[
												item.uuid
											];
										} else {
											this.logger.warn(starkHttpServiceName + ": no etag found for resource with uuid ", item.uuid);
										}
									} else {
										this.logger.warn(starkHttpServiceName + ": no 'uuid' property found in item ", item);
									}
								} else {
									this.logger.warn(
										starkHttpServiceName +
											": cannot set the etag property in the item '" +
											item +
											"' because it is not an object"
									);
								}
							}
						} else {
							this.logger.warn(starkHttpServiceName + ": no 'etags' object found in the collection response metadata");
						}
					} else {
						this.logger.warn(starkHttpServiceName + ": no 'metadata' object found in the collection response");
					}
				} else {
					this.logger.warn(starkHttpServiceName + ": no 'items' array found in the collection response");
				}
				const items: object[] = (<StarkHttpRawCollectionResponseData<P>>result.body).items;
				return new StarkCollectionResponseWrapperImpl<P>(
					result.status,
					httpResponseHeaders,
					items instanceof Array ? items.map((item: object) => this.deserialize(item, request, result)) : items,
					Deserialize((<StarkHttpRawCollectionResponseData<P>>result.body).metadata, StarkCollectionMetadataImpl)
				);
			}),
			catchError((result: HttpErrorResponse) => {
				const httpResponseHeaders: Map<string, string> = this.getResponseHeaders(result.headers);
				return observableThrow(new StarkHttpErrorWrapperImpl(result, httpResponseHeaders, dummyError));
			})
		);
	}

	private addRetryLogic<R>(httpResponse$: Observable<HttpResponse<R>>, retryCount: number): Observable<HttpResponse<R>> {
		return httpResponse$.pipe(
			retryWhen((errors: Observable<any>) => {
				let retries: number = 0;
				return errors.pipe(
					mergeMap((error: HttpResponse<P>) => {
						if (retries < retryCount) {
							retries++;
							return timer(this.retryDelay);
						} else {
							return observableThrow(error);
						}
					})
				);
			})
		);
	}

	private serialize(entity: P, request: StarkHttpRequest<P>): string | object {
		return request.serializer.serialize(entity, request);
	}

	private deserialize(
		rawEntity: string | object,
		request: StarkHttpRequest<P>,
		response: HttpResponse<P | StarkHttpRawCollectionResponseData<P>>
	): P {
		return request.serializer.deserialize(rawEntity, request, response);
	}
}
