import { serialize, serializeAs } from "cerialize";
import {
	StarkHttpCreateRequestBuilderImpl,
	StarkHttpDeleteRequestBuilderImpl,
	StarkHttpGetCollectionRequestBuilderImpl,
	StarkHttpGetRequestBuilderImpl,
	StarkHttpRequestBuilderImpl,
	StarkHttpSearchRequestBuilderImpl,
	StarkHttpUpdateRequestBuilderImpl
} from "./http-request-builder";
import { StarkHttpRequestBuilder } from "./http-request-builder.intf";
import { StarkHttpCreateRequestBuilder } from "./http-create-request-builder.intf";
import { StarkHttpDeleteRequestBuilder } from "./http-delete-request-builder.intf";
import { StarkHttpGetRequestBuilder } from "./http-get-request-builder.intf";
import { StarkHttpGetCollectionRequestBuilder } from "./http-get-collection-request-builder.intf";
import { StarkHttpSearchRequestBuilder } from "./http-search-request-builder.intf";
import { StarkHttpUpdateRequestBuilder } from "./http-update-request-builder.intf";
import {
	StarkBackend,
	StarkBackendImpl,
	StarkHttpRequest,
	StarkHttpRequestType,
	StarkResource,
	StarkSortItemImpl
} from "../entities/index";
import { StarkLanguages } from "../../configuration/entities/index";
import { stringMap } from "../../serialization/index";
import { StarkHttpEchoType, StarkHttpHeaders, StarkHttpQueryParameters, StarkSortOrder } from "../constants/index";
import { StarkHttpSerializer, StarkHttpSerializerImpl } from "../serializer/index";
import { StarkHttpRequestParams } from "./http-request-parameters.intf";

const deepFreeze: Function = require("deep-freeze-strict");

const resourcePath: string = "/something/:somethingId/else/:elseId/next";
const resourceUuid: string = "dummyUUID";
const mockDate: Date = new Date();
const mockFrozenPathParamsWithoutUUID: StarkHttpRequestParams = deepFreeze({
	pathParameters: { someId: "1234" }
});

describe("Builder: StarkHttpRequestBuilder", () => {
	const resourceEtag: string = "123456789";

	let mockBackend: StarkBackend;
	let requestBuilder: StarkHttpRequestBuilder<MockResource>;
	let mockResource: StarkResource;

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockResource = new MockResource(resourceUuid);
		mockResource.etag = resourceEtag;
	});

	describe("on create", () => {
		it("should return an instance of the StarkHttpCreateRequestBuilder", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const createRequestBuilder: StarkHttpCreateRequestBuilder<MockResource> = requestBuilder.create(
				mockResource,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3", invalidParam: <any>undefined },
					queryParameters: {
						param1: "one",
						duplicateParam: ["dup1", "dup2", "dup3"],
						invalidQueryParam1: "",
						invalidQueryParam2: undefined
					},
					retryCount: 5
				})
			);
			expect(createRequestBuilder instanceof StarkHttpCreateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = createRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("duplicateParam")).toEqual(["dup1", "dup2", "dup3"]);
			expect(request.requestType).toBe(StarkHttpRequestType.CREATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBe(5);
			expect(request.serializer).toBe(defaultSerializer);
		});

		it("should set the query parameters including those with undefined value (allowUndefinedQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const createRequestBuilder: StarkHttpCreateRequestBuilder<MockResource> = requestBuilder.create(
				mockResource,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: "", forceValidParam: undefined },
					allowUndefinedQueryParams: true
				})
			);

			const request: StarkHttpRequest = createRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmptyQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const createRequestBuilder: StarkHttpCreateRequestBuilder<MockResource> = requestBuilder.create(
				mockResource,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: undefined, forceValidParam: "" },
					allowEmptyQueryParams: true
				})
			);

			const request: StarkHttpRequest = createRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should use a new serializer with the custom type provided in 'serializationType' param when no custom serializer is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const createRequestBuilder: StarkHttpCreateRequestBuilder<MockResource> = requestBuilder.create(
				mockResource,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(createRequestBuilder instanceof StarkHttpCreateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = createRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.CREATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toEqual(new StarkHttpSerializerImpl(MockCustomResource));
		});

		it("should use the custom serializer if it is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, customSerializer);

			const createRequestBuilder: StarkHttpCreateRequestBuilder<MockResource> = requestBuilder.create(
				mockResource,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" }
				})
			);
			expect(createRequestBuilder instanceof StarkHttpCreateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = createRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.CREATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});

		it("should use the custom serializer if it is defined regardless of the custom type set in 'serializationType' param", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, customSerializer);

			const createRequestBuilder: StarkHttpCreateRequestBuilder<MockResource> = requestBuilder.create(
				mockResource,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(createRequestBuilder instanceof StarkHttpCreateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = createRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.CREATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});
	});

	describe("on update", () => {
		it("should return an instance of the StarkHttpUpdateRequestBuilder", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3", invalidParam: <any>undefined },
					queryParameters: {
						param1: "one",
						duplicateParam: ["dup1", "dup2", "dup3"],
						invalidQueryParam1: "",
						invalidQueryParam2: undefined
					},
					retryCount: 5
				})
			);
			expect(updateRequestBuilder instanceof StarkHttpUpdateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("duplicateParam")).toEqual(["dup1", "dup2", "dup3"]);
			expect(request.requestType).toBe(StarkHttpRequestType.UPDATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBe(5);
			expect(request.serializer).toBe(defaultSerializer);
		});

		it("should have requestType 'UPDATE_IDEMPOTENT' if isIdempotent param is set to TRUE", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				deepFreeze({ isIdempotent: true })
			);
			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.requestType).toBe(StarkHttpRequestType.UPDATE_IDEMPOTENT);
		});

		it("should set the query parameters including those with undefined value (allowUndefinedQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: "", forceValidParam: undefined },
					allowUndefinedQueryParams: true
				})
			);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmptyQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: undefined, forceValidParam: "" },
					allowEmptyQueryParams: true
				})
			);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the resource uuid to the end of the resourcePath if there are no placeholders for pathParams defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(mockResource);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid);
		});

		it("should set the resource uuid in the right place if it is defined and the resourcePath contains a placeholder for it", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(mockResource);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else");
		});

		it("should add the resource uuid if it is defined but there is no placeholder for it in the resourcePath", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				mockFrozenPathParamsWithoutUUID
			);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/1234/else/" + mockResource.uuid);
		});

		it("should not add the resource uuid if it is undefined and there is no placeholder for it in the resourcePath", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else", defaultSerializer);
			mockResource.uuid = <any>undefined;

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				mockFrozenPathParamsWithoutUUID
			);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/1234/else");
		});

		it("should throw an error if the resourcePath contains a placeholder for the resource uuid but this is undefined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else/:uuid", defaultSerializer);
			mockResource.uuid = <any>undefined;

			expect(() => requestBuilder.update(mockResource, mockFrozenPathParamsWithoutUUID)).toThrowError(
				/resource uuid value is undefined/
			);
		});

		it("should use a new serializer with the custom type provided in 'serializationType' param when no custom serializer is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(updateRequestBuilder instanceof StarkHttpUpdateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.UPDATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toEqual(new StarkHttpSerializerImpl(MockCustomResource));
		});

		it("should use the custom serializer if it is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", customSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3" }
				})
			);
			expect(updateRequestBuilder instanceof StarkHttpUpdateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.UPDATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});

		it("should use the custom serializer if it is defined regardless of the custom type set in 'serializationType' param", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", customSerializer);

			const updateRequestBuilder: StarkHttpUpdateRequestBuilder<MockResource> = requestBuilder.update(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(updateRequestBuilder instanceof StarkHttpUpdateRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = updateRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.UPDATE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});
	});

	describe("on delete", () => {
		it("should return an instance of the StarkHttpDeleteRequestBuilder", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3", invalidParam: <any>undefined },
					queryParameters: {
						param1: "one",
						duplicateParam: ["dup1", "dup2", "dup3"],
						invalidQueryParam1: "",
						invalidQueryParam2: undefined
					},
					retryCount: 5
				})
			);
			expect(deleteRequestBuilder instanceof StarkHttpDeleteRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("duplicateParam")).toEqual(["dup1", "dup2", "dup3"]);
			expect(request.requestType).toBe(StarkHttpRequestType.DELETE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBe(5);
			expect(request.serializer).toBe(defaultSerializer);
		});

		it("should not set the If-Match header if the force parameter is set to TRUE", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({ force: true })
			);
			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBeUndefined();
		});

		it("should set the If-Match header if the force parameter is not set", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(mockResource);
			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
		});

		it("should set the If-Match header if the force parameter is set to FALSE", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({ force: false })
			);
			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
		});

		it("should set the query parameters including those with undefined value (allowUndefinedQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: "", forceValidParam: undefined },
					allowUndefinedQueryParams: true
				})
			);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmptyQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({
					queryParameters: { param1: "one", invalidParam: undefined, forceValidParam: "" },
					allowEmptyQueryParams: true
				})
			);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the resource uuid to the end of the resourcePath if there are no placeholders for pathParams defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(mockResource);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid);
		});

		it("should set the resource uuid in the right place if it is defined and the resourcePath contains a placeholder for it", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(mockResource);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else");
		});

		it("should add the resource uuid if it is defined but there is no placeholder for it in the resourcePath", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				mockFrozenPathParamsWithoutUUID
			);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/1234/else/" + mockResource.uuid);
		});

		it("should not add the resource uuid if it is undefined and there is no placeholder for it in the resourcePath", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else", defaultSerializer);
			mockResource.uuid = <any>undefined;

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				mockFrozenPathParamsWithoutUUID
			);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/1234/else");
		});

		it("should throw an error if the resourcePath contains a placeholder for the resource uuid but this is undefined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else/:uuid", defaultSerializer);
			mockResource.uuid = <any>undefined;

			expect(() => requestBuilder.delete(mockResource, mockFrozenPathParamsWithoutUUID)).toThrowError(
				/resource uuid value is undefined/
			);
		});

		it("should use a new serializer with the custom type provided in 'serializationType' param when no custom serializer is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(deleteRequestBuilder instanceof StarkHttpDeleteRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.DELETE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toEqual(new StarkHttpSerializerImpl(MockCustomResource));
		});

		it("should use the custom serializer if it is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", customSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3" }
				})
			);
			expect(deleteRequestBuilder instanceof StarkHttpDeleteRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.DELETE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});

		it("should use the custom serializer if it is defined regardless of the custom type set in 'serializationType' param", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", customSerializer);

			const deleteRequestBuilder: StarkHttpDeleteRequestBuilder<MockResource> = requestBuilder.delete(
				mockResource,
				deepFreeze({
					pathParameters: { elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(deleteRequestBuilder instanceof StarkHttpDeleteRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = deleteRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + mockResource.uuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.IF_MATCH)).toBe(resourceEtag);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.DELETE);
			expect(request.item).toBe(mockResource);
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});
	});

	describe("on get", () => {
		it("should return an instance of the StarkHttpGetRequestBuilder", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);
			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				resourceUuid,
				deepFreeze({
					pathParameters: { elseId: "3", invalidParam: <any>undefined },
					queryParameters: {
						param1: "one",
						duplicateParam: ["dup1", "dup2", "dup3"],
						invalidQueryParam1: "",
						invalidQueryParam2: undefined
					},
					retryCount: 5
				})
			);
			expect(getRequestBuilder instanceof StarkHttpGetRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + resourceUuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("duplicateParam")).toEqual(["dup1", "dup2", "dup3"]);
			expect(request.requestType).toBe(StarkHttpRequestType.GET);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBe(5);
			expect(request.serializer).toBe(defaultSerializer);
		});

		it("should set the query parameters including those with undefined value (allowUndefinedQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				resourceUuid,
				deepFreeze({
					pathParameters: { elseId: "3" },
					queryParameters: { param1: "one", invalidQueryParam: "", forceValidParam: undefined },
					allowUndefinedQueryParams: true
				})
			);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmptyQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				resourceUuid,
				deepFreeze({
					pathParameters: { elseId: "3" },
					queryParameters: { param1: "one", invalidQueryParam: undefined, forceValidParam: "" },
					allowEmptyQueryParams: true
				})
			);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the resource uuid to the end of the resourcePath if there are no placeholders for pathParams defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something", defaultSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(resourceUuid);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/" + resourceUuid);
		});

		it("should set the resource uuid in the right place if it is defined and the resourcePath contains a placeholder for it", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else", defaultSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(resourceUuid);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/" + resourceUuid + "/else");
		});

		it("should add the resource uuid if it is defined but there is no placeholder for it in the resourcePath", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else", defaultSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				resourceUuid,
				mockFrozenPathParamsWithoutUUID
			);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/1234/else/" + resourceUuid);
		});

		it("should not add the resource uuid if it is undefined and there is no placeholder for it in the resourcePath", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else", defaultSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				<any>undefined,
				mockFrozenPathParamsWithoutUUID
			);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.resourcePath).toBe("/something/1234/else");
		});

		it("should throw an error if the resourcePath contains a placeholder for the resource uuid but this is undefined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:someId/else/:uuid", defaultSerializer);

			expect(() => requestBuilder.get(<any>undefined, mockFrozenPathParamsWithoutUUID)).toThrowError(
				/resource uuid value is undefined/
			);
		});

		it("should use a new serializer with the custom type provided in 'serializationType' param when no custom serializer is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", defaultSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				resourceUuid,
				deepFreeze({
					pathParameters: { elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(getRequestBuilder instanceof StarkHttpGetRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + resourceUuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.GET);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toEqual(new StarkHttpSerializerImpl(MockCustomResource));
		});

		it("should use the custom serializer if it is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", customSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				resourceUuid,
				deepFreeze({
					pathParameters: { elseId: "3" }
				})
			);
			expect(getRequestBuilder instanceof StarkHttpGetRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + resourceUuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.GET);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});

		it("should use the custom serializer if it is defined regardless of the custom type set in 'serializationType' param", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, "/something/:uuid/else/:elseId/next", customSerializer);

			const getRequestBuilder: StarkHttpGetRequestBuilder<MockResource> = requestBuilder.get(
				resourceUuid,
				deepFreeze({
					pathParameters: { elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(getRequestBuilder instanceof StarkHttpGetRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/" + resourceUuid + "/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(0);
			expect(request.requestType).toBe(StarkHttpRequestType.GET);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});
	});

	describe("on get collection", () => {
		it("should return an instance of the StarkHttpGetCollectionRequestBuilder", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const getCollectionRequestBuilder: StarkHttpGetCollectionRequestBuilder<MockResource> = requestBuilder.getCollection(
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3", invalidParam: <any>undefined },
					queryParameters: {
						param1: "one",
						duplicateParam: ["dup1", "dup2", "dup3"],
						invalidQueryParam1: "",
						invalidQueryParam2: undefined
					},
					retryCount: 5
				})
			);
			expect(getCollectionRequestBuilder instanceof StarkHttpGetCollectionRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getCollectionRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(5);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("duplicateParam")).toEqual(["dup1", "dup2", "dup3"]);
			expect(request.requestType).toBe(StarkHttpRequestType.GET_COLLECTION);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBe(5);
			expect(request.serializer).toBe(defaultSerializer);
		});

		it("should set the query parameters including those with undefined value (allowUndefinedQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const getCollectionRequestBuilder: StarkHttpGetCollectionRequestBuilder<MockResource> = requestBuilder.getCollection(
				3,
				5,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: "", forceValidParam: undefined },
					allowUndefinedQueryParams: true
				})
			);

			const request: StarkHttpRequest = getCollectionRequestBuilder.build();
			expect(request.queryParameters.size).toBe(5);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmptyQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const getCollectionRequestBuilder: StarkHttpGetCollectionRequestBuilder<MockResource> = requestBuilder.getCollection(
				3,
				5,
				deepFreeze({
					queryParameters: { param1: "one", invalidParam: undefined, forceValidParam: "" },
					allowEmptyQueryParams: true
				})
			);

			const request: StarkHttpRequest = getCollectionRequestBuilder.build();
			expect(request.queryParameters.size).toBe(5);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should use a new serializer with the custom type provided in 'serializationType' param when no custom serializer is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const getCollectionRequestBuilder: StarkHttpGetCollectionRequestBuilder<MockResource> = requestBuilder.getCollection(
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(getCollectionRequestBuilder instanceof StarkHttpGetCollectionRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getCollectionRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.requestType).toBe(StarkHttpRequestType.GET_COLLECTION);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toEqual(new StarkHttpSerializerImpl(MockCustomResource));
		});

		it("should use the custom serializer if it is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, customSerializer);

			const getCollectionRequestBuilder: StarkHttpGetCollectionRequestBuilder<MockResource> = requestBuilder.getCollection(
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" }
				})
			);
			expect(getCollectionRequestBuilder instanceof StarkHttpGetCollectionRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getCollectionRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.requestType).toBe(StarkHttpRequestType.GET_COLLECTION);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});

		it("should use the custom serializer if it is defined regardless of the custom type set in 'serializationType' param", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, customSerializer);

			const getCollectionRequestBuilder: StarkHttpGetCollectionRequestBuilder<MockResource> = requestBuilder.getCollection(
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(getCollectionRequestBuilder instanceof StarkHttpGetCollectionRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = getCollectionRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.requestType).toBe(StarkHttpRequestType.GET_COLLECTION);
			expect(request.item).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});
	});

	describe("on search", () => {
		let mockCriteria: { [key: string]: any };

		beforeEach(() => {
			mockCriteria = {
				field1: "anything",
				field2: {
					childField1: mockDate,
					childField2: {
						grandChildField1: ["someData", 123],
						anotherUndefinedField: undefined,
						anotherEmptyField: ""
					},
					someUndefinedField: undefined,
					someEmptyField: ""
				},
				undefinedField: undefined,
				emptyField: ""
			};
			mockBackend = new StarkBackendImpl();
			mockResource = new MockResource(resourceUuid);
			mockResource.etag = resourceEtag;
		});

		it("should return an instance of the StarkHttpSearchRequestBuilder", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteria,
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3", invalidParam: <any>undefined },
					queryParameters: {
						param1: "one",
						duplicateParam: ["dup1", "dup2", "dup3"],
						invalidQueryParam1: "",
						invalidQueryParam2: undefined
					},
					retryCount: 5
				})
			);
			expect(searchRequestBuilder instanceof StarkHttpSearchRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(5);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("duplicateParam")).toEqual(["dup1", "dup2", "dup3"]);
			expect(request.queryParameters.has("invalidParam")).toBe(false);
			expect(request.requestType).toBe(StarkHttpRequestType.SEARCH);
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).not.toBe(mockCriteria);
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate.toISOString());
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.anotherUndefinedField).toBeNull();
			expect(requestCriteria.field2.childField2.anotherEmptyField).toBeUndefined();
			expect(requestCriteria.field2.someUndefinedField).toBeNull();
			expect(requestCriteria.field2.someEmptyField).toBeUndefined();
			expect(requestCriteria.undefinedField).toBeNull();
			expect(requestCriteria.emptyField).toBeUndefined();
			expect(request.retryCount).toBe(5);
			expect(request.serializer).toBe(defaultSerializer);
		});

		it("should set the query parameters including those with undefined value (allowUndefinedQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteria,
				3,
				5,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: "", forceValidParam: undefined },
					allowUndefinedQueryParams: true
				})
			);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			expect(request.queryParameters.size).toBe(5);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmptyQueryParams = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteria,
				3,
				5,
				deepFreeze({
					queryParameters: { param1: "one", invalidQueryParam: undefined, forceValidParam: "" },
					allowEmptyQueryParams: true
				})
			);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			expect(request.queryParameters.size).toBe(5);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should filter out those criteria with empty value (default allowEmptyCriteria = false)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(mockCriteria, 3, 5);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).not.toBe(mockCriteria);
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate.toISOString());
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.hasOwnProperty("anotherUndefinedField")).toBe(true);
			expect(requestCriteria.field2.childField2.anotherUndefinedField).toBeNull(); // due to Serialize => with undefined returns null
			expect(requestCriteria.field2.childField2.hasOwnProperty("anotherEmptyField")).toBe(false); // empty values are omitted
			expect(requestCriteria.field2.hasOwnProperty("someUndefinedField")).toBe(true);
			expect(requestCriteria.field2.someUndefinedField).toBeNull(); // due to Serialize => with undefined returns null
			expect(requestCriteria.field2.hasOwnProperty("someEmptyField")).toBe(false); // empty values are omitted
			expect(requestCriteria.hasOwnProperty("undefinedField")).toBe(true);
			expect(requestCriteria.undefinedField).toBeNull(); // due to Serialize => with undefined returns null
			expect(requestCriteria.hasOwnProperty("emptyField")).toBe(false); // empty values are omitted
		});

		it("should leave the criteria 'as is', even those with empty value (allowEmptyCriteria = true)", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteria,
				3,
				5,
				deepFreeze({
					allowEmptyCriteria: true
				})
			);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).toBe(mockCriteria); // the criteria object remains unchanged
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate);
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.hasOwnProperty("anotherUndefinedField")).toBe(true); // undefined values remain unchanged
			expect(requestCriteria.field2.childField2.anotherUndefinedField).toBeUndefined();
			expect(requestCriteria.field2.childField2.anotherEmptyField).toBe("");
			expect(requestCriteria.field2.hasOwnProperty("someUndefinedField")).toBe(true); // undefined values remain unchanged
			expect(requestCriteria.field2.someUndefinedField).toBeUndefined();
			expect(requestCriteria.field2.someEmptyField).toBe("");
			expect(requestCriteria.hasOwnProperty("undefinedField")).toBe(true); // undefined values remain unchanged
			expect(requestCriteria.undefinedField).toBeUndefined();
			expect(requestCriteria.emptyField).toBe("");
		});

		it("should serialize the criteria instance and filter out those criteria with empty value (default allowEmptyCriteria = false)", () => {
			const mockCriteriaInstance: MockCriteria = new MockCriteria();
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(mockCriteriaInstance, 3, 5);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).not.toBe(mockCriteriaInstance);
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate.toISOString());
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.hasOwnProperty("anotherUndefinedField")).toBe(false); // Serialize omits undefined class props
			expect(requestCriteria.field2.childField2.hasOwnProperty("anotherEmptyField")).toBe(false); // empty values are omitted
			expect(requestCriteria.field2.childField3).toBeDefined();
			expect(requestCriteria.field2.childField3 instanceof Object).toBe(true); // Map objects are serialized into simple objects
			expect(requestCriteria.field2.childField3.grandChildField1).toBe("whatever");
			expect(requestCriteria.field2.childField3.hasOwnProperty("anotherUndefinedField")).toBe(true); // object property (not class property)
			expect(requestCriteria.field2.childField3.anotherUndefinedField).toBeNull(); // due to Serialize => with undefined returns null
			expect(requestCriteria.field2.childField3.hasOwnProperty("anotherEmptyField")).toBe(false); // empty values are omitted
			expect(requestCriteria.field2.hasOwnProperty("someUndefinedField")).toBe(false); // Serialize omits undefined class properties
			expect(requestCriteria.field2.hasOwnProperty("someEmptyField")).toBe(false); // empty values are omitted
			expect(requestCriteria.hasOwnProperty("undefinedField")).toBe(false); // Serialize omits undefined class properties
			expect(requestCriteria.hasOwnProperty("emptyField")).toBe(false); // empty values are omitted
		});

		it("should leave the criteria instance 'as is' and include also those criteria with empty value (allowEmptyCriteria = true)", () => {
			const mockCriteriaInstance: MockCriteria = new MockCriteria();
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteriaInstance,
				3,
				5,
				deepFreeze({
					allowEmptyCriteria: true
				})
			);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).toBe(mockCriteriaInstance); // the criteria instance remains unchanged
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate);
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.hasOwnProperty("anotherUndefinedField")).toBe(true); // undefined values remain unchanged
			expect(requestCriteria.field2.childField2.anotherUndefinedField).toBeUndefined();
			expect(requestCriteria.field2.childField2.anotherEmptyField).toBe("");
			expect(requestCriteria.field2.childField3).toBeDefined();
			expect(requestCriteria.field2.childField3 instanceof Map).toBe(true); // Map objects remain unchanged
			expect(requestCriteria.field2.childField3.get("grandChildField1")).toBe("whatever");
			expect(requestCriteria.field2.childField3.has("anotherUndefinedField")).toBe(true);
			expect(requestCriteria.field2.childField3.get("anotherUndefinedField")).toBeUndefined();
			expect(requestCriteria.field2.childField3.get("anotherEmptyField")).toBe("");
			expect(requestCriteria.field2.hasOwnProperty("someUndefinedField")).toBe(true); // undefined values remain unchanged
			expect(requestCriteria.field2.someUndefinedField).toBeUndefined();
			expect(requestCriteria.field2.someEmptyField).toBe("");
			expect(requestCriteria.hasOwnProperty("undefinedField")).toBe(true); // undefined values remain unchanged
			expect(requestCriteria.undefinedField).toBeUndefined();
			expect(requestCriteria.emptyField).toBe("");
		});

		it("should use a new serializer with the custom type provided in 'serializationType' param when no custom serializer is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, defaultSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteria,
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(searchRequestBuilder instanceof StarkHttpSearchRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.requestType).toBe(StarkHttpRequestType.SEARCH);
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).not.toBe(mockCriteria);
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate.toISOString());
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.anotherUndefinedField).toBeNull();
			expect(requestCriteria.field2.childField2.anotherEmptyField).toBeUndefined();
			expect(requestCriteria.field2.someUndefinedField).toBeNull();
			expect(requestCriteria.field2.someEmptyField).toBeUndefined();
			expect(requestCriteria.undefinedField).toBeNull();
			expect(requestCriteria.emptyField).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toEqual(new StarkHttpSerializerImpl(MockCustomResource));
		});

		it("should use the custom serializer if it is defined", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, customSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteria,
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" }
				})
			);
			expect(searchRequestBuilder instanceof StarkHttpSearchRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.requestType).toBe(StarkHttpRequestType.SEARCH);
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).not.toBe(mockCriteria);
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate.toISOString());
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.anotherUndefinedField).toBeNull();
			expect(requestCriteria.field2.childField2.anotherEmptyField).toBeUndefined();
			expect(requestCriteria.field2.someUndefinedField).toBeNull();
			expect(requestCriteria.field2.someEmptyField).toBeUndefined();
			expect(requestCriteria.undefinedField).toBeNull();
			expect(requestCriteria.emptyField).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});

		it("should use the custom serializer if it is defined regardless of the custom type set in 'serializationType' param", () => {
			requestBuilder = new StarkHttpRequestBuilderImpl(mockBackend, resourcePath, customSerializer);

			const searchRequestBuilder: StarkHttpSearchRequestBuilder<MockResource> = requestBuilder.search(
				mockCriteria,
				3,
				5,
				deepFreeze({
					pathParameters: { somethingId: "1", elseId: "3" },
					serializationType: MockCustomResource
				})
			);
			expect(searchRequestBuilder instanceof StarkHttpSearchRequestBuilderImpl).toBe(true);

			const request: StarkHttpRequest = searchRequestBuilder.build();
			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe("/something/1/else/3/next");
			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(0);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("limit")).toBe("3");
			expect(request.queryParameters.get("offset")).toBe("5");
			expect(request.queryParameters.get("mockCollectionRequest")).toBe("true"); // added only in DEV
			expect(request.requestType).toBe(StarkHttpRequestType.SEARCH);
			const requestCriteria: { [key: string]: any } = <{ [key: string]: any }>request.item;
			expect(requestCriteria).not.toBe(mockCriteria);
			expect(requestCriteria.field1).toBe("anything");
			expect(requestCriteria.field2).toBeDefined();
			expect(requestCriteria.field2.childField1).toBe(mockDate.toISOString());
			expect(requestCriteria.field2.childField2).toBeDefined();
			expect(requestCriteria.field2.childField2.grandChildField1).toEqual(["someData", 123]);
			expect(requestCriteria.field2.childField2.anotherUndefinedField).toBeNull();
			expect(requestCriteria.field2.childField2.anotherEmptyField).toBeUndefined();
			expect(requestCriteria.field2.someUndefinedField).toBeNull();
			expect(requestCriteria.field2.someEmptyField).toBeUndefined();
			expect(requestCriteria.undefinedField).toBeNull();
			expect(requestCriteria.emptyField).toBeUndefined();
			expect(request.retryCount).toBeUndefined();
			expect(request.serializer).not.toBe(defaultSerializer);
			expect(request.serializer).toBe(customSerializer);
		});
	});
});

describe("Builder: StarkHttpCreateRequestBuilder", () => {
	let builder: StarkHttpCreateRequestBuilder<MockResource>;
	let mockBackend: StarkBackend;
	let mockResource: StarkResource;
	let mockRequest: StarkHttpRequest;

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockResource = new MockResource(resourceUuid);
		mockRequest = {
			backend: mockBackend,
			resourcePath: resourcePath,
			headers: new Map<string, string>(),
			queryParameters: new Map<string, string>(),
			requestType: StarkHttpRequestType.CREATE,
			item: mockResource,
			serializer: defaultSerializer
		};

		builder = new StarkHttpCreateRequestBuilderImpl(mockRequest);
	});

	describe("on echo", () => {
		it("should set the query parameter echo with the value passed", () => {
			builder.echo(StarkHttpEchoType.NONE);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("NONE");
		});

		it("should set the query parameter echo with the value passed and override the previous one", () => {
			builder.echo(StarkHttpEchoType.NONE);
			builder.echo(StarkHttpEchoType.ID);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});
	});

	describe("on setHeader", () => {
		it("should add the header name/value only if the value is defined", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader("invalidHeader", <any>undefined);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
		});

		it("should add the header name/value and add it to existing ones", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader(StarkHttpHeaders.ACCEPT_LANGUAGE, StarkLanguages.EN_US.isoCode);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(2);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
		});
	});

	describe("on addQueryParameter", () => {
		it("should add the query parameter name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("invalidParam1", undefined);
			builder.addQueryParameter("invalidParam2", "");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", "", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameter name/value and add it to existing ones", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("include", "name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("include")).toBe("name");
		});
	});

	describe("on addQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value WITHOUT removing the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.addQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.setQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value and remove the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.setQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setPathParameters", () => {
		it("should interpolate the resourcePath with the params provided", () => {
			builder.setPathParameters({ somethingId: "1", elseId: "5" });

			const request: StarkHttpRequest = builder.build();
			expect(request.resourcePath).toEqual("/something/1/else/5/next");
		});
	});

	describe("on retry", () => {
		it("should add the retryCount option to the request", () => {
			builder.retry(4);

			const request: StarkHttpRequest = builder.build();
			expect(request.retryCount).toBe(4);
		});
	});

	describe("on build", () => {
		it("should return the created StarkHttpRequest", () => {
			const request: StarkHttpRequest = builder.build();

			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe(resourcePath);
			expect(request.headers).toBeDefined();
			expect(request.queryParameters).toBeDefined();
			expect(request.requestType).toBe(StarkHttpRequestType.CREATE);
			expect(request.item).toBe(mockResource);
		});
	});
});

describe("Builder: StarkHttpDeleteRequestBuilder", () => {
	let builder: StarkHttpDeleteRequestBuilder<MockResource>;
	let mockBackend: StarkBackend;
	let mockResource: StarkResource;
	let mockRequest: StarkHttpRequest;

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockResource = new MockResource(resourceUuid);
		mockRequest = {
			backend: mockBackend,
			resourcePath: resourcePath,
			headers: new Map<string, string>(),
			queryParameters: new Map<string, string>(),
			requestType: StarkHttpRequestType.DELETE,
			item: mockResource,
			serializer: defaultSerializer
		};

		builder = new StarkHttpDeleteRequestBuilderImpl(mockRequest);
	});

	describe("on setHeader", () => {
		it("should add the header name/value only if the value is defined", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader("invalidHeader", <any>undefined);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
		});

		it("should add the header name/value and add it to existing ones", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader(StarkHttpHeaders.ACCEPT_LANGUAGE, StarkLanguages.EN_US.isoCode);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(2);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
		});
	});

	describe("on addQueryParameter", () => {
		it("should add the query parameter name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("invalidParam1", undefined);
			builder.addQueryParameter("invalidParam2", "");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", "", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameter name/value and add it to existing ones", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("include", "name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("include")).toBe("name");
		});
	});

	describe("on addQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value WITHOUT removing the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.addQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.setQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value and remove the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.setQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setPathParameters", () => {
		it("should interpolate the resourcePath with the params provided", () => {
			builder.setPathParameters({ somethingId: "1", elseId: "5" });

			const request: StarkHttpRequest = builder.build();
			expect(request.resourcePath).toEqual("/something/1/else/5/next");
		});
	});

	describe("on retry", () => {
		it("should add the retryCount option to the request", () => {
			builder.retry(4);

			const request: StarkHttpRequest = builder.build();
			expect(request.retryCount).toBe(4);
		});
	});

	describe("on build", () => {
		it("should return the created StarkHttpRequest", () => {
			const request: StarkHttpRequest = builder.build();

			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe(resourcePath);
			expect(request.headers).toBeDefined();
			expect(request.queryParameters).toBeDefined();
			expect(request.requestType).toBe(StarkHttpRequestType.DELETE);
			expect(request.item).toBe(mockResource);
		});
	});
});

describe("Builder: StarkHttpUpdateRequestBuilder", () => {
	let builder: StarkHttpUpdateRequestBuilder<MockResource>;
	let mockBackend: StarkBackend;
	let mockResource: StarkResource;
	let mockRequest: StarkHttpRequest;

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockResource = new MockResource(resourceUuid);
		mockRequest = {
			backend: mockBackend,
			resourcePath: resourcePath,
			headers: new Map<string, string>(),
			queryParameters: new Map<string, string>(),
			requestType: StarkHttpRequestType.UPDATE,
			item: mockResource,
			serializer: defaultSerializer
		};

		builder = new StarkHttpUpdateRequestBuilderImpl(mockRequest);
	});

	describe("on setHeader", () => {
		it("should add the header name/value only if the value is defined", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader("invalidHeader", <any>undefined);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
		});

		it("should add the header name/value and add it to existing ones", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader(StarkHttpHeaders.ACCEPT_LANGUAGE, StarkLanguages.EN_US.isoCode);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(2);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
		});
	});

	describe("on addQueryParameter", () => {
		it("should add the query parameter name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("invalidParam1", undefined);
			builder.addQueryParameter("invalidParam2", "");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", "", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameter name/value and add it to existing ones", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("include", "name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("include")).toBe("name");
		});
	});

	describe("on addQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value WITHOUT removing the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.addQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.setQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value and remove the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.setQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setPathParameters", () => {
		it("should interpolate the resourcePath with the params provided", () => {
			builder.setPathParameters({ somethingId: "1", elseId: "5" });

			const request: StarkHttpRequest = builder.build();
			expect(request.resourcePath).toEqual("/something/1/else/5/next");
		});
	});

	describe("on retry", () => {
		it("should add the retryCount option to the request", () => {
			builder.retry(4);

			const request: StarkHttpRequest = builder.build();
			expect(request.retryCount).toBe(4);
		});
	});

	describe("on build", () => {
		it("should return the created StarkHttpRequest", () => {
			const request: StarkHttpRequest = builder.build();

			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe(resourcePath);
			expect(request.headers).toBeDefined();
			expect(request.queryParameters).toBeDefined();
			expect(request.requestType).toBe(StarkHttpRequestType.UPDATE);
			expect(request.item).toBe(mockResource);
		});
	});
});

describe("Builder: StarkHttpGetRequestBuilder", () => {
	let builder: StarkHttpGetRequestBuilderImpl<MockResource>;
	let mockBackend: StarkBackend;
	let mockRequest: StarkHttpRequest;

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockRequest = {
			backend: mockBackend,
			resourcePath: resourcePath,
			headers: new Map<string, string>(),
			queryParameters: new Map<string, string>(),
			requestType: StarkHttpRequestType.GET,
			item: { uuid: resourceUuid },
			serializer: defaultSerializer
		};

		builder = new StarkHttpGetRequestBuilderImpl(mockRequest);
	});

	describe("on setHeader", () => {
		it("should add the header name/value only if the value is defined", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader("invalidHeader", <any>undefined);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
		});

		it("should add the header name/value and add it to existing ones", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader(StarkHttpHeaders.ACCEPT_LANGUAGE, StarkLanguages.EN_US.isoCode);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(2);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
		});
	});

	describe("on addQueryParameter", () => {
		it("should add the query parameter name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("invalidParam1", undefined);
			builder.addQueryParameter("invalidParam2", "");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", "", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameter name/value and add it to existing ones", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("include", "name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("include")).toBe("name");
		});
	});

	describe("on addQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value WITHOUT removing the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.addQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.setQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value and remove the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.setQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on addAcceptedLanguage", () => {
		it("should add the accepted language to the headers and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.EN_US);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(StarkLanguages.EN_US.isoCode);
		});

		it("should add the accepted languages to the headers and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.EN_US, StarkLanguages.FR_BE, StarkLanguages.NL_BE);

			const expectedLanguages: string = [
				StarkLanguages.EN_US.isoCode,
				StarkLanguages.FR_BE.isoCode,
				StarkLanguages.NL_BE.isoCode
			].join(",");
			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(expectedLanguages);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(expectedLanguages);
		});

		it("should add the accepted languages to the ones that already exist and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.NL_BE);

			let request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.NL_BE.isoCode);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(StarkLanguages.NL_BE.isoCode);

			const expectedLanguages: string = [
				StarkLanguages.NL_BE.isoCode,
				StarkLanguages.EN_US.isoCode,
				StarkLanguages.FR_BE.isoCode
			].join(",");

			builder.addAcceptedLanguage(StarkLanguages.EN_US, StarkLanguages.FR_BE);
			request = builder.build();

			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(expectedLanguages);
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(expectedLanguages);
		});
	});

	describe("on addFilterByInclude", () => {
		it("should add an entry in the fields query parameter", () => {
			builder.addFilterByInclude("name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name");
		});

		it("should add an entry in the fields query parameter for every field in the array", () => {
			builder.addFilterByInclude("name", "postalCode");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name,postalCode");
		});

		it("should add an entry in the fields query parameter without removing the current ones", () => {
			builder.addFilterByInclude("name");
			builder.addFilterByInclude("postalCode");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name,postalCode");
		});
	});

	describe("on addFilterByStyle", () => {
		it("should set the style query parameter", () => {
			builder.addFilterByStyle("COMPACT");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.STYLE)).toBe("COMPACT");
		});

		it("should set the style query parameter overriding previous values", () => {
			builder.addFilterByStyle("FULL");
			builder.addFilterByStyle("COMPACT");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.STYLE)).toBe("COMPACT");
		});
	});

	describe("on addSortBy", () => {
		it("should add a sort query parameter", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC));

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe("name+" + StarkSortOrder.ASC);
		});

		it("should add a sort query parameter with all the values", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC), new StarkSortItemImpl("postalCode", StarkSortOrder.DESC));

			const expectedSort: string = "name+" + StarkSortOrder.ASC + ",postalCode+" + StarkSortOrder.DESC;
			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe(expectedSort);
		});

		it("should add a sort query parameter without removing previous values", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC));
			builder.addSortBy(new StarkSortItemImpl("postalCode", StarkSortOrder.DESC));

			const expectedSort: string = "name+" + StarkSortOrder.ASC + ",postalCode+" + StarkSortOrder.DESC;
			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe(expectedSort);
		});
	});

	describe("on setPathParameters", () => {
		it("should interpolate the resourcePath with the params provided", () => {
			builder.setPathParameters({ somethingId: "1", elseId: "5" });

			const request: StarkHttpRequest = builder.build();
			expect(request.resourcePath).toEqual("/something/1/else/5/next");
		});
	});

	describe("on retry", () => {
		it("should add the retryCount option to the request", () => {
			builder.retry(4);

			const request: StarkHttpRequest = builder.build();
			expect(request.retryCount).toBe(4);
		});
	});

	describe("on build", () => {
		it("should return the created StarkHttpRequest", () => {
			const request: StarkHttpRequest = builder.build();

			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe(resourcePath);
			expect(request.headers).toBeDefined();
			expect(request.queryParameters).toBeDefined();
			expect(request.requestType).toBe(StarkHttpRequestType.GET);
			expect(request.item).toBeDefined();
			expect((<StarkResource>request.item).uuid).toBe(resourceUuid);
		});
	});
});

describe("Builder: StarkHttpGetCollectionRequestBuilder", () => {
	let builder: StarkHttpGetCollectionRequestBuilder<MockResource>;
	let mockBackend: StarkBackend;
	let mockRequest: StarkHttpRequest;

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockRequest = {
			backend: mockBackend,
			resourcePath: resourcePath,
			headers: new Map<string, string>(),
			queryParameters: new Map<string, string>(),
			requestType: StarkHttpRequestType.GET_COLLECTION,
			item: { uuid: resourceUuid },
			serializer: defaultSerializer
		};

		builder = new StarkHttpGetCollectionRequestBuilderImpl(mockRequest);
	});

	describe("on setHeader", () => {
		it("should add the header name/value only if the value is defined", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader("invalidHeader", <any>undefined);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
		});

		it("should add the header name/value and add it to existing ones", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader(StarkHttpHeaders.ACCEPT_LANGUAGE, StarkLanguages.EN_US.isoCode);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(2);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
		});
	});

	describe("on addQueryParameter", () => {
		it("should add the query parameter name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("invalidParam1", undefined);
			builder.addQueryParameter("invalidParam2", "");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", "", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameter name/value and add it to existing ones", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("include", "name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("include")).toBe("name");
		});
	});

	describe("on addQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value WITHOUT removing the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.addQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.setQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value and remove the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.setQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on addAcceptedLanguage", () => {
		it("should add the accepted language to the headers and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.EN_US);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(StarkLanguages.EN_US.isoCode);
		});

		it("should add the accepted languages to the headers and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.EN_US, StarkLanguages.FR_BE, StarkLanguages.NL_BE);

			const expectedLanguages: string = [
				StarkLanguages.EN_US.isoCode,
				StarkLanguages.FR_BE.isoCode,
				StarkLanguages.NL_BE.isoCode
			].join(",");
			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(expectedLanguages);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(expectedLanguages);
		});

		it("should add the accepted languages to the ones that already exist and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.NL_BE);

			let request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.NL_BE.isoCode);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(StarkLanguages.NL_BE.isoCode);

			const expectedLanguages: string = [
				StarkLanguages.NL_BE.isoCode,
				StarkLanguages.EN_US.isoCode,
				StarkLanguages.FR_BE.isoCode
			].join(",");

			builder.addAcceptedLanguage(StarkLanguages.EN_US, StarkLanguages.FR_BE);
			request = builder.build();

			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(expectedLanguages);
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(expectedLanguages);
		});
	});

	describe("on addFilterByInclude", () => {
		it("should add an entry in the fields query parameter", () => {
			builder.addFilterByInclude("name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name");
		});

		it("should add an entry in the fields query parameter for every field in the array", () => {
			builder.addFilterByInclude("name", "postalCode");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name,postalCode");
		});

		it("should add an entry in the fields query parameter without removing the current ones", () => {
			builder.addFilterByInclude("name");
			builder.addFilterByInclude("postalCode");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name,postalCode");
		});
	});

	describe("on addFilterByStyle", () => {
		it("should set the style query parameter", () => {
			builder.addFilterByStyle("COMPACT");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.STYLE)).toBe("COMPACT");
		});

		it("should set the style query parameter overriding previous values", () => {
			builder.addFilterByStyle("FULL");
			builder.addFilterByStyle("COMPACT");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.STYLE)).toBe("COMPACT");
		});
	});

	describe("on addSortBy", () => {
		it("should add a sort query parameter", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC));

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe("name+" + StarkSortOrder.ASC);
		});

		it("should add a sort query parameter with all the values", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC), new StarkSortItemImpl("postalCode", StarkSortOrder.DESC));

			const expectedSort: string = "name+" + StarkSortOrder.ASC + ",postalCode+" + StarkSortOrder.DESC;
			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe(expectedSort);
		});

		it("should add a sort query parameter without removing previous values", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC));
			builder.addSortBy(new StarkSortItemImpl("postalCode", StarkSortOrder.DESC));

			const expectedSort: string = "name+" + StarkSortOrder.ASC + ",postalCode+" + StarkSortOrder.DESC;
			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe(expectedSort);
		});
	});

	describe("on setPathParameters", () => {
		it("should interpolate the resourcePath with the params provided", () => {
			builder.setPathParameters({ somethingId: "1", elseId: "5" });

			const request: StarkHttpRequest = builder.build();
			expect(request.resourcePath).toEqual("/something/1/else/5/next");
		});
	});

	describe("on retry", () => {
		it("should add the retryCount option to the request", () => {
			builder.retry(4);

			const request: StarkHttpRequest = builder.build();
			expect(request.retryCount).toBe(4);
		});
	});

	describe("on build", () => {
		it("should return the created StarkHttpRequest", () => {
			const request: StarkHttpRequest = builder.build();

			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe(resourcePath);
			expect(request.headers).toBeDefined();
			expect(request.queryParameters).toBeDefined();
			expect(request.requestType).toBe(StarkHttpRequestType.GET_COLLECTION);
			expect(request.item).toBeDefined();
			expect((<StarkResource>request.item).uuid).toBe(resourceUuid);
		});
	});
});

describe("Builder: StarkHttpSearchRequestBuilder", () => {
	let builder: StarkHttpSearchRequestBuilder<MockResource>;
	let mockBackend: StarkBackend;
	let mockRequest: StarkHttpRequest;
	const mockCriteria: { [key: string]: any } = { field1: "anything", field2: "whatever" };

	beforeEach(() => {
		mockBackend = new StarkBackendImpl();
		mockRequest = {
			backend: mockBackend,
			resourcePath: resourcePath,
			headers: new Map<string, string>(),
			queryParameters: new Map<string, string>(),
			requestType: StarkHttpRequestType.SEARCH,
			item: mockCriteria,
			serializer: defaultSerializer
		};

		builder = new StarkHttpSearchRequestBuilderImpl(mockRequest);
	});

	describe("on setHeader", () => {
		it("should add the header name/value only if the value is defined", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader("invalidHeader", <any>undefined);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
		});

		it("should add the header name/value and add it to existing ones", () => {
			builder.setHeader(StarkHttpHeaders.CONTENT_TYPE, "application/json");
			builder.setHeader(StarkHttpHeaders.ACCEPT_LANGUAGE, StarkLanguages.EN_US.isoCode);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(2);
			expect(request.headers.get(StarkHttpHeaders.CONTENT_TYPE)).toBe("application/json");
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
		});
	});

	describe("on addQueryParameter", () => {
		it("should add the query parameter name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("invalidParam1", undefined);
			builder.addQueryParameter("invalidParam2", "");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("forceValidParam", "", undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameter name/value and add it to existing ones", () => {
			builder.addQueryParameter("echo", "ID");
			builder.addQueryParameter("include", "name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("include")).toBe("name");
		});
	});

	describe("on addQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.addQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.addQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value WITHOUT removing the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.addQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(3);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on setQueryParameters", () => {
		it("should add the query parameters name/value except those with undefined or empty value (default)", () => {
			builder.setQueryParameters({ echo: "ID", invalidParam1: undefined, invalidParam2: "" });

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");
		});

		it("should add the query parameter name/value including those with undefined value (allowUndefined = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: undefined }, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBeUndefined();
		});

		it("should set the query parameters including those with empty value (allowEmpty = true)", () => {
			builder.setQueryParameters({ echo: "ID", forceValidParam: "" }, undefined, true);

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("echo")).toBe("ID");
			expect(request.queryParameters.has("forceValidParam")).toBe(true);
			expect(request.queryParameters.get("forceValidParam")).toBe("");
		});

		it("should add the query parameters name/value and remove the existing ones", () => {
			builder.addQueryParameter("echo", "ID");

			let request: StarkHttpRequest = builder.build();

			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get("echo")).toBe("ID");

			builder.setQueryParameters({ param1: "one", param2: "two" });

			request = builder.build();

			expect(request.queryParameters.size).toBe(2);
			expect(request.queryParameters.get("param1")).toBe("one");
			expect(request.queryParameters.get("param2")).toBe("two");
		});
	});

	describe("on addAcceptedLanguage", () => {
		it("should add the accepted language to the headers and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.EN_US);

			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.EN_US.isoCode);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(StarkLanguages.EN_US.isoCode);
		});

		it("should add the accepted languages to the headers and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.EN_US, StarkLanguages.FR_BE, StarkLanguages.NL_BE);

			const expectedLanguages: string = [
				StarkLanguages.EN_US.isoCode,
				StarkLanguages.FR_BE.isoCode,
				StarkLanguages.NL_BE.isoCode
			].join(",");
			const request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(expectedLanguages);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(expectedLanguages);
		});

		it("should add the accepted languages to the ones that already exist and the lang param to the query parameters", () => {
			builder.addAcceptedLanguage(StarkLanguages.NL_BE);

			let request: StarkHttpRequest = builder.build();

			expect(request.headers).toBeDefined();
			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(StarkLanguages.NL_BE.isoCode);
			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(StarkLanguages.NL_BE.isoCode);

			const expectedLanguages: string = [
				StarkLanguages.NL_BE.isoCode,
				StarkLanguages.EN_US.isoCode,
				StarkLanguages.FR_BE.isoCode
			].join(",");

			builder.addAcceptedLanguage(StarkLanguages.EN_US, StarkLanguages.FR_BE);
			request = builder.build();

			expect(request.headers.size).toBe(1);
			expect(request.headers.get(StarkHttpHeaders.ACCEPT_LANGUAGE)).toBe(expectedLanguages);
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.LANG)).toBe(expectedLanguages);
		});
	});

	describe("on addFilterByInclude", () => {
		it("should add an entry in the fields query parameter", () => {
			builder.addFilterByInclude("name");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name");
		});

		it("should add an entry in the fields query parameter for every field in the array", () => {
			builder.addFilterByInclude("name", "postalCode");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name,postalCode");
		});

		it("should add an entry in the fields query parameter without removing the current ones", () => {
			builder.addFilterByInclude("name");
			builder.addFilterByInclude("postalCode");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.FIELDS)).toBe("name,postalCode");
		});
	});

	describe("on addFilterByStyle", () => {
		it("should set the style query parameter", () => {
			builder.addFilterByStyle("COMPACT");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.STYLE)).toBe("COMPACT");
		});

		it("should set the style query parameter overriding previous values", () => {
			builder.addFilterByStyle("FULL");
			builder.addFilterByStyle("COMPACT");

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.STYLE)).toBe("COMPACT");
		});
	});

	describe("on addSortBy", () => {
		it("should add a sort query parameter", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC));

			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe("name+" + StarkSortOrder.ASC);
		});

		it("should add a sort query parameter with all the values", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC), new StarkSortItemImpl("postalCode", StarkSortOrder.DESC));

			const expectedSort: string = "name+" + StarkSortOrder.ASC + ",postalCode+" + StarkSortOrder.DESC;
			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe(expectedSort);
		});

		it("should add a sort query parameter without removing previous values", () => {
			builder.addSortBy(new StarkSortItemImpl("name", StarkSortOrder.ASC));
			builder.addSortBy(new StarkSortItemImpl("postalCode", StarkSortOrder.DESC));

			const expectedSort: string = "name+" + StarkSortOrder.ASC + ",postalCode+" + StarkSortOrder.DESC;
			const request: StarkHttpRequest = builder.build();

			expect(request.queryParameters).toBeDefined();
			expect(request.queryParameters.size).toBe(1);
			expect(request.queryParameters.get(StarkHttpQueryParameters.SORT)).toBe(expectedSort);
		});
	});

	describe("on setPathParameters", () => {
		it("should interpolate the resourcePath with the params provided", () => {
			builder.setPathParameters({ somethingId: "1", elseId: "5" });

			const request: StarkHttpRequest = builder.build();
			expect(request.resourcePath).toEqual("/something/1/else/5/next");
		});
	});

	describe("on retry", () => {
		it("should add the retryCount option to the request", () => {
			builder.retry(4);

			const request: StarkHttpRequest = builder.build();
			expect(request.retryCount).toBe(4);
		});
	});

	describe("on build", () => {
		it("should return the created StarkHttpRequest", () => {
			const request: StarkHttpRequest = builder.build();

			expect(request.backend).toBe(mockBackend);
			expect(request.resourcePath).toBe(resourcePath);
			expect(request.headers).toBeDefined();
			expect(request.queryParameters).toBeDefined();
			expect(request.requestType).toBe(StarkHttpRequestType.SEARCH);
			expect(request.item).toBe(mockCriteria); // the search criteria comes in the request item
		});
	});
});

class MockResource implements StarkResource {
	public uuid: string;

	public constructor(uuid: string) {
		this.uuid = uuid;
	}
}

class MockCustomResource implements StarkResource {
	public uuid: string;
	public name: string;

	public constructor(uuid: string, name: string) {
		this.uuid = uuid;
		this.name = name;
	}
}

const defaultSerializer: StarkHttpSerializer<MockResource> = new StarkHttpSerializerImpl<MockResource>(MockResource);

class CustomSerializer implements StarkHttpSerializer<any> {
	public serialize(resource: any): string {
		return JSON.stringify(resource);
	}

	public deserialize(raw: string): any {
		return JSON.parse(raw);
	}
}

const customSerializer: StarkHttpSerializer<MockResource> = new CustomSerializer();

class MockCriteriaChildDetail {
	@serialize public grandChildField1: (string | number)[];
	@serialize public anotherUndefinedField: undefined;
	@serialize public anotherEmptyField: string;

	public constructor() {
		this.grandChildField1 = ["someData", 123];
		this.anotherUndefinedField = undefined;
		this.anotherEmptyField = "";
	}
}

class MockCriteriaDetail {
	@serialize public childField1: Date;
	@serializeAs(MockCriteriaChildDetail) public childField2: MockCriteriaChildDetail;
	@serializeAs(stringMap())
	public childField3: Map<string, any>;
	@serialize public someUndefinedField: undefined;
	@serialize public someEmptyField: string;

	public constructor() {
		this.childField1 = mockDate;
		this.childField2 = new MockCriteriaChildDetail();
		this.childField3 = new Map<string, any>();
		this.childField3.set("grandChildField1", "whatever");
		this.childField3.set("anotherUndefinedField", undefined);
		this.childField3.set("anotherEmptyField", "");
		this.someUndefinedField = undefined;
		this.someEmptyField = "";
	}
}

class MockCriteria {
	@serialize public field1: string;
	@serializeAs(MockCriteriaDetail) public field2: MockCriteriaDetail;
	@serialize public undefinedField: undefined;
	@serialize public emptyField: string;

	public constructor() {
		this.field1 = "anything";
		this.field2 = new MockCriteriaDetail();
		this.undefinedField = undefined;
		this.emptyField = "";
	}
}
