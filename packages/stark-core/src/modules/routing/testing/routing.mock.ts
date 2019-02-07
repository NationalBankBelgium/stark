import { StarkRoutingService } from "@nationalbankbelgium/stark-core";
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * @ignore
 */
export class MockStarkRoutingService implements SpyObj<StarkRoutingService> {
	public navigateTo: SpyObj<StarkRoutingService>["navigateTo"] = createSpy("navigateTo");
	public navigateToHome: SpyObj<StarkRoutingService>["navigateToHome"] = createSpy("navigateToHome");
	public navigateToPrevious: SpyObj<StarkRoutingService>["navigateToPrevious"] = createSpy("navigateToPrevious");
	public reload: SpyObj<StarkRoutingService>["reload"] = createSpy("reload");
	public getCurrentStateName: SpyObj<StarkRoutingService>["getCurrentStateName"] = createSpy("getCurrentStateName");
	public getCurrentState: SpyObj<StarkRoutingService>["getCurrentState"] = createSpy("getCurrentState");
	public getCurrentStateConfig: SpyObj<StarkRoutingService>["getCurrentStateConfig"] = createSpy("getCurrentStateConfig");
	public getStatesConfig: SpyObj<StarkRoutingService>["getStatesConfig"] = createSpy("getStatesConfig");
	public getStateConfigByUrlPath: SpyObj<StarkRoutingService>["getStateConfigByUrlPath"] = createSpy("getStateConfigByUrlPath");
	public getStateDeclarationByStateName: SpyObj<StarkRoutingService>["getStateDeclarationByStateName"] = createSpy(
		"getStateDeclarationByStateName"
	);
	public getCurrentStateParams: SpyObj<StarkRoutingService>["getCurrentStateParams"] = createSpy("getCurrentStateParams");
	public getStateTreeParams: SpyObj<StarkRoutingService>["getStateTreeParams"] = createSpy("getStateTreeParams");
	public getStateTreeResolves: SpyObj<StarkRoutingService>["getStateTreeResolves"] = createSpy("getStateTreeResolves");
	public getStateTreeData: SpyObj<StarkRoutingService>["getStateTreeData"] = createSpy("getStateTreeData");
	public isCurrentUiState: SpyObj<StarkRoutingService>["isCurrentUiState"] = createSpy("isCurrentUiState");
	public isCurrentUiStateIncludedIn: SpyObj<StarkRoutingService>["isCurrentUiStateIncludedIn"] = createSpy("includesState");
	public addKnownNavigationRejectionCause: SpyObj<StarkRoutingService>["addKnownNavigationRejectionCause"] = createSpy(
		"addKnownNavigationRejectionCause"
	);
	public addTransitionHook: SpyObj<StarkRoutingService>["addTransitionHook"] = createSpy("addTransitionHook");
	public getTranslationKeyFromState: SpyObj<StarkRoutingService>["getTranslationKeyFromState"] = createSpy("getTranslationKeyFromState");
}
