import { StarkUserRepository } from "./user.repository.intf";
import { DEFAULT_USER_PROFILE_RESOURCE_PATH, StarkUserRepositoryImpl } from "./user.repository";
import { MockStarkHttpService } from "../../http/testing";
import { StarkBackend, StarkBackendImpl, StarkHttpRequestType, StarkSingleItemResponseWrapper } from "../../http/entities";
import { MockStarkLoggingService } from "../../logging/testing";
import { StarkApplicationConfig, StarkApplicationConfigImpl } from "../../../configuration";
import { Observer, of } from "rxjs";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("StarkUserRepository", () => {
	let userRepository: StarkUserRepository;
	let mockHttpService: MockStarkHttpService<any>;
	const mockLoggingService = new MockStarkLoggingService();
	let mockAppConfig: StarkApplicationConfig;
	let mockObserver: SpyObj<Observer<any>>;
	const userProfileBackend: StarkBackend = {
		name: "userProfile",
		url: "http://localhost:5000",
		authenticationType: 1,
		devAuthenticationEnabled: true,
		devAuthenticationRolePrefix: ""
	};

	describe("on initialization", () => {
		it("should throw an error in case there are no backends defined in the STARK_APP_CONFIG", () => {
			const appConfigNoBackends = new StarkApplicationConfigImpl();

			expect(() => new StarkUserRepositoryImpl(mockHttpService, mockLoggingService, appConfigNoBackends)).toThrowError(
				/backends.*map should not be empty/
			);
		});

		it("should throw an error in case any of the backends defined in the STARK_APP_CONFIG is invalid", () => {
			const invalidBackend = new StarkBackendImpl();
			const appConfigInvalidBackends = new StarkApplicationConfigImpl();
			appConfigInvalidBackends.backends.set("someBackend", invalidBackend);

			expect(() => new StarkUserRepositoryImpl(mockHttpService, mockLoggingService, appConfigInvalidBackends)).toThrowError(
				/name|url|authentication type/g
			);
		});

		it("should throw an error in case there is no 'userProfile' backend defined in the STARK_APP_CONFIG", () => {
			const appConfigNoUserProfileBackend = new StarkApplicationConfigImpl();
			appConfigNoUserProfileBackend.addBackend({
				name: "someBackend",
				url: "http://localhost:8888",
				authenticationType: 1,
				devAuthenticationEnabled: true,
				devAuthenticationRolePrefix: ""
			});

			expect(() => new StarkUserRepositoryImpl(mockHttpService, mockLoggingService, appConfigNoUserProfileBackend)).toThrowError(
				/userProfile.*undefined/
			);
		});
	});

	describe("getUser", () => {
		beforeEach(() => {
			mockHttpService = new MockStarkHttpService();
			mockAppConfig = new StarkApplicationConfigImpl();
			mockAppConfig.addBackend(userProfileBackend);

			userRepository = new StarkUserRepositoryImpl(mockHttpService, mockLoggingService, mockAppConfig);

			mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
		});

		it("should trigger a HTTP GET request targeting the 'userProfile' backend from STARK_APP_CONFIG via the StarkHttpService to fetch the user", () => {
			const dummySuccessResponse: StarkSingleItemResponseWrapper<any> = {
				data: "success",
				starkHttpStatusCode: 200,
				starkHttpHeaders: new Map()
			};

			mockHttpService.executeSingleItemRequest.and.returnValue(of(dummySuccessResponse));

			userRepository.getUser().subscribe(mockObserver);

			expect(mockHttpService.executeCollectionRequest).not.toHaveBeenCalled();
			expect(mockHttpService.executeSingleItemRequest).toHaveBeenCalledTimes(1);
			const httpRequest = mockHttpService.executeSingleItemRequest.calls.argsFor(0)[0];
			expect(httpRequest.requestType).toBe(StarkHttpRequestType.GET);
			expect(httpRequest.backend).toBe(userProfileBackend);
			expect(httpRequest.queryParameters).toEqual(new Map([["style", "full-details"]]));
			expect(httpRequest.retryCount).toBe(5);

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(dummySuccessResponse);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).toHaveBeenCalled();
		});

		it("should trigger the HTTP request using the resource path defined in the STARK_USER_PROFILE_RESOURCE_PATH or the default path in case it is undefined", () => {
			let starkUserProfileResourcePath: string | undefined;
			userRepository = new StarkUserRepositoryImpl(mockHttpService, mockLoggingService, mockAppConfig, starkUserProfileResourcePath);

			const dummySuccessResponse: StarkSingleItemResponseWrapper<any> = {
				data: "success",
				starkHttpStatusCode: 200,
				starkHttpHeaders: new Map()
			};

			mockHttpService.executeSingleItemRequest.and.returnValue(of(dummySuccessResponse));

			userRepository.getUser().subscribe(mockObserver);

			expect(mockHttpService.executeCollectionRequest).not.toHaveBeenCalled();
			expect(mockHttpService.executeSingleItemRequest).toHaveBeenCalledTimes(1);
			let httpRequest = mockHttpService.executeSingleItemRequest.calls.argsFor(0)[0];
			expect(httpRequest.resourcePath).toBe(DEFAULT_USER_PROFILE_RESOURCE_PATH);

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(dummySuccessResponse);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).toHaveBeenCalled();

			mockObserver.next.calls.reset();
			mockObserver.complete.calls.reset();
			mockHttpService.executeSingleItemRequest.calls.reset();

			starkUserProfileResourcePath = "dummy-resource-path";
			userRepository = new StarkUserRepositoryImpl(mockHttpService, mockLoggingService, mockAppConfig, starkUserProfileResourcePath);

			userRepository.getUser().subscribe(mockObserver);

			expect(mockHttpService.executeCollectionRequest).not.toHaveBeenCalled();
			expect(mockHttpService.executeSingleItemRequest).toHaveBeenCalledTimes(1);
			httpRequest = mockHttpService.executeSingleItemRequest.calls.argsFor(0)[0];
			expect(httpRequest.resourcePath).toBe(starkUserProfileResourcePath);
			expect(httpRequest.resourcePath).not.toBe(DEFAULT_USER_PROFILE_RESOURCE_PATH);

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(dummySuccessResponse);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).toHaveBeenCalled();
		});
	});
});
