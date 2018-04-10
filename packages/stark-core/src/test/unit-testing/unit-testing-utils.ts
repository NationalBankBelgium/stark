"use strict";

import { StarkRoutingService, starkRoutingServiceName } from "../../routing/index";
import { StarkSessionService, starkSessionServiceName } from "../../session/index";
import { StarkHttpHeaders, StarkHttpService, starkHttpServiceName } from "../../http/index";

/**
 * Start unit testing utilities.
 */
export class UnitTestingUtils {
	/**
	 * Returns a new instance of a mocked StarkRoutingService. It should always return a new instance otherwise all the tests
	 * would share the same instance including all the customizations made to such instance, causing an unexpected behaviour
	 * and many tests to fail
	 */
	public static getMockedRoutingService(): StarkRoutingService {
		return jasmine.createSpyObj<StarkRoutingService>(starkRoutingServiceName, [
			"getCurrentState",
			"getCurrentStateName",
			"navigateTo",
			"navigateToHome",
			"navigateToPrevious",
			"reload",
			"getStatesConfig",
			"getCurrentStateConfig",
			"getCurrentStateParams",
			"isCurrentUiState",
			"getStateTreeParams",
			"getStateTreeResolves",
			"getStateTreeData",
			"addKnownNavigationRejectionCause",
			"addTransitionHook",
			"getTranslationKeyFromState",
			"getStateDeclarationByStateName"
		]);
	}
	
	/**
	 * Returns a new instance of a mocked StarkHttpService. It should always return a new instance otherwise all the tests
	 * would share the same instance including all the customizations made to such instance, causing an unexpected behaviour
	 * and many tests to fail
	 */
	public static getMockedHttpService(): StarkHttpService<any> {
		return jasmine.createSpyObj<StarkHttpService<any>>(starkHttpServiceName, ["executeSingleItemRequest", "executeCollectionRequest"]);
	}

	/**
	 * Returns a new instance of a mocked StarkSessionService. It should always return a new instance otherwise all the tests
	 * would share the same instance including all the customizations made to such instance, causing an unexpected behaviour
	 * and many tests to fail
	 */
	public static getMockedSessionService(fakePreAuthenticationHeaders?: Map<string, string>): StarkSessionService {
		let mockPreAuthenticationHeaders: Map<string, string>;

		if (!fakePreAuthenticationHeaders) {
			mockPreAuthenticationHeaders = new Map<string, string>();
			mockPreAuthenticationHeaders.set(StarkHttpHeaders.NBB_USER_NAME, "dummy username");
			mockPreAuthenticationHeaders.set(StarkHttpHeaders.NBB_FIRST_NAME, "dummy firstName");
			mockPreAuthenticationHeaders.set(StarkHttpHeaders.NBB_LAST_NAME, "dummy lastName");
			mockPreAuthenticationHeaders.set(StarkHttpHeaders.NBB_MAIL, "dummy email");
			mockPreAuthenticationHeaders.set(StarkHttpHeaders.NBB_LANGUAGE, "dummy language");
			mockPreAuthenticationHeaders.set(StarkHttpHeaders.NBB_DESCRIPTION, "dummy description");
			mockPreAuthenticationHeaders.set(StarkHttpHeaders.NBB_ROLES, "dummy roles");
		} else {
			mockPreAuthenticationHeaders = fakePreAuthenticationHeaders;
		}

		const mockSessionService: any = jasmine.createSpyObj<StarkSessionService>(starkSessionServiceName, [
			"getCurrentLanguage",
			"setCurrentLanguage",
			"login",
			"logout",
			"pauseUserActivityTracking",
			"resumeUserActivityTracking"
		]);
		mockSessionService.fakePreAuthenticationHeaders = mockPreAuthenticationHeaders;

		return mockSessionService;
	}
}
