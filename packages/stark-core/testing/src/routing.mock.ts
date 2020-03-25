import { StarkRoutingService } from "@nationalbankbelgium/stark-core";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkRoutingService} interface.
 */
export class MockStarkRoutingService implements SpyObj<StarkRoutingService> {
	/**
	 * See [StarkRoutingService navigateTo()]{@link StarkRoutingService#navigateTo} method
	 */
	public navigateTo: Spy<StarkRoutingService["navigateTo"]> = createSpy("navigateTo");

	/**
	 * See [StarkRoutingService navigateToHome()]{@link StarkRoutingService#navigateToHome} method
	 */
	public navigateToHome: Spy<StarkRoutingService["navigateToHome"]> = createSpy("navigateToHome");

	/**
	 * See [StarkRoutingService navigateToPrevious()]{@link StarkRoutingService#navigateToPrevious} method
	 */
	public navigateToPrevious: Spy<StarkRoutingService["navigateToPrevious"]> = createSpy("navigateToPrevious");

	/**
	 * See [StarkRoutingService reload()]{@link StarkRoutingService#reload} method
	 */
	public reload: Spy<StarkRoutingService["reload"]> = createSpy("reload");

	/**
	 * See [StarkRoutingService getCurrentStateName()]{@link StarkRoutingService#getCurrentStateName} method
	 */
	public getCurrentStateName: Spy<StarkRoutingService["getCurrentStateName"]> = createSpy("getCurrentStateName");

	/**
	 * See [StarkRoutingService getCurrentState()]{@link StarkRoutingService#getCurrentState} method
	 */
	public getCurrentState: Spy<StarkRoutingService["getCurrentState"]> = createSpy("getCurrentState");

	/**
	 * See [StarkRoutingService getCurrentStateConfig()]{@link StarkRoutingService#getCurrentStateConfig} method
	 */
	public getCurrentStateConfig: Spy<StarkRoutingService["getCurrentStateConfig"]> = createSpy("getCurrentStateConfig");

	/**
	 * See [StarkRoutingService getStatesConfig()]{@link StarkRoutingService#getStatesConfig} method
	 */
	public getStatesConfig: Spy<StarkRoutingService["getStatesConfig"]> = createSpy("getStatesConfig");

	/**
	 * See [StarkRoutingService getStateConfigByUrlPath()]{@link StarkRoutingService#getStateConfigByUrlPath} method
	 */
	public getStateConfigByUrlPath: Spy<StarkRoutingService["getStateConfigByUrlPath"]> = createSpy("getStateConfigByUrlPath");

	/**
	 * See [StarkRoutingService getStateDeclarationByStateName()]{@link StarkRoutingService#getStateDeclarationByStateName} method
	 */
	public getStateDeclarationByStateName: Spy<StarkRoutingService["getStateDeclarationByStateName"]> = createSpy(
		"getStateDeclarationByStateName"
	);

	/**
	 * See [StarkRoutingService getCurrentStateParams()]{@link StarkRoutingService#getCurrentStateParams} method
	 */
	public getCurrentStateParams: Spy<StarkRoutingService["getCurrentStateParams"]> = createSpy("getCurrentStateParams");

	/**
	 * See [StarkRoutingService getStateTreeParams()]{@link StarkRoutingService#getStateTreeParams} method
	 */
	public getStateTreeParams: Spy<StarkRoutingService["getStateTreeParams"]> = createSpy("getStateTreeParams");

	/**
	 * See [StarkRoutingService getStateTreeResolves()]{@link StarkRoutingService#getStateTreeResolves} method
	 */
	public getStateTreeResolves: Spy<StarkRoutingService["getStateTreeResolves"]> = createSpy("getStateTreeResolves");

	/**
	 * See [StarkRoutingService getStateTreeData()]{@link StarkRoutingService#getStateTreeData} method
	 */
	public getStateTreeData: Spy<StarkRoutingService["getStateTreeData"]> = createSpy("getStateTreeData");

	/**
	 * See [StarkRoutingService isCurrentUiState()]{@link StarkRoutingService#isCurrentUiState} method
	 */
	public isCurrentUiState: Spy<StarkRoutingService["isCurrentUiState"]> = createSpy("isCurrentUiState");

	/**
	 * See [StarkRoutingService isCurrentUiStateIncludedIn()]{@link StarkRoutingService#isCurrentUiStateIncludedIn} method
	 */
	public isCurrentUiStateIncludedIn: Spy<StarkRoutingService["isCurrentUiStateIncludedIn"]> = createSpy("includesState");

	/**
	 * See [StarkRoutingService addKnownNavigationRejectionCause()]{@link StarkRoutingService#addKnownNavigationRejectionCause} method
	 */
	public addKnownNavigationRejectionCause: Spy<StarkRoutingService["addKnownNavigationRejectionCause"]> = createSpy(
		"addKnownNavigationRejectionCause"
	);

	/**
	 * See [StarkRoutingService addTransitionHook()]{@link StarkRoutingService#addTransitionHook} method
	 */
	public addTransitionHook: Spy<StarkRoutingService["addTransitionHook"]> = createSpy("addTransitionHook");

	/**
	 * See [StarkRoutingService getTranslationKeyFromState()]{@link StarkRoutingService#getTranslationKeyFromState} method
	 */
	public getTranslationKeyFromState: Spy<StarkRoutingService["getTranslationKeyFromState"]> = createSpy("getTranslationKeyFromState");
}
