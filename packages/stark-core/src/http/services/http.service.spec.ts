"use strict";

import createSpyObj = jasmine.createSpyObj;
import Spy = jasmine.Spy;
import { autoserialize, autoserializeAs, inheritSerialization, Serialize } from "cerialize";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

import { StarkHttpServiceImpl } from "./http.service";
import {
	StarkBackend,
	StarkBackendImpl,
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
	StarkResource,
	StarkSingleItemMetadataImpl,
	StarkSingleItemResponseWrapper,
	StarkSortItemImpl
} from "../entities/index";

import { StarkHttpHeaders, StarkSortOrder } from "../constants/index";
import { StarkHttpStatusCodes } from "../enumerators/index";
import { StarkLoggingService } from "../../logging/index";
import { UnitTestingUtils } from "../../test/unit-testing/index";
import { StarkHttpSerializer, StarkHttpSerializerImpl } from "../serializer/index";
import { StarkSessionService } from "../../session/index";

describe("Service: StarkHttpService", () => {
	let loggerMock: StarkLoggingService;
	let mockSessionService: StarkSessionService;
	let httpMock: HttpClient;
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
	const mockHttpErrorsCount: number = 3;
	const mockHttpDetailErrorType: string = "https://api.demo.nbb.be/v1/errors/user-invalid";
	const mockHttpDetailErrorTitle: string = "Invalid user information";
	const mockHttpErrorDetail1: string = "The username is already in use";
	const mockHttpErrorDetail2: string = "The user's name is missing";
	const mockHttpErrorDetailFieldCount: number = 2;
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
		loggerMock = UnitTestingUtils.getMockedLoggingService(mockCorrelationId);
		mockSessionService = UnitTestingUtils.getMockedSessionService();
		httpMock = createSpyObj("HttpClient", ["get", "put", "post", "delete"]);

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
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBe(mockUuid);
						expect(result.data.etag).toBe(mockEtag);
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata).toBeUndefined();

						expect(httpMock.get).toHaveBeenCalledTimes(1);
						expect(httpMock.get).toHaveBeenCalledWith("www.awesomeapi.com/mock", {
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
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBe(mockUuid);
						expect(result.data.etag).toBe(mockEtag);
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						const metadataWarnings: StarkHttpErrorDetail[] = <StarkHttpErrorDetail[]>result.data.metadata.warnings;
						expect(metadataWarnings.length).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings).length);

						metadataWarnings.forEach((warning: StarkHttpErrorDetail, index: number) => {
							expect(warning.type).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].type);
							expect(warning.title).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].title);
							expect(warning.titleKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].titleKey);
							expect(warning.detail).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detail);
							expect(warning.detailKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detailKey);
							expect(warning.fields).toEqual((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].fields);
							expect(warning.instance).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].instance);
						});

						expect(result.data.metadata.someValue).toBe(mockResourceMetadata.someValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.throw(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.type).toBe(mockHttpErrorType);
						expect(errorWrapper.httpError.title).toBe(mockHttpErrorTitle);
						expect(errorWrapper.httpError.instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.httpError.errors[0] instanceof StarkHttpErrorDetailImpl).toBe(true);
						expect(errorWrapper.httpError.errors[0].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[0].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[0].detail).toBe(mockHttpErrorDetail1);
						expect(errorWrapper.httpError.errors[0].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[1].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[1].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[1].detail).toBe(mockHttpErrorDetail2);
						expect((<string[]>errorWrapper.httpError.errors[1].fields).length).toBe(mockHttpErrorDetailFieldCount);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[0]).toBe(mockHttpErrorDetailField1);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[1]).toBe(mockHttpErrorDetailField2);
						expect(errorWrapper.httpError.errors[1].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[2].detail).toBe(mockHttpErrorDetail3);
						expect(errorWrapper.httpError.errors[2].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorWrapper.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(errorWrapper.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(errorWrapper.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.get).toHaveBeenCalledTimes(1);
						expect(httpMock.get).toHaveBeenCalledWith("www.awesomeapi.com/mock", {
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
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				(<Spy>httpMock.get).and.returnValue(
					Observable.throw(httpResponse).catch((err: any) => {
						errorCounter++;
						return Observable.throw(err);
					})
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
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
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
				(<Spy>httpMock.delete).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						expect(result.data).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.delete).toHaveBeenCalledTimes(1);
						expect(httpMock.delete).toHaveBeenCalledWith("www.awesomeapi.com/mock", {
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
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.delete).and.returnValue(Observable.throw(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.type).toBe(mockHttpErrorType);
						expect(errorWrapper.httpError.title).toBe(mockHttpErrorTitle);
						expect(errorWrapper.httpError.instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.httpError.errors[0] instanceof StarkHttpErrorDetailImpl).toBe(true);
						expect(errorWrapper.httpError.errors[0].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[0].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[0].detail).toBe(mockHttpErrorDetail1);
						expect(errorWrapper.httpError.errors[0].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[1].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[1].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[1].detail).toBe(mockHttpErrorDetail2);
						expect((<string[]>errorWrapper.httpError.errors[1].fields).length).toBe(mockHttpErrorDetailFieldCount);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[0]).toBe(mockHttpErrorDetailField1);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[1]).toBe(mockHttpErrorDetailField2);
						expect(errorWrapper.httpError.errors[1].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[2].detail).toBe(mockHttpErrorDetail3);
						expect(errorWrapper.httpError.errors[2].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorWrapper.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(errorWrapper.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(errorWrapper.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.delete).toHaveBeenCalledTimes(1);
						expect(httpMock.delete).toHaveBeenCalledWith("www.awesomeapi.com/mock", {
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
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				(<Spy>httpMock.delete).and.returnValue(
					Observable.throw(httpResponse).catch((err: any) => {
						errorCounter++;
						return Observable.throw(err);
					})
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
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
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
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe((result: StarkSingleItemResponseWrapper<MockResource>) => {
					expect(result).toBeDefined();
				});

				expect(httpMock.post).toHaveBeenCalledWith(
					"www.awesomeapi.com/mock",
					request.serializer.serialize(mockResourceWithoutEtag), // etag is removed from the item sent due to NG-1361
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					}
				);
			});

			it("on POST SUCCESS ('UPDATE'), should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_204_NO_CONTENT,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBe(mockUuid);
						expect(result.data.etag).toBe(mockEtag);
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.post).toHaveBeenCalledTimes(1);
						expect(httpMock.post).toHaveBeenCalledWith(
							"www.awesomeapi.com/mock",
							request.serializer.serialize(mockResourceWithoutEtag),
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							}
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
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBe(mockUuid);
						expect(result.data.etag).toBe(mockEtag);
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						const metadataWarnings: StarkHttpErrorDetail[] = <StarkHttpErrorDetail[]>result.data.metadata.warnings;
						expect(metadataWarnings.length).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings).length);

						metadataWarnings.forEach((warning: StarkHttpErrorDetail, index: number) => {
							expect(warning.type).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].type);
							expect(warning.title).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].title);
							expect(warning.titleKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].titleKey);
							expect(warning.detail).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detail);
							expect(warning.detailKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detailKey);
							expect(warning.fields).toEqual((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].fields);
							expect(warning.instance).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].instance);
						});

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
				(<Spy>httpMock.put).and.returnValue(Observable.of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE_IDEMPOTENT;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBe(mockUuid);
						expect(result.data.etag).toBe(mockEtag);
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.put).toHaveBeenCalledTimes(1);
						expect(httpMock.put).toHaveBeenCalledWith(
							"www.awesomeapi.com/mock",
							request.serializer.serialize(mockResourceWithoutEtag),
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							}
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
				(<Spy>httpMock.put).and.returnValue(Observable.of(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE_IDEMPOTENT;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_204_NO_CONTENT);
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBe(mockUuid);
						expect(result.data.etag).toBe(mockEtag);
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						const metadataWarnings: StarkHttpErrorDetail[] = <StarkHttpErrorDetail[]>result.data.metadata.warnings;
						expect(metadataWarnings.length).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings).length);

						metadataWarnings.forEach((warning: StarkHttpErrorDetail, index: number) => {
							expect(warning.type).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].type);
							expect(warning.title).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].title);
							expect(warning.titleKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].titleKey);
							expect(warning.detail).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detail);
							expect(warning.detailKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detailKey);
							expect(warning.fields).toEqual((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].fields);
							expect(warning.instance).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].instance);
						});

						expect(result.data.metadata.someValue).toBe(mockResourceMetadata.someValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on POST FAILURE ('UPDATE'), should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.throw(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.type).toBe(mockHttpErrorType);
						expect(errorWrapper.httpError.title).toBe(mockHttpErrorTitle);
						expect(errorWrapper.httpError.instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.httpError.errors[0] instanceof StarkHttpErrorDetailImpl).toBe(true);
						expect(errorWrapper.httpError.errors[0].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[0].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[0].detail).toBe(mockHttpErrorDetail1);
						expect(errorWrapper.httpError.errors[0].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[1].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[1].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[1].detail).toBe(mockHttpErrorDetail2);
						expect((<string[]>errorWrapper.httpError.errors[1].fields).length).toBe(mockHttpErrorDetailFieldCount);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[0]).toBe(mockHttpErrorDetailField1);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[1]).toBe(mockHttpErrorDetailField2);
						expect(errorWrapper.httpError.errors[1].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[2].detail).toBe(mockHttpErrorDetail3);
						expect(errorWrapper.httpError.errors[2].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorWrapper.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(errorWrapper.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(errorWrapper.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.post).toHaveBeenCalledTimes(1);
						expect(httpMock.post).toHaveBeenCalledWith(
							"www.awesomeapi.com/mock",
							request.serializer.serialize(mockResourceWithoutEtag),
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							}
						);
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on POST FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				(<Spy>httpMock.post).and.returnValue(
					Observable.throw(httpResponse).catch((err: any) => {
						errorCounter++;
						return Observable.throw(err);
					})
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
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorCounter).toBe(1 + <number>request.retryCount); // error in original request + number of retries
						done();
					}
				);
			});

			it("on PUT FAILURE ('UPDATE_IDEMPOTENT'), should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.put).and.returnValue(Observable.throw(httpResponse));

				request.requestType = StarkHttpRequestType.UPDATE_IDEMPOTENT;

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.type).toBe(mockHttpErrorType);
						expect(errorWrapper.httpError.title).toBe(mockHttpErrorTitle);
						expect(errorWrapper.httpError.instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.httpError.errors[0] instanceof StarkHttpErrorDetailImpl).toBe(true);
						expect(errorWrapper.httpError.errors[0].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[0].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[0].detail).toBe(mockHttpErrorDetail1);
						expect(errorWrapper.httpError.errors[0].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[1].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[1].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[1].detail).toBe(mockHttpErrorDetail2);
						expect((<string[]>errorWrapper.httpError.errors[1].fields).length).toBe(mockHttpErrorDetailFieldCount);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[0]).toBe(mockHttpErrorDetailField1);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[1]).toBe(mockHttpErrorDetailField2);
						expect(errorWrapper.httpError.errors[1].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[2].detail).toBe(mockHttpErrorDetail3);
						expect(errorWrapper.httpError.errors[2].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorWrapper.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(errorWrapper.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(errorWrapper.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.put).toHaveBeenCalledTimes(1);
						expect(httpMock.put).toHaveBeenCalledWith(
							"www.awesomeapi.com/mock",
							request.serializer.serialize(mockResourceWithoutEtag),
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							}
						);
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on PUT FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				(<Spy>httpMock.put).and.returnValue(
					Observable.throw(httpResponse).catch((err: any) => {
						errorCounter++;
						return Observable.throw(err);
					})
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
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
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
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe((result: StarkSingleItemResponseWrapper<MockResource>) => {
					expect(result).toBeDefined();
				});

				expect(httpMock.post).toHaveBeenCalledWith(
					"www.awesomeapi.com/mock",
					request.serializer.serialize(mockResourceWithoutEtag), // etag is removed from the item sent due to NG-1361
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					}
				);
			});

			it("on SUCCESS, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: mockResourceWithEtag,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBeDefined();
						expect(result.data.etag).toBeDefined();
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);

				expect(httpMock.post).toHaveBeenCalledWith(
					"www.awesomeapi.com/mock",
					request.serializer.serialize(mockResourceWithoutEtag),
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					}
				);
			});

			it("on SUCCESS, should return the data including metadata (if any) and wrap it in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkResource>> = {
					status: StarkHttpStatusCodes.HTTP_200_OK,
					body: mockResourceWithMetadata,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkSingleItemResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
						expect(result.data instanceof MockResource).toBe(true);
						expect(result.data.uuid).toBeDefined();
						expect(result.data.etag).toBeDefined();
						expect(result.data.property1).toBe(mockProperty1);
						expect(result.data.property2).toBe(mockProperty2);
						expect(result.data.metadata instanceof MockResourceMetadata).toBe(true);

						const metadataWarnings: StarkHttpErrorDetail[] = <StarkHttpErrorDetail[]>result.data.metadata.warnings;
						expect(metadataWarnings.length).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings).length);

						metadataWarnings.forEach((warning: StarkHttpErrorDetail, index: number) => {
							expect(warning.type).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].type);
							expect(warning.title).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].title);
							expect(warning.titleKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].titleKey);
							expect(warning.detail).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detail);
							expect(warning.detailKey).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].detailKey);
							expect(warning.fields).toEqual((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].fields);
							expect(warning.instance).toBe((<StarkHttpErrorDetail[]>mockResourceMetadata.warnings)[index].instance);
						});

						expect(result.data.metadata.someValue).toBe(mockResourceMetadata.someValue);
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.throw(httpResponse));

				const resultObs: Observable<StarkSingleItemResponseWrapper<MockResource>> = starkHttpService.executeSingleItemRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.type).toBe(mockHttpErrorType);
						expect(errorWrapper.httpError.title).toBe(mockHttpErrorTitle);
						expect(errorWrapper.httpError.instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.httpError.errors[0] instanceof StarkHttpErrorDetailImpl).toBe(true);
						expect(errorWrapper.httpError.errors[0].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[0].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[0].detail).toBe(mockHttpErrorDetail1);
						expect(errorWrapper.httpError.errors[0].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[1].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[1].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[1].detail).toBe(mockHttpErrorDetail2);
						expect((<string[]>errorWrapper.httpError.errors[1].fields).length).toBe(mockHttpErrorDetailFieldCount);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[0]).toBe(mockHttpErrorDetailField1);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[1]).toBe(mockHttpErrorDetailField2);
						expect(errorWrapper.httpError.errors[1].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[2].detail).toBe(mockHttpErrorDetail3);
						expect(errorWrapper.httpError.errors[2].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorWrapper.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(errorWrapper.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(errorWrapper.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
					}
				);

				expect(httpMock.post).toHaveBeenCalledWith(
					"www.awesomeapi.com/mock",
					request.serializer.serialize(mockResourceWithoutEtag),
					{
						params: convertMapIntoObject(request.queryParameters),
						headers: convertMapIntoObject(headersMap),
						observe: "response",
						responseType: "json"
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				(<Spy>httpMock.post).and.returnValue(
					Observable.throw(httpResponse).catch((err: any) => {
						errorCounter++;
						return Observable.throw(err);
					})
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
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
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
				const result: Observable<any> = starkHttpService.executeSingleItemRequest(request);
				expect(result instanceof ErrorObservable).toBe(true);
				expect((<ErrorObservable>result).error).toContain("Unknown request type");
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags,
							warnings: mockWarnings
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBe(mockUuid);
						expect(result.data[0].property1).toBe(mockProperty1);
						expect(result.data[0].property2).toBe(mockProperty2);
						expect(result.data[0].etag).toBe(mockEtag);
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(1);
						expect(result.metadata.sortedBy[0] instanceof StarkSortItemImpl).toBe(true);
						expect(result.metadata.sortedBy[0].field).toBe("name");
						expect(result.metadata.sortedBy[0].order).toBe(StarkSortOrder.DESC);
						expect(result.metadata.sortedBy[0].sortValue).toBe("name" + "+" + StarkSortOrder.DESC);
						expect(result.metadata.pagination.currentPage).toBe(3);
						expect(result.metadata.pagination.limit).toBe(25);
						expect(result.metadata.pagination.offset).toBe(50);
						expect(result.metadata.pagination.previousOffset).toBe(25);
						expect(result.metadata.pagination.nextOffset).toBe(75);
						expect(result.metadata.pagination.pageCount).toBe(40);
						expect(result.metadata.pagination.totalCount).toBe(1000);
						expect(result.metadata.etags).toEqual(etags);

						const metadataWarnings: StarkHttpErrorDetail[] = <StarkHttpErrorDetail[]>result.metadata.warnings;
						expect(metadataWarnings.length).toBe(mockWarnings.length);

						metadataWarnings.forEach((warning: StarkHttpErrorDetail, index: number) => {
							expect(warning.type).toBe(mockWarnings[index].type);
							expect(warning.title).toBe(mockWarnings[index].title);
							expect(warning.titleKey).toBe(mockWarnings[index].titleKey);
							expect(warning.detail).toBe(mockWarnings[index].detail);
							expect(warning.detailKey).toBe(mockWarnings[index].detailKey);
							expect(warning.fields).toEqual(mockWarnings[index].fields);
							expect(warning.instance).toBe(mockWarnings[index].instance);
						});

						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
						expect(loggerMock.warn).not.toHaveBeenCalled();

						expect(httpMock.get).toHaveBeenCalledTimes(1);
						expect(httpMock.get).toHaveBeenCalledWith("www.awesomeapi.com/mock", {
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: <any>undefined
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeDefined();
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeUndefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeDefined();
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined(); // the data is whatever it comes in the "items" property
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

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
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeUndefined();
						expect(result.data[0].property1).toBe(mockProperty1);
						expect(result.data[0].property2).toBe(mockProperty2);
						expect(result.data[0].etag).toBe(mockEtag);
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags,
							custom: mockCustomMetadata
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBe(mockUuid);
						expect(result.data[0].property1).toBe(mockProperty1);
						expect(result.data[0].property2).toBe(mockProperty2);
						expect(result.data[0].etag).toBe(mockEtag);
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toEqual(mockCustomMetadata);
						expect(result.starkHttpHeaders.size).toBe(3);
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
				(<Spy>httpMock.get).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeDefined();
						expect(result.metadata).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'metadata'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.get).and.returnValue(Observable.throw(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.type).toBe(mockHttpErrorType);
						expect(errorWrapper.httpError.title).toBe(mockHttpErrorTitle);
						expect(errorWrapper.httpError.instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.httpError.errors[0] instanceof StarkHttpErrorDetailImpl).toBe(true);
						expect(errorWrapper.httpError.errors[0].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[0].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[0].detail).toBe(mockHttpErrorDetail1);
						expect(errorWrapper.httpError.errors[0].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[1].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[1].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[1].detail).toBe(mockHttpErrorDetail2);
						expect((<string[]>errorWrapper.httpError.errors[1].fields).length).toBe(mockHttpErrorDetailFieldCount);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[0]).toBe(mockHttpErrorDetailField1);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[1]).toBe(mockHttpErrorDetailField2);
						expect(errorWrapper.httpError.errors[1].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[2].detail).toBe(mockHttpErrorDetail3);
						expect(errorWrapper.httpError.errors[2].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorWrapper.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(errorWrapper.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(errorWrapper.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.get).toHaveBeenCalledTimes(1);
						expect(httpMock.get).toHaveBeenCalledWith("www.awesomeapi.com/mock", {
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
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				(<Spy>httpMock.get).and.returnValue(
					Observable.throw(httpResponse).catch((err: any) => {
						errorCounter++;
						return Observable.throw(err);
					})
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
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags,
							warnings: mockWarnings
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBe(mockUuid);
						expect(result.data[0].property1).toBe(mockProperty1);
						expect(result.data[0].property2).toBe(mockProperty2);
						expect(result.data[0].etag).toBe(mockEtag);
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(1);
						expect(result.metadata.sortedBy[0] instanceof StarkSortItemImpl).toBe(true);
						expect(result.metadata.sortedBy[0].field).toBe("name");
						expect(result.metadata.sortedBy[0].order).toBe(StarkSortOrder.DESC);
						expect(result.metadata.sortedBy[0].sortValue).toBe("name" + "+" + StarkSortOrder.DESC);
						expect(result.metadata.pagination.currentPage).toBe(3);
						expect(result.metadata.pagination.limit).toBe(25);
						expect(result.metadata.pagination.offset).toBe(50);
						expect(result.metadata.pagination.previousOffset).toBe(25);
						expect(result.metadata.pagination.nextOffset).toBe(75);
						expect(result.metadata.pagination.pageCount).toBe(40);
						expect(result.metadata.pagination.totalCount).toBe(1000);
						expect(result.metadata.etags).toEqual(etags);

						const metadataWarnings: StarkHttpErrorDetail[] = <StarkHttpErrorDetail[]>result.metadata.warnings;
						expect(metadataWarnings.length).toBe(mockWarnings.length);

						metadataWarnings.forEach((warning: StarkHttpErrorDetail, index: number) => {
							expect(warning.type).toBe(mockWarnings[index].type);
							expect(warning.title).toBe(mockWarnings[index].title);
							expect(warning.titleKey).toBe(mockWarnings[index].titleKey);
							expect(warning.detail).toBe(mockWarnings[index].detail);
							expect(warning.detailKey).toBe(mockWarnings[index].detailKey);
							expect(warning.fields).toEqual(mockWarnings[index].fields);
							expect(warning.instance).toBe(mockWarnings[index].instance);
						});

						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(result.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(result.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(result.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);
						expect(loggerMock.warn).not.toHaveBeenCalled();

						expect(httpMock.post).toHaveBeenCalledTimes(1);
						expect(httpMock.post).toHaveBeenCalledWith(
							"www.awesomeapi.com/mock",
							Serialize(mockCriteria), // the search criteria is sent in the request body payload
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							}
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: <any>undefined
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeDefined();
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeUndefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeDefined();
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined(); // the data is whatever it comes in the "items" property
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

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
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeUndefined();
						expect(result.data[0].property1).toBe(mockProperty1);
						expect(result.data[0].property2).toBe(mockProperty2);
						expect(result.data[0].etag).toBe(mockEtag);
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
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
							pagination: {
								limit: 25,
								offset: 50,
								previousOffset: 25,
								nextOffset: 75,
								currentPage: 3,
								pageCount: 40,
								totalCount: 1000
							},
							etags: etags,
							custom: mockCustomMetadata
						}
					},
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBe(mockUuid);
						expect(result.data[0].property1).toBe(mockProperty1);
						expect(result.data[0].property2).toBe(mockProperty2);
						expect(result.data[0].etag).toBe(mockEtag);
						expect(result.metadata instanceof StarkCollectionMetadataImpl).toBe(true);
						expect(result.metadata.sortedBy.length).toBe(0);
						expect(result.metadata.pagination).toBeDefined();
						expect(result.metadata.etags).toBeDefined();
						expect(result.metadata.warnings).toBeUndefined();
						expect(result.metadata.custom).toEqual(mockCustomMetadata);
						expect(result.starkHttpHeaders.size).toBe(3);
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
				(<Spy>httpMock.post).and.returnValue(Observable.of(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					(result: StarkCollectionResponseWrapper<MockResource>) => {
						expect(result).toBeDefined();
						expect(result.starkHttpStatusCode).toBe(StarkHttpStatusCodes.HTTP_200_OK);
						expect(result.data).toBeDefined();
						expect(result.data.length).toBe(1);
						expect(result.data[0] instanceof MockResource).toBe(true);
						expect(result.data[0].uuid).toBeDefined();
						expect(result.metadata).toBeUndefined();
						expect(result.starkHttpHeaders.size).toBe(3);
						expect(loggerMock.warn).toHaveBeenCalledTimes(1);
						expect((<Spy>loggerMock.warn).calls.argsFor(0)[0]).toContain("no 'metadata'");
					},
					() => {
						fail("The 'error' function should not be called in case of success");
					}
				);
			});

			it("on FAILURE, should wrap the returned data in an observable", () => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				(<Spy>httpMock.post).and.returnValue(Observable.throw(httpResponse));

				const resultObs: Observable<StarkCollectionResponseWrapper<MockResource>> = starkHttpService.executeCollectionRequest(
					request
				);

				resultObs.subscribe(
					() => {
						fail("The 'next' function should not be called in case of an http error");
					},
					(errorWrapper: StarkHttpErrorWrapper) => {
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.type).toBe(mockHttpErrorType);
						expect(errorWrapper.httpError.title).toBe(mockHttpErrorTitle);
						expect(errorWrapper.httpError.instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.httpError.errors[0] instanceof StarkHttpErrorDetailImpl).toBe(true);
						expect(errorWrapper.httpError.errors[0].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[0].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[0].detail).toBe(mockHttpErrorDetail1);
						expect(errorWrapper.httpError.errors[0].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[1].type).toBe(mockHttpDetailErrorType);
						expect(errorWrapper.httpError.errors[1].title).toBe(mockHttpDetailErrorTitle);
						expect(errorWrapper.httpError.errors[1].detail).toBe(mockHttpErrorDetail2);
						expect((<string[]>errorWrapper.httpError.errors[1].fields).length).toBe(mockHttpErrorDetailFieldCount);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[0]).toBe(mockHttpErrorDetailField1);
						expect((<string[]>errorWrapper.httpError.errors[1].fields)[1]).toBe(mockHttpErrorDetailField2);
						expect(errorWrapper.httpError.errors[1].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.httpError.errors[2].detail).toBe(mockHttpErrorDetail3);
						expect(errorWrapper.httpError.errors[2].instance).toBe(mockHttpErrorInstance);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
						expect(errorWrapper.starkHttpHeaders.get(contentTypeKey)).toBe(contentTypeValue);
						expect(errorWrapper.starkHttpHeaders.get(contentLengthKey)).toBe(contentLengthValue);
						expect(errorWrapper.starkHttpHeaders.get(expiresKey)).toBe(expiresValue);

						expect(httpMock.post).toHaveBeenCalledTimes(1);
						expect(httpMock.post).toHaveBeenCalledWith(
							"www.awesomeapi.com/mock",
							Serialize(mockCriteria), // the search criteria is sent in the request body payload
							{
								params: convertMapIntoObject(request.queryParameters),
								headers: convertMapIntoObject(headersMap),
								observe: "response",
								responseType: "json"
							}
						);
					}
				);
			});

			// this test is asynchronous due to the retry logic, so the test should be ended manually by calling the jasmine's done() function
			it("on FAILURE, should retry the request before emitting the failure if the request retryCount option is set", (done: DoneFn) => {
				const httpResponse: Partial<HttpResponse<StarkHttpError>> = {
					status: StarkHttpStatusCodes.HTTP_400_BAD_REQUEST,
					body: mockHttpError,
					headers: httpHeadersGetter(httpHeaders)
				};
				let errorCounter: number = 0;
				(<Spy>httpMock.post).and.returnValue(
					Observable.throw(httpResponse).catch((err: any) => {
						errorCounter++;
						return Observable.throw(err);
					})
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
						expect(errorWrapper).toBeDefined();
						expect(errorWrapper.httpError instanceof StarkHttpErrorImpl).toBe(true);
						expect(errorWrapper.httpError.errors).toBeDefined();
						expect(errorWrapper.httpError.errors.length).toBe(mockHttpErrorsCount);
						expect(errorWrapper.starkHttpHeaders.size).toBe(3);
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
				const result: Observable<any> = starkHttpService.executeCollectionRequest(request);
				expect(result instanceof ErrorObservable).toBe(true);
				expect((<ErrorObservable>result).error).toContain("Unknown request type");
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

function convertMapIntoObject(map: Map<string, any>): object {
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
