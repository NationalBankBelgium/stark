import createSpyObj = jasmine.createSpyObj;
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import { autoserialize, autoserializeAs, inheritSerialization, Serialize } from "cerialize";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { StarkHttpServiceImpl } from "./http.service";
import {
	StarkBackend,
	StarkBackendImpl,
	StarkCollectionMetadata,
	StarkCollectionMetadataImpl,
	StarkCollectionResponseWrapper,
	StarkHttpError,
	StarkHttpErrorDetail,
	StarkHttpErrorDetailImpl,
	StarkHttpErrorImpl,
	StarkHttpErrorWrapper,
	StarkHttpRawCollectionResponseData,
	StarkHttpRequest,
	StarkHttpRequestType,
	StarkPaginationMetadata,
	StarkResource,
	StarkSingleItemMetadataImpl,
	StarkSingleItemResponseWrapper,
	StarkSortItem,
	StarkSortItemImpl
} from "../entities";

import { StarkHttpHeaders, StarkSortOrder } from "../constants";
import { StarkHttpStatusCodes } from "../enumerators";
import { StarkLoggingService } from "../../logging";
import { MockStarkLoggingService } from "../../logging/testing";
import { MockStarkSessionService } from "../../session/testing";
import { StarkHttpSerializer, StarkHttpSerializerImpl } from "../serializer";
import { StarkSessionService } from "../../session";

// FIXME: re-enable this TSLINT rule and refactor these tests to try to reduce the duplication of function as much as possible
/* tslint:disable:no-identical-functions */
describe("Service: StarkHttpService", () => {
	let loggerMock: StarkLoggingService;
	let mockSessionService: StarkSessionService;
	let httpMock: SpyObj<HttpClient>;
	let starkHttpService: HttpServiceHelper<MockResource>;
	let mockBackend: StarkBackend;
	let mockResourcePath: string;
	let mockResourceWithEtag: MockResource;
	let mockResourceWithoutEtag: MockResource;
	let mockResourceWithMetadata: MockResource;

	/* MockResource */
	const mockUuid: string = "dfd45d31-1c78-4075-914e-9dd570f3eb31";
	const mockEtag: string = "0123456789";
	const mockProperty1: string = "Value1";
	const mockProperty2: string = "Value2";

	/* HTTP Headers */
	const contentTypeKey: string = StarkHttpHeaders.CONTENT_TYPE;
	const contentTypeValue: string = "application/json; charset=utf-8";
	const contentLengthKey: string = "Content-Length";
	const contentLengthValue: string = "10000";
	const expiresKey: string = "Expires";
	const expiresValue: string = "-1";

	const mockCorrelationId: string = "fooBarCorrelationIdentifier";

	const httpHeaders: { [name: string]: string } = {};
	httpHeaders[contentTypeKey] = contentTypeValue;
	httpHeaders[contentLengthKey] = contentLengthValue;
	httpHeaders[expiresKey] = expiresValue;

	/* HTTP Errors */
	const mockHttpErrorType: string = "https://api.demo.nbb.be/v1/errors/validation";
	const mockHttpErrorTitle: string = "Validation errors";
	const mockHttpErrorInstance: string = "4f4b3e6b-0707-4451-922f-53982ef83fdf";
	const mockHttpDetailErrorType: string = "https://api.demo.nbb.be/v1/errors/user-invalid";
	const mockHttpDetailErrorTitle: string = "Invalid user information";
	const mockHttpErrorDetail1: string = "The username is already in use";
	const mockHttpErrorDetail2: string = "The user's name is missing";
	const mockHttpErrorDetailField1: string = "firstname";
	const mockHttpErrorDetailField2: string = "lastname";
	const mockHttpErrorDetail3: string = "The e-mail is invalid";

	let headersMap: Map<string, string>;

	const mockHttpError: StarkHttpError = {
		type: mockHttpErrorType,
		title: mockHttpErrorTitle,
		titleKey: "errors.validation",
		instance: mockHttpErrorInstance,
		errors: [
			{
				type: mockHttpDetailErrorType,
				title: mockHttpDetailErrorTitle,
				titleKey: "errors.user.invalid",
				detail: mockHttpErrorDetail1,
				detailKey: "errors.user.invalid.username.already.in.use",
				fields: ["username"],
				instance: mockHttpErrorInstance
			},
			{
				type: mockHttpDetailErrorType,
				title: mockHttpDetailErrorTitle,
				titleKey: "errors.user.invalid",
				detail: mockHttpErrorDetail2,
				detailKey: "errors.user.invalid.username.missing",
				fields: [mockHttpErrorDetailField1, mockHttpErrorDetailField2],
				instance: mockHttpErrorInstance
			},
			{
				type: mockHttpDetailErrorType,
				title: mockHttpDetailErrorTitle,
				titleKey: "errors.user.invalid",
				detail: mockHttpErrorDetail3,
				detailKey: "errors.user.invalid.e-mail",
				fields: [" e-mail"],
				instance: mockHttpErrorInstance
			}
		]
	};

	const mockWarnings: StarkHttpErrorDetail[] = [...mockHttpError.errors];
	const mockResourceMetadata: MockResourceMetadata = {
		warnings: mockWarnings,
		someValue: "whatever"
	};
	const mockPaginationMetadata: StarkPaginationMetadata = {
		limit: 25,
		offset: 50,
		previousOffset: 25,
		nextOffset: 75,
		currentPage: 3,
		pageCount: 40,
		totalCount: 1000
	};

	interface HttpRequestOptions {
		params: {
			[param: string]: string | string[];
		};
		headers: {
			[header: string]: string | string[];
		};
		observe: "response";
		responseType: "json";
	}

	function assertHttpError(httpError: StarkHttpError, expectedError: StarkHttpError): void {
		expect(httpError instanceof StarkHttpErrorImpl).toBe(true);
		expect(httpError.errors).toBeDefined();
		expect(httpError.errors.length).toBe(expectedError.errors.length);

		httpError.errors.forEach((error: StarkHttpErrorDetail, index: number) => {
			expect(error instanceof StarkHttpErrorDetailImpl).toBe(true);
			expect(error.type).toBe(expectedError.errors[index].type);
			expect(error.title).toBe(expectedError.errors[index].title);
			expect(error.titleKey).toBe(expectedError.errors[index].titleKey);
			expect(error.titleKeyParameters).toEqual(expectedError.errors[index].titleKeyParameters);
			expect(error.instance).toBe(expectedError.errors[index].instance);
			if (typeof expectedError.errors[index].timestamp !== "undefined") {
				expect(error.timestamp).toBe(expectedError.errors[index].timestamp);
			} else {
				// the timestamp is auto generated in the constructor of the StarkErrorImpl class
				expect(error.timestamp).toBeDefined();
			}
			expect(error.metadata).toEqual(expectedError.errors[index].metadata);
			expect(error.detail).toBe(expectedError.errors[index].detail);
			expect(error.detailKey).toBe(expectedError.errors[index].detailKey);
			expect(error.detailKeyParameters).toEqual(expectedError.errors[index].detailKeyParameters);
			expect(error.fields).toEqual(expectedError.errors[index].fields);
			expect(error.status).toBe(expectedError.errors[index].status);
			expect(error.index).toBe(expectedError.errors[index].index);
		});
	}

	function assertResponseHeaders(responseHeaders: Map<string, string>, expectedHeaders: { [header: string]: string }): void {
		expect(responseHeaders.size).toBe(Object.keys(expectedHeaders).length);

		for (const header of Object.keys(expectedHeaders)) {
			expect(expectedHeaders[header]).toBeDefined();
			expect(responseHeaders.get(header)).toBe(expectedHeaders[header]);
		}
	}

	function assertCollectionMetadata(collectionMetadata: StarkCollectionMetadata, expectedMetadata: StarkCollectionMetadata): void {
		expect(collectionMetadata instanceof StarkCollectionMetadataImpl).toBe(true);

		if (expectedMetadata.sortedBy) {
			assertMetadataSorting(collectionMetadata.sortedBy, expectedMetadata.sortedBy);
		} else {
			expect(collectionMetadata.sortedBy).toBeUndefined();
		}
		if (expectedMetadata.pagination) {
			assertMetadataPagination(collectionMetadata.pagination, expectedMetadata.pagination);
		} else {
			expect(collectionMetadata.pagination).toBeUndefined();
		}
		if (expectedMetadata.warnings) {
			assertMetadataWarnings(<StarkHttpErrorDetail[]>collectionMetadata.warnings, expectedMetadata.warnings);
		} else {
			expect(collectionMetadata.warnings).toBeUndefined();
		}
		if (expectedMetadata.etags) {
			expect(collectionMetadata.etags).toEqual(expectedMetadata.etags);
		} else {
			expect(collectionMetadata.etags).toBeUndefined();
		}
		if (expectedMetadata.custom) {
			expect(collectionMetadata.custom).toEqual(expectedMetadata.custom);
		} else {
			expect(collectionMetadata.custom).toBeUndefined();
		}
	}

	function assertMetadataWarnings(metadataWarnings: StarkHttpErrorDetail[], expectedWarnings: StarkHttpErrorDetail[]): void {
		expect(metadataWarnings.length).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings).length);

		metadataWarnings.forEach((warning: StarkHttpErrorDetail, index: number) => {
			expect(warning.type).toBe(expectedWarnings[index].type);
			expect(warning.title).toBe(expectedWarnings[index].title);
			expect(warning.titleKey).toBe(expectedWarnings[index].titleKey);
			expect(warning.detail).toBe(expectedWarnings[index].detail);
			expect(warning.detailKey).toBe(expectedWarnings[index].detailKey);
			expect(warning.fields).toEqual(expectedWarnings[index].fields);
			expect(warning.instance).toBe(expectedWarnings[index].instance);
		});
	}

	function assertMetadataPagination(metadataPagination: StarkPaginationMetadata, expectedPagination: StarkPaginationMetadata): void {
		expect(metadataPagination.currentPage).toBe(expectedPagination.currentPage);
		expect(metadataPagination.limit).toBe(expectedPagination.limit);
		expect(metadataPagination.offset).toBe(expectedPagination.offset);
		expect(metadataPagination.previousOffset).toBe(expectedPagination.previousOffset);
		expect(metadataPagination.nextOffset).toBe(expectedPagination.nextOffset);
		expect(metadataPagination.pageCount).toBe(expectedPagination.pageCount);
		expect(metadataPagination.totalCount).toBe(expectedPagination.totalCount);
	}

	function assertMetadataSorting(metadataSorting: StarkSortItem[], expectedSorting: StarkSortItem[]): void {
		expect(metadataSorting.length).toBe(expectedSorting.length);

		metadataSorting.forEach((sortItem: StarkSortItem, index: number) => {
			expect(sortItem instanceof StarkSortItemImpl).toBe(true);
			expect(sortItem.field).toBe(expectedSorting[index].field);
			expect(sortItem.order).toBe(expectedSorting[index].order);
			expect(sortItem.sortValue).toBe(expectedSorting[index].sortValue);
		});
	}

	function assertResponseData(responseData: MockResource[], expectedResponseData: MockResource[]): void {
		expect(responseData).toBeDefined();
		expect(responseData.length).toBe(expectedResponseData.length);

		responseData.forEach((collectionItem: MockResource, index: number) => {
			expect(collectionItem instanceof MockResource).toBe(true);
			expect(collectionItem.uuid).toBe(expectedResponseData[index].uuid);
			expect(collectionItem.property1).toBe(expectedResponseData[index].property1);
			expect(collectionItem.property2).toBe(expectedResponseData[index].property2);
			expect(collectionItem.etag).toBe(expectedResponseData[index].etag);
		});
	}

	function assertHttpFailure(errorWrapper: StarkHttpErrorWrapper): void {
		expect(errorWrapper).toBeDefined();
		assertHttpError(errorWrapper.httpError, mockHttpError);
		assertResponseHeaders(errorWrapper.starkHttpHeaders, httpHeaders);
	}

	function assertHttpCall(
		httpMethod: Spy,
		targetUrl: string,
		httpRequestConfig: HttpRequestOptions,
		serializedData?: string | object,
		attempts: number = 1
	): void {
		expect(httpMethod).toHaveBeenCalledTimes(attempts);
		if (serializedData) {
			expect(httpMethod).toHaveBeenCalledWith(targetUrl, serializedData, httpRequestConfig);
		} else {
			expect(httpMethod).toHaveBeenCalledWith(targetUrl, httpRequestConfig);
		}
	}

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockBackend.url = "www.awesomeapi.com";
		mockResourcePath = "mock";
		mockResourceWithoutEtag = new MockResource(mockUuid);
		mockResourceWithoutEtag.property1 = mockProperty1;
		mockResourceWithoutEtag.property2 = mockProperty2;
		mockResourceWithEtag = { ...mockResourceWithoutEtag, etag: mockEtag };
		mockResourceWithMetadata = {
			...mockResourceWithoutEtag,
			etag: mockEtag,
			metadata: mockResourceMetadata
		};
		// Make sure that a correlation identifier is defined correctly on the logger
		loggerMock = new MockStarkLoggingService(mockCorrelationId);
		mockSessionService = new MockStarkSessionService();
		httpMock = createSpyObj<HttpClient>("HttpClient", ["get", "put", "post", "delete"]);

		starkHttpService = new HttpServiceHelper<MockResource>(loggerMock, mockSessionService, httpMock);
		starkHttpService.retryDelay = 10; // override retry delay to make unit tests faster

		headersMap = new Map<string, string>();
		// Assume that the nbb-correlation-id header will always be set
		headersMap.set(StarkHttpHeaders.NBB_CORRELATION_ID, mockCorrelationId);
	});

	describe("executeSingleItemRequest", () => {
		describe("with a Get request", () => {
			let request: StarkHttpRequest<MockResource>;

			beforeEach(() => {
				request = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.GET,
					item: undefined,
					serializer: mockResourceSerializer
				};
				request.queryParameters.set("duplicatedParam", ["paramValue1", "paramValue2"]);
			});

			it("on SUCCESS, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata).toBeUndefined();

						assertHttpCall(httpMock.get, "www.awesomeapi.com/mock", {
							params: convertMapIntoObject(request.queryParameters),
							headers: convertMapIntoObject(headersMap),
							observe: "response",
							responseType: "json"
						});
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should return the data including metadata (if any) and wrap it in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: mockResourceWithMetadata,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						assertMetadataWarnings(<StarkHttpErrorDetail[]>result.data.metadata.warnings, mockWarnings);

						expect(result.data.metadata.someValue).toBe(mockResourceMetadata.someValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(throwError(httpErrorResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						assertHttpCall(httpMock.get, "www.awesomeapi.com/mock", {
							params: convertMapIntoObject(request.queryParameters),
							headers: convertMapIntoObject(headersMap),
							observe: "response",
							responseType: "json"
						});
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				httpMock.get.and.returnValue(
					throwError(httpErrorResponse).pipe(
						catchError((err: any) => {
							errorCounter++;
							return throwError(err);
						})
					)
				);

				request.retryCount = 2;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});
		});

		describe("with a Delete request", () => {
			let request: StarkHttpRequest<MockResource>;

			beforeEach(() => {
				request = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.DELETE,
					item: mockResourceWithEtag,
					serializer: mockResourceSerializer
				};
				request.queryParameters.set("duplicatedParam", ["paramValue1", "paramValue2"]);
			});

			it("on SUCCESS, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<undefined>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: undefined,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.delete.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						expect(result.data).toBeUndefined();
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);

						assertHttpCall(httpMock.delete, "www.awesomeapi.com/mock", {
							params: convertMapIntoObject(request.queryParameters),
							headers: convertMapIntoObject(headersMap),
							observe: "response",
							responseType: "json"
						});
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.delete.and.returnValue(throwError(httpErrorResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						assertHttpCall(httpMock.delete, "www.awesomeapi.com/mock", {
							params: convertMapIntoObject(request.queryParameters),
							headers: convertMapIntoObject(headersMap),
							observe: "response",
							responseType: "json"
						});
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				httpMock.delete.and.returnValue(
					throwError(httpErrorResponse).pipe(
						catchError((err: any) => {
							errorCounter++;
							return throwError(err);
						})
					)
				);

				request.retryCount = 2;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});
		});

		describe("with an Update request", () => {
			let request: StarkHttpRequest<MockResource>;

			beforeEach(() => {
				request = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.UPDATE,
					item: mockResourceWithEtag,
					serializer: mockResourceSerializer
				};
				request.queryParameters.set("duplicatedParam", ["paramValue1", "paramValue2"]);
			});

			it("should remove the etag from the entity before serializing it", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe((result: StarkSingleItemResponseWrapper<MockResource>) => {
					expect(result).toBeDefined();
				});

				assertHttpCall(
					httpMock.post,
					"www.awesomeapi.com/mock",
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					},
					request.serializer.serialize(mockResourceWithoutEtag) // etag is removed from the item sent due to NG-1361
				);
			});

			it("on POST SUCCESS ('UPDATE'), should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata).toBeUndefined();
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);

						assertHttpCall(
							httpMock.post,
							"www.awesomeapi.com/mock",
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							},
							request.serializer.serialize(mockResourceWithoutEtag)
						);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on POST SUCCESS ('UPDATE'), should return the data including metadata (if any) and wrap it in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: mockResourceWithMetadata,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						assertMetadataWarnings(<StarkHttpErrorDetail[]>result.data.metadata.warnings, mockWarnings);

						expect(result.data.metadata.someValue).toBe(mockResourceMetadata.someValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on PUT SUCCESS ('UPDATE_IDEMPOTENT'), should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.put.and.returnValue(of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE_IDEMPOTENT;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata).toBeUndefined();
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);

						assertHttpCall(
							httpMock.put,
							"www.awesomeapi.com/mock",
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							},
							request.serializer.serialize(mockResourceWithoutEtag)
						);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on PUT SUCCESS ('UPDATE_IDEMPOTENT'), should return the data including metadata (if any) and wrap it in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: mockResourceWithMetadata,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.put.and.returnValue(of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE_IDEMPOTENT;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						assertMetadataWarnings(<StarkHttpErrorDetail[]>result.data.metadata.warnings, mockWarnings);

						expect(result.data.metadata.someValue).toBe(mockResourceMetadata.someValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on POST FAILURE ('UPDATE'), should wrap the returned data in an observable", () => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(throwError(httpErrorResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						assertHttpCall(
							httpMock.post,
							"www.awesomeapi.com/mock",
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							},
							request.serializer.serialize(mockResourceWithoutEtag)
						);
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on POST FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				httpMock.post.and.returnValue(
					throwError(httpErrorResponse).pipe(
						catchError((err: any) => {
							errorCounter++;
							return throwError(err);
						})
					)
				);

				request.requestType = StarkHttpRequestType.UPDATE;
				request.retryCount = 2;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});

			it("on PUT FAILURE ('UPDATE_IDEMPOTENT'), should wrap the returned data in an observable", () => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.put.and.returnValue(throwError(httpErrorResponse));

				request.requestType = StarkHttpRequestType.UPDATE_IDEMPOTENT;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						assertHttpCall(
							httpMock.put,
							"www.awesomeapi.com/mock",
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							},
							request.serializer.serialize(mockResourceWithoutEtag)
						);
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on PUT FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				httpMock.put.and.returnValue(
					throwError(httpErrorResponse).pipe(
						catchError((err: any) => {
							errorCounter++;
							return throwError(err);
						})
					)
				);

				request.requestType = StarkHttpRequestType.UPDATE_IDEMPOTENT;
				request.retryCount = 2;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});
		});

		describe("with a Create request", () => {
			let request: StarkHttpRequest<MockResource>;

			beforeEach(() => {
				request = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.CREATE,
					item: mockResourceWithEtag,
					serializer: mockResourceSerializer
				};
				request.queryParameters.set("duplicatedParam", ["paramValue1", "paramValue2"]);
			});

			it("should remove the etag from the entity before serializing it", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe((result: StarkSingleItemResponseWrapper<MockResource>) => {
					expect(result).toBeDefined();
				});

				assertHttpCall(
					httpMock.post,
					"www.awesomeapi.com/mock",
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					},
					request.serializer.serialize(mockResourceWithoutEtag) // etag is removed from the item sent due to NG-1361
				);
			});

			it("on SUCCESS, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata).toBeUndefined();
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);

				assertHttpCall(
					httpMock.post,
					"www.awesomeapi.com/mock",
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					},
					request.serializer.serialize(mockResourceWithoutEtag)
				);
			});

			it("on SUCCESS, should return the data including metadata (if any) and wrap it in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: mockResourceWithMetadata,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						assertResponseData([result.data], [mockResourceWithEtag]);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						assertMetadataWarnings(<StarkHttpErrorDetail[]>result.data.metadata.warnings, mockWarnings);

						expect(result.data.metadata.someValue).toBe(mockResourceMetadata.someValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(throwError(httpErrorResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
					}
				);

				assertHttpCall(
					httpMock.post,
					"www.awesomeapi.com/mock",
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					},
					request.serializer.serialize(mockResourceWithoutEtag)
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				httpMock.post.and.returnValue(
					throwError(httpErrorResponse).pipe(
						catchError((err: any) => {
							errorCounter++;
							return throwError(err);
						})
					)
				);

				request.retryCount = 2;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});
		});

		describe("with an unknown request type", () => {
			it("should throw an error", () => {
				const request: StarkHttpRequest<MockResource> = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.GET_COLLECTION,
					item: mockResourceWithoutEtag,
					serializer: mockResourceSerializer
				};

				starkHttpService.executeSingleItemRequest(request).subscribe(
					() => {
						fail("The 'next' function should not be called in case of error");
					},
					(error: string) => {
						expect(error).toContain("Unknown request type");
					},
					() => {
						fail("The 'complete' function should not be called in case of error");
					}
				);
			});
		});
	});

	describe("executeCollectionRequest", () => {
		const mockCustomMetadata: object = {
			prop1: 1234,
			prop2: "whatever",
			prop3: "2016-03-18T18:25:43.511Z",
			prop4: ["some value", "false", "null", "", true, false, 0, { name: "Christopher", surname: "Cortes" }]
		};

		describe("with a GetCollection request", () => {
			let request: StarkHttpRequest<MockResource>;

			beforeEach(() => {
				request = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.GET_COLLECTION,
					item: undefined,
					serializer: mockResourceSerializer
				};
				request.queryParameters.set("duplicatedParam", ["paramValue1", "paramValue2"]);
			});

			it("on SUCCESS, should wrap the returned data in an observable", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [
								{
									field: "name",
									order: StarkSortOrder.DESC
								}
							],
							pagination: mockPaginationMetadata,
							etags: etags,
							warnings: mockWarnings
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithEtag]); // should contain the etag now
						assertCollectionMetadata(result.metadata, {
							sortedBy: [
								{
									field: "name",
									order: StarkSortOrder.DESC,
									sortValue: "name" + "+" + StarkSortOrder.DESC
								}
							],
							pagination: mockPaginationMetadata,
							warnings: mockWarnings,
							etags: etags
						});

						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).not.toHaveBeenCalled();

						assertHttpCall(httpMock.get, "www.awesomeapi.com/mock", {
							params: convertMapIntoObject(request.queryParameters),
							headers: convertMapIntoObject(headersMap),
							observe: "response",
							responseType: "json"
						});
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case the response metadata contains no 'etags' object", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: <any>undefined
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutEtag]);
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'etags'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case there is no etag for a certain resource in the response metadata", () => {
				const etags: { [uuid: string]: string } = {};

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutEtag]);
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no etag");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case the response contains an invalid items array", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const items: any = {}; // invalid "items" array

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: items,
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined(); // the data is whatever it comes in the "items" property
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'items'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case an item in the items array is not an object so the etag property cannot be set", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const items: any[] = [
					// non-object item in "items" array
					"some value"
				];

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: items,
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<any>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(false);
						expect(result.data[0]).toBe(items[0]);
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("it is not an object");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case an item in the items array has no uuid so it cannot search the correct etag for it", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const mockResourceWithoutUuid: MockResource = { ...mockResourceWithEtag };
				delete mockResourceWithoutUuid.uuid;

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutUuid],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutUuid]); // should contain the etag now
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'uuid' property found in item");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should deserialize 'as is' the custom metadata if any is returned in the response metadata", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags,
							custom: mockCustomMetadata
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithEtag]); // should contain the etag now
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags,
							custom: mockCustomMetadata
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).not.toHaveBeenCalled();
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case the response contains no metadata object", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: <any>undefined
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.get.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutEtag]);
						expect(result.metadata).toBeUndefined();
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'metadata'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};

				httpMock.get.and.returnValue(throwError(httpErrorResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						assertHttpCall(httpMock.get, "www.awesomeapi.com/mock", {
							params: convertMapIntoObject(request.queryParameters),
							headers: convertMapIntoObject(headersMap),
							observe: "response",
							responseType: "json"
						});
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				httpMock.get.and.returnValue(
					throwError(httpErrorResponse).pipe(
						catchError((err: any) => {
							errorCounter++;
							return throwError(err);
						})
					)
				);

				request.retryCount = 2;

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});
		});

		describe("with a Search request", () => {
			let request: StarkHttpRequest<MockResource>;
			const mockCriteria: { [key: string]: any } = { field1: "anything", field2: "whatever" };

			beforeEach(() => {
				request = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.SEARCH,
					item: mockCriteria,
					serializer: mockResourceSerializer
				};
				request.queryParameters.set("duplicatedParam", ["paramValue1", "paramValue2"]);
			});

			it("on SUCCESS, should wrap the returned data in an observable", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [
								{
									field: "name",
									order: StarkSortOrder.DESC
								}
							],
							pagination: mockPaginationMetadata,
							etags: etags,
							warnings: mockWarnings
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithEtag]); // should contain the etag now
						assertCollectionMetadata(result.metadata, {
							sortedBy: [
								{
									field: "name",
									order: StarkSortOrder.DESC,
									sortValue: "name" + "+" + StarkSortOrder.DESC
								}
							],
							pagination: mockPaginationMetadata,
							warnings: mockWarnings,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).not.toHaveBeenCalled();

						assertHttpCall(
							httpMock.post,
							"www.awesomeapi.com/mock",
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							},
							Serialize(mockCriteria) // the search criteria is sent in the request body payload
						);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case the response metadata contains no 'etags' object", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: <any>undefined
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutEtag]);
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'etags'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case there is no etag for a certain resource in the response metadata", () => {
				const etags: { [uuid: string]: string } = {};

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutEtag]);
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no etag");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case the response contains an invalid items array", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const items: any = {}; // invalid "items" array

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: items,
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined(); // the data is whatever it comes in the "items" property
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'items'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case an item in the items array is not an object so the etag property cannot be set", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const items: any[] = [
					// non-object item in "items" array
					"some value"
				];

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: items,
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<any>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(false);
						expect(result.data[0]).toBe(items[0]);
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("it is not an object");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case an item in the items array has no uuid so it cannot search the correct etag for it", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const mockResourceWithoutUuid: MockResource = { ...mockResourceWithEtag };
				delete mockResourceWithoutUuid.uuid;

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutUuid],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutUuid]); // should contain the etag now
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'uuid' property found in item");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should deserialize 'as is' the custom metadata if any is returned in the response metadata", () => {
				const etags: { [uuid: string]: string } = {};
				etags[mockUuid] = mockEtag;

				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags,
							custom: mockCustomMetadata
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithEtag]); // should contain the etag now
						assertCollectionMetadata(result.metadata, {
							sortedBy: [],
							pagination: mockPaginationMetadata,
							etags: etags,
							custom: mockCustomMetadata
						});
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).not.toHaveBeenCalled();
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on SUCCESS, should log a warning in case the response contains no metadata object", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpRawCollectionResponseData<MockResource>>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: {
						items: [mockResourceWithoutEtag],
						metadata: <any>undefined
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						assertResponseData(result.data, [mockResourceWithoutEtag]);
						expect(result.metadata).toBeUndefined();
						assertResponseHeaders(result.starkHttpHeaders, httpHeaders);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'metadata'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				httpMock.post.and.returnValue(throwError(httpErrorResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						assertHttpCall(
							httpMock.post,
							"www.awesomeapi.com/mock",
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							},
							Serialize(mockCriteria) // the search criteria is sent in the request body payload
						);
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpErrorResponse: Partial<HttpErrorResponse> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					error: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				httpMock.post.and.returnValue(
					throwError(httpErrorResponse).pipe(
						catchError((err: any) => {
							errorCounter++;
							return throwError(err);
						})
					)
				);

				request.retryCount = 2;

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						assertHttpFailure(errorWrapper);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});
		});

		describe("with an unknown request type", () => {
			it("should throw an error", () => {
				const request: StarkHttpRequest<MockResource> = {
					backend: mockBackend,
					resourcePath: mockResourcePath,
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string>(),
					requestType: StarkHttpRequestType.CREATE,
					item: undefined,
					serializer: mockResourceSerializer
				};

				starkHttpService.executeSingleItemRequest(request).subscribe(
					() => {
						fail("The 'next' function should not be called in case of error");
					},
					(error: string) => {
						expect(error).toContain("Unknown request type");
					},
					() => {
						fail("The 'complete' function should not be called in case of error");
					}
				);
			});
		});
	});

	describe("rawHttpClient", () => {
		it("should return the Angular core http client", () => {
			expect(starkHttpService.rawHttpClient).toBe(httpMock);
		});
	});

	describe("addFakePreAuthenticationHeaders", () => {
		it("should get the authentication headers from the Session service and add them to the current request headers", () => {
			const request: StarkHttpRequest<MockResource> = {
				backend: mockBackend,
				resourcePath: mockResourcePath,
				headers: new Map<string, string>(),
				queryParameters: new Map<string, string>(),
				requestType: StarkHttpRequestType.DELETE,
				item: mockResourceWithEtag,
				serializer: mockResourceSerializer
			};
			request.headers.set("some header", "some value");

			const fakePreAuthenticationHeaders: Map<string, string> = mockSessionService.fakePreAuthenticationHeaders;
			expect(fakePreAuthenticationHeaders.size).not.toBe(0);

			const requestWithPreAuthHeaders: StarkHttpRequest = starkHttpService.addFakePreAuthenticationHeaders(request);

			expect(requestWithPreAuthHeaders.headers.size).toBe(fakePreAuthenticationHeaders.size + 1); // plus the custom header
			expect(requestWithPreAuthHeaders.headers.has("some header")).toBe(true);
			expect(requestWithPreAuthHeaders.headers.get("some header")).toBe("some value");

			fakePreAuthenticationHeaders.forEach((headerValue: string, header: string) => {
				expect(requestWithPreAuthHeaders.headers.has(header)).toBe(true);
				expect(requestWithPreAuthHeaders.headers.get(header)).toBe(headerValue);
			});
		});
	});

	describe("addCorrelationIdentifierHeader", () => {
		it("should get the correlationId from the Logging service and add it as a header to the current request headers", () => {
			const request: StarkHttpRequest<MockResource> = {
				backend: mockBackend,
				resourcePath: mockResourcePath,
				headers: new Map<string, string>(),
				queryParameters: new Map<string, string>(),
				requestType: StarkHttpRequestType.DELETE,
				item: mockResourceWithEtag,
				serializer: mockResourceSerializer
			};
			request.headers.set("some header", "some value");

			const correlationId: string = loggerMock.correlationId;
			expect(correlationId).toBe(mockCorrelationId);

			const requestWithCorrelationIdHeader: StarkHttpRequest = starkHttpService.addCorrelationIdentifierHeader(request);

			expect(requestWithCorrelationIdHeader.headers.size).toBe(2); // plus the custom header
			expect(requestWithCorrelationIdHeader.headers.has("some header")).toBe(true);
			expect(requestWithCorrelationIdHeader.headers.get("some header")).toBe("some value");
			expect(requestWithCorrelationIdHeader.headers.has(StarkHttpHeaders.NBB_CORRELATION_ID)).toBe(true);
			expect(requestWithCorrelationIdHeader.headers.get(StarkHttpHeaders.NBB_CORRELATION_ID)).toBe(correlationId);
		});
	});
});

@inheritSerialization(StarkSingleItemMetadataImpl)
class MockResourceMetadata extends StarkSingleItemMetadataImpl {
	@autoserialize public someValue?: string;
}

class MockResource implements StarkResource {
	@autoserialize public uuid: string;

	@autoserialize public etag: string;

	@autoserializeAs(MockResourceMetadata) public metadata: MockResourceMetadata;

	@autoserialize public property1: string;

	@autoserialize public property2: string;

	public constructor(uuid: string) {
		this.uuid = uuid;
	}
}

const mockResourceSerializer: StarkHttpSerializer<MockResource> = new StarkHttpSerializerImpl<MockResource>(MockResource);

function httpHeadersGetter(inputHeaders: { [name: string]: string }): HttpHeaders {
	return new HttpHeaders(inputHeaders);
}

function convertMapIntoObject(map: Map<string, any>): { [param: string]: any } {
	const resultObj: object = {};

	map.forEach((value: any, key: string) => {
		resultObj[key] = value;
	});

	return resultObj;
}

class HttpServiceHelper<P extends StarkResource> extends StarkHttpServiceImpl<P> {
	public retryDelay: number;

	public constructor(logger: StarkLoggingService, sessionService: StarkSessionService, $http: HttpClient) {
		super(logger, sessionService, $http);
	}

	public addFakePreAuthenticationHeaders(request: StarkHttpRequest<P>): StarkHttpRequest<P> {
		return super.addFakePreAuthenticationHeaders(request);
	}

	public addCorrelationIdentifierHeader(request: StarkHttpRequest<P>): StarkHttpRequest<P> {
		return super.addCorrelationIdentifierHeader(request);
	}
}
/* tslint:enable */
