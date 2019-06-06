'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@nationalbankbelgium/stark-core documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Developer Guide</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/getting-started.html" data-type="entity-link" data-context-id="additional">Getting Started</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/environments-support.html" data-type="entity-link" data-context-id="additional">Environments support</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/default-error-handling.html" data-type="entity-link" data-context-id="additional">Default Error Handling</a>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/StarkErrorHandlingModule.html" data-type="entity-link">StarkErrorHandlingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StarkHttpModule.html" data-type="entity-link">StarkHttpModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StarkLoggingModule.html" data-type="entity-link">StarkLoggingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StarkRoutingModule.html" data-type="entity-link">StarkRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSessionModule.html" data-type="entity-link">StarkSessionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkSessionModule-1607be100312533a02daf24c6ce2ae3c"' : 'data-target="#xs-components-links-module-StarkSessionModule-1607be100312533a02daf24c6ce2ae3c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkSessionModule-1607be100312533a02daf24c6ce2ae3c"' :
                                            'id="xs-components-links-module-StarkSessionModule-1607be100312533a02daf24c6ce2ae3c"' }>
                                            <li class="link">
                                                <a href="components/StarkAppContainerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppContainerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSettingsModule.html" data-type="entity-link">StarkSettingsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StarkUserModule.html" data-type="entity-link">StarkUserModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StarkXSRFModule.html" data-type="entity-link">StarkXSRFModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/StarkAppContainerComponent.html" data-type="entity-link">StarkAppContainerComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractStarkHttpRepository.html" data-type="entity-link">AbstractStarkHttpRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractStarkMain.html" data-type="entity-link">AbstractStarkMain</a>
                            </li>
                            <li class="link">
                                <a href="classes/MockStarkHttpService.html" data-type="entity-link">MockStarkHttpService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MockStarkLoggingService.html" data-type="entity-link">MockStarkLoggingService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MockStarkXsrfService.html" data-type="entity-link">MockStarkXsrfService</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkChangeLanguage.html" data-type="entity-link">StarkChangeLanguage</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkChangeLanguageFailure.html" data-type="entity-link">StarkChangeLanguageFailure</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkChangeLanguageSuccess.html" data-type="entity-link">StarkChangeLanguageSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkClassValidationUtil.html" data-type="entity-link">StarkClassValidationUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkConfigurationUtil.html" data-type="entity-link">StarkConfigurationUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkDateUtil.html" data-type="entity-link">StarkDateUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkDestroySession.html" data-type="entity-link">StarkDestroySession</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkDestroySessionSuccess.html" data-type="entity-link">StarkDestroySessionSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkFetchUserProfile.html" data-type="entity-link">StarkFetchUserProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkFetchUserProfileFailure.html" data-type="entity-link">StarkFetchUserProfileFailure</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkFetchUserProfileSuccess.html" data-type="entity-link">StarkFetchUserProfileSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkFlushLogMessages.html" data-type="entity-link">StarkFlushLogMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkGetAllUsers.html" data-type="entity-link">StarkGetAllUsers</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkGetAllUsersFailure.html" data-type="entity-link">StarkGetAllUsersFailure</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkGetAllUsersSuccess.html" data-type="entity-link">StarkGetAllUsersSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkHttpDiscriminatorSerializer.html" data-type="entity-link">StarkHttpDiscriminatorSerializer</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkHttpEchoType.html" data-type="entity-link">StarkHttpEchoType</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkHttpHeaders.html" data-type="entity-link">StarkHttpHeaders</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkHttpParameterCodec.html" data-type="entity-link">StarkHttpParameterCodec</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkHttpQueryParameters.html" data-type="entity-link">StarkHttpQueryParameters</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkHttpRequestType.html" data-type="entity-link">StarkHttpRequestType</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkHttpUtil.html" data-type="entity-link">StarkHttpUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkInitializeSession.html" data-type="entity-link">StarkInitializeSession</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkInitializeSessionSuccess.html" data-type="entity-link">StarkInitializeSessionSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsBBANConstraint.html" data-type="entity-link">StarkIsBBANConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsBICConstraint.html" data-type="entity-link">StarkIsBICConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsCompanyNumberConstraint.html" data-type="entity-link">StarkIsCompanyNumberConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsEstablishmentUnitNumberConstraint.html" data-type="entity-link">StarkIsEstablishmentUnitNumberConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsIBANConstraint.html" data-type="entity-link">StarkIsIBANConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsISINConstraint.html" data-type="entity-link">StarkIsISINConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsKBOConstraint.html" data-type="entity-link">StarkIsKBOConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsNINConstraint.html" data-type="entity-link">StarkIsNINConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkIsSupportedLanguageConstraint.html" data-type="entity-link">StarkIsSupportedLanguageConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkLanguages.html" data-type="entity-link">StarkLanguages</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkLogMessageAction.html" data-type="entity-link">StarkLogMessageAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkLogMessageType.html" data-type="entity-link">StarkLogMessageType</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkMapIsValidConstraint.html" data-type="entity-link">StarkMapIsValidConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkMapNotEmptyConstraint.html" data-type="entity-link">StarkMapNotEmptyConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkNavigate.html" data-type="entity-link">StarkNavigate</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkNavigateFailure.html" data-type="entity-link">StarkNavigateFailure</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkNavigateRejection.html" data-type="entity-link">StarkNavigateRejection</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkNavigateSuccess.html" data-type="entity-link">StarkNavigateSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkNavigationHistoryLimitReached.html" data-type="entity-link">StarkNavigationHistoryLimitReached</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkPersistPreferredLanguage.html" data-type="entity-link">StarkPersistPreferredLanguage</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkPersistPreferredLanguageFailureimplements.html" data-type="entity-link">StarkPersistPreferredLanguageFailureimplements</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkPersistPreferredLanguageSuccess.html" data-type="entity-link">StarkPersistPreferredLanguageSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkReload.html" data-type="entity-link">StarkReload</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkReloadFailure.html" data-type="entity-link">StarkReloadFailure</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkReloadSuccess.html" data-type="entity-link">StarkReloadSuccess</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkRoutingTransitionHook.html" data-type="entity-link">StarkRoutingTransitionHook</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSessionLogout.html" data-type="entity-link">StarkSessionLogout</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSessionTimeoutCountdownFinish.html" data-type="entity-link">StarkSessionTimeoutCountdownFinish</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSessionTimeoutCountdownStart.html" data-type="entity-link">StarkSessionTimeoutCountdownStart</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSessionTimeoutCountdownStop.html" data-type="entity-link">StarkSessionTimeoutCountdownStop</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSetLoggingApplicationId.html" data-type="entity-link">StarkSetLoggingApplicationId</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSetPreferredLanguage.html" data-type="entity-link">StarkSetPreferredLanguage</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSettings.html" data-type="entity-link">StarkSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSortOrder.html" data-type="entity-link">StarkSortOrder</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkUnhandledError.html" data-type="entity-link">StarkUnhandledError</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkUrlUtil.html" data-type="entity-link">StarkUrlUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkUserActivityTrackingPause.html" data-type="entity-link">StarkUserActivityTrackingPause</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkUserActivityTrackingResume.html" data-type="entity-link">StarkUserActivityTrackingResume</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkValidationErrorsUtil.html" data-type="entity-link">StarkValidationErrorsUtil</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/StarkErrorHandler.html" data-type="entity-link">StarkErrorHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StarkSettingsEffects.html" data-type="entity-link">StarkSettingsEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StarkXSRFServiceImpl.html" data-type="entity-link">StarkXSRFServiceImpl</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/StarkXSRFHttpInterceptor.html" data-type="entity-link">StarkXSRFHttpInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/StarkApplicationConfig.html" data-type="entity-link">StarkApplicationConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkApplicationMetadata.html" data-type="entity-link">StarkApplicationMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkBackend.html" data-type="entity-link">StarkBackend</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkCollectionMetadata.html" data-type="entity-link">StarkCollectionMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkCollectionResponseWrapper.html" data-type="entity-link">StarkCollectionResponseWrapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkCoreApplicationState.html" data-type="entity-link">StarkCoreApplicationState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkEnvironment.html" data-type="entity-link">StarkEnvironment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkError.html" data-type="entity-link">StarkError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkETags.html" data-type="entity-link">StarkETags</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpBaseRequestBuilder.html" data-type="entity-link">StarkHttpBaseRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpCreateRequestBuilder.html" data-type="entity-link">StarkHttpCreateRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpCreateRequestParams.html" data-type="entity-link">StarkHttpCreateRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpDeleteRequestBuilder.html" data-type="entity-link">StarkHttpDeleteRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpDeleteRequestParams.html" data-type="entity-link">StarkHttpDeleteRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpError.html" data-type="entity-link">StarkHttpError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpErrorBase.html" data-type="entity-link">StarkHttpErrorBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpErrorDetail.html" data-type="entity-link">StarkHttpErrorDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpErrorWrapper.html" data-type="entity-link">StarkHttpErrorWrapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpFetchResourceRequestBuilder.html" data-type="entity-link">StarkHttpFetchResourceRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpGetCollectionRequestBuilder.html" data-type="entity-link">StarkHttpGetCollectionRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpGetCollectionRequestParams.html" data-type="entity-link">StarkHttpGetCollectionRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpGetRequestBuilder.html" data-type="entity-link">StarkHttpGetRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpGetRequestParams.html" data-type="entity-link">StarkHttpGetRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpRawCollectionResponseData.html" data-type="entity-link">StarkHttpRawCollectionResponseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpRequest.html" data-type="entity-link">StarkHttpRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpRequestBuilder.html" data-type="entity-link">StarkHttpRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpRequestParams.html" data-type="entity-link">StarkHttpRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpResponse.html" data-type="entity-link">StarkHttpResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpSearchRequestBuilder.html" data-type="entity-link">StarkHttpSearchRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpSearchRequestParams.html" data-type="entity-link">StarkHttpSearchRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpSerializer.html" data-type="entity-link">StarkHttpSerializer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpService.html" data-type="entity-link">StarkHttpService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpUpdateRequestBuilder.html" data-type="entity-link">StarkHttpUpdateRequestBuilder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkHttpUpdateRequestParams.html" data-type="entity-link">StarkHttpUpdateRequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkLanguage.html" data-type="entity-link">StarkLanguage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkLocale.html" data-type="entity-link">StarkLocale</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkLogging.html" data-type="entity-link">StarkLogging</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkLoggingService.html" data-type="entity-link">StarkLoggingService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkLoggingState.html" data-type="entity-link">StarkLoggingState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkLogMessage.html" data-type="entity-link">StarkLogMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMain.html" data-type="entity-link">StarkMain</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMockData.html" data-type="entity-link">StarkMockData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPaginationMetadata.html" data-type="entity-link">StarkPaginationMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkResource.html" data-type="entity-link">StarkResource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkResponseWrapper.html" data-type="entity-link">StarkResponseWrapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkRoutingService.html" data-type="entity-link">StarkRoutingService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSession.html" data-type="entity-link">StarkSession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSessionConfig.html" data-type="entity-link">StarkSessionConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSessionService.html" data-type="entity-link">StarkSessionService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSessionState.html" data-type="entity-link">StarkSessionState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSettingsService.html" data-type="entity-link">StarkSettingsService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSettingsState.html" data-type="entity-link">StarkSettingsState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSingleItemMetadata.html" data-type="entity-link">StarkSingleItemMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSingleItemResponseWrapper.html" data-type="entity-link">StarkSingleItemResponseWrapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSortItem.html" data-type="entity-link">StarkSortItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkStateConfigWithParams.html" data-type="entity-link">StarkStateConfigWithParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkUserModuleConfig.html" data-type="entity-link">StarkUserModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkUserProfile.html" data-type="entity-link">StarkUserProfile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkUserRepository.html" data-type="entity-link">StarkUserRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkUserSecurityProfile.html" data-type="entity-link">StarkUserSecurityProfile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkUserService.html" data-type="entity-link">StarkUserService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkValidator.html" data-type="entity-link">StarkValidator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkWarnings.html" data-type="entity-link">StarkWarnings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkXSRFConfig.html" data-type="entity-link">StarkXSRFConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkXSRFService.html" data-type="entity-link">StarkXSRFService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkXSRFWaitBeforePingingLiteral.html" data-type="entity-link">StarkXSRFWaitBeforePingingLiteral</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});