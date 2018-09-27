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
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">@nationalbankbelgium/stark-ui documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
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
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/StarkActionBarModule.html" data-type="entity-link">StarkActionBarModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkActionBarModule-edc0bf47f2a03b6b7f30ee786daaf2d0"' : 'data-target="#xs-components-links-module-StarkActionBarModule-edc0bf47f2a03b6b7f30ee786daaf2d0"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkActionBarModule-edc0bf47f2a03b6b7f30ee786daaf2d0"' : 'id="xs-components-links-module-StarkActionBarModule-edc0bf47f2a03b6b7f30ee786daaf2d0"' }>
                                        <li class="link">
                                            <a href="components/StarkActionBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkActionBarComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkAppFooterModule.html" data-type="entity-link">StarkAppFooterModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkAppFooterModule-aef98b3c161b12f77025841701227b21"' : 'data-target="#xs-components-links-module-StarkAppFooterModule-aef98b3c161b12f77025841701227b21"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkAppFooterModule-aef98b3c161b12f77025841701227b21"' : 'id="xs-components-links-module-StarkAppFooterModule-aef98b3c161b12f77025841701227b21"' }>
                                        <li class="link">
                                            <a href="components/StarkAppFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppFooterComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkAppLogoModule.html" data-type="entity-link">StarkAppLogoModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' : 'data-target="#xs-components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' : 'id="xs-components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' }>
                                        <li class="link">
                                            <a href="components/StarkAppLogoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppLogoComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkAppLogoutModule.html" data-type="entity-link">StarkAppLogoutModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkAppLogoutModule-b8ee5aac7bf7854dc7f634d06a03c2b8"' : 'data-target="#xs-components-links-module-StarkAppLogoutModule-b8ee5aac7bf7854dc7f634d06a03c2b8"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkAppLogoutModule-b8ee5aac7bf7854dc7f634d06a03c2b8"' : 'id="xs-components-links-module-StarkAppLogoutModule-b8ee5aac7bf7854dc7f634d06a03c2b8"' }>
                                        <li class="link">
                                            <a href="components/StarkAppLogoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppLogoutComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkAppSidebarModule.html" data-type="entity-link">StarkAppSidebarModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkAppSidebarModule-bf5ea1025b4ddb3eef98ee46e59f1210"' : 'data-target="#xs-components-links-module-StarkAppSidebarModule-bf5ea1025b4ddb3eef98ee46e59f1210"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkAppSidebarModule-bf5ea1025b4ddb3eef98ee46e59f1210"' : 'id="xs-components-links-module-StarkAppSidebarModule-bf5ea1025b4ddb3eef98ee46e59f1210"' }>
                                        <li class="link">
                                            <a href="components/StarkAppSidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppSidebarComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkBreadcrumbModule.html" data-type="entity-link">StarkBreadcrumbModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' : 'data-target="#xs-components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' : 'id="xs-components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' }>
                                        <li class="link">
                                            <a href="components/StarkBreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkBreadcrumbComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkCollapsibleModule.html" data-type="entity-link">StarkCollapsibleModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' : 'data-target="#xs-components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' : 'id="xs-components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' }>
                                        <li class="link">
                                            <a href="components/StarkCollapsibleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkCollapsibleComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkDatePickerModule.html" data-type="entity-link">StarkDatePickerModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkDatePickerModule-e0ddbd14d61241ae579ac9a00083eeba"' : 'data-target="#xs-components-links-module-StarkDatePickerModule-e0ddbd14d61241ae579ac9a00083eeba"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkDatePickerModule-e0ddbd14d61241ae579ac9a00083eeba"' : 'id="xs-components-links-module-StarkDatePickerModule-e0ddbd14d61241ae579ac9a00083eeba"' }>
                                        <li class="link">
                                            <a href="components/StarkDatePickerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkDatePickerComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkDateRangePickerModule.html" data-type="entity-link">StarkDateRangePickerModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkDateRangePickerModule-e2b3aa080dfbe6b363d6bba14c4d7998"' : 'data-target="#xs-components-links-module-StarkDateRangePickerModule-e2b3aa080dfbe6b363d6bba14c4d7998"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkDateRangePickerModule-e2b3aa080dfbe6b363d6bba14c4d7998"' : 'id="xs-components-links-module-StarkDateRangePickerModule-e2b3aa080dfbe6b363d6bba14c4d7998"' }>
                                        <li class="link">
                                            <a href="components/StarkDateRangePickerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkDateRangePickerComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkDropdownModule.html" data-type="entity-link">StarkDropdownModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkDropdownModule-9ebee30eb4ed035fa12fc121c6f4c5ff"' : 'data-target="#xs-components-links-module-StarkDropdownModule-9ebee30eb4ed035fa12fc121c6f4c5ff"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkDropdownModule-9ebee30eb4ed035fa12fc121c6f4c5ff"' : 'id="xs-components-links-module-StarkDropdownModule-9ebee30eb4ed035fa12fc121c6f4c5ff"' }>
                                        <li class="link">
                                            <a href="components/StarkDropdownComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkDropdownComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkKeyboardDirectivesModule.html" data-type="entity-link">StarkKeyboardDirectivesModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#directives-links-module-StarkKeyboardDirectivesModule-d5d8e8b27bf86cd7f93dcfc57fc9618d"' : 'data-target="#xs-directives-links-module-StarkKeyboardDirectivesModule-d5d8e8b27bf86cd7f93dcfc57fc9618d"' }>
                                    <span class="icon ion-md-code-working"></span>
                                    <span>Directives</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="directives-links-module-StarkKeyboardDirectivesModule-d5d8e8b27bf86cd7f93dcfc57fc9618d"' : 'id="xs-directives-links-module-StarkKeyboardDirectivesModule-d5d8e8b27bf86cd7f93dcfc57fc9618d"' }>
                                        <li class="link">
                                            <a href="directives/StarkOnEnterKeyDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkOnEnterKeyDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkRestrictInputDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkRestrictInputDirective</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkLanguageSelectorModule.html" data-type="entity-link">StarkLanguageSelectorModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkLanguageSelectorModule-e67cc8e0c4d9fc82e742caa6e88e1a8b"' : 'data-target="#xs-components-links-module-StarkLanguageSelectorModule-e67cc8e0c4d9fc82e742caa6e88e1a8b"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkLanguageSelectorModule-e67cc8e0c4d9fc82e742caa6e88e1a8b"' : 'id="xs-components-links-module-StarkLanguageSelectorModule-e67cc8e0c4d9fc82e742caa6e88e1a8b"' }>
                                        <li class="link">
                                            <a href="components/StarkLanguageSelectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkLanguageSelectorComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkPaginationModule.html" data-type="entity-link">StarkPaginationModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkPaginationModule-84c98cd37f280937b356cea58ed09ab3"' : 'data-target="#xs-components-links-module-StarkPaginationModule-84c98cd37f280937b356cea58ed09ab3"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkPaginationModule-84c98cd37f280937b356cea58ed09ab3"' : 'id="xs-components-links-module-StarkPaginationModule-84c98cd37f280937b356cea58ed09ab3"' }>
                                        <li class="link">
                                            <a href="components/StarkPaginationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkPaginationComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkPrettyPrintModule.html" data-type="entity-link">StarkPrettyPrintModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' : 'data-target="#xs-components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' : 'id="xs-components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' }>
                                        <li class="link">
                                            <a href="components/StarkPrettyPrintComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkPrettyPrintComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkSessionUiModule.html" data-type="entity-link">StarkSessionUiModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkSessionUiModule-b56e7c933524a6654178d45eef3c9240"' : 'data-target="#xs-components-links-module-StarkSessionUiModule-b56e7c933524a6654178d45eef3c9240"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkSessionUiModule-b56e7c933524a6654178d45eef3c9240"' : 'id="xs-components-links-module-StarkSessionUiModule-b56e7c933524a6654178d45eef3c9240"' }>
                                        <li class="link">
                                            <a href="components/StarkAppContainerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppContainerComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/StarkLoginPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkLoginPageComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/StarkPreloadingPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkPreloadingPageComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/StarkSessionExpiredPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSessionExpiredPageComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/StarkSessionLogoutPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSessionLogoutPageComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkSliderModule.html" data-type="entity-link">StarkSliderModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' : 'data-target="#xs-components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' : 'id="xs-components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' }>
                                        <li class="link">
                                            <a href="components/StarkSliderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSliderComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkSvgViewBoxModule.html" data-type="entity-link">StarkSvgViewBoxModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' : 'data-target="#xs-directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' }>
                                    <span class="icon ion-md-code-working"></span>
                                    <span>Directives</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' : 'id="xs-directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' }>
                                        <li class="link">
                                            <a href="directives/StarkSvgViewBoxDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSvgViewBoxDirective</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkTableModule.html" data-type="entity-link">StarkTableModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkTableModule-3eda32f591713ff6087525ac2fb223e2"' : 'data-target="#xs-components-links-module-StarkTableModule-3eda32f591713ff6087525ac2fb223e2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkTableModule-3eda32f591713ff6087525ac2fb223e2"' : 'id="xs-components-links-module-StarkTableModule-3eda32f591713ff6087525ac2fb223e2"' }>
                                        <li class="link">
                                            <a href="components/StarkTableColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTableColumnComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/StarkTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTableComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/StarkTableMultisortDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTableMultisortDialogComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StarkToastNotificationModule.html" data-type="entity-link">StarkToastNotificationModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StarkToastNotificationModule-65ba0b7a66321e23e5f0efac27d15cc6"' : 'data-target="#xs-components-links-module-StarkToastNotificationModule-65ba0b7a66321e23e5f0efac27d15cc6"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StarkToastNotificationModule-65ba0b7a66321e23e5f0efac27d15cc6"' : 'id="xs-components-links-module-StarkToastNotificationModule-65ba0b7a66321e23e5f0efac27d15cc6"' }>
                                        <li class="link">
                                            <a href="components/StarkToastNotificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkToastNotificationComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#components-links"' : 'data-target="#xs-components-links"' }>
                        <span class="icon ion-md-cog"></span>
                        <span>Components</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/StarkActionBarComponent.html" data-type="entity-link">StarkActionBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppContainerComponent.html" data-type="entity-link">StarkAppContainerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppFooterComponent.html" data-type="entity-link">StarkAppFooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppLogoComponent.html" data-type="entity-link">StarkAppLogoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppLogoutComponent.html" data-type="entity-link">StarkAppLogoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppSidebarComponent.html" data-type="entity-link">StarkAppSidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkBreadcrumbComponent.html" data-type="entity-link">StarkBreadcrumbComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkCollapsibleComponent.html" data-type="entity-link">StarkCollapsibleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkDatePickerComponent.html" data-type="entity-link">StarkDatePickerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkDateRangePickerComponent.html" data-type="entity-link">StarkDateRangePickerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkDropdownComponent.html" data-type="entity-link">StarkDropdownComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkLanguageSelectorComponent.html" data-type="entity-link">StarkLanguageSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkLoginPageComponent.html" data-type="entity-link">StarkLoginPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPaginationComponent.html" data-type="entity-link">StarkPaginationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPreloadingPageComponent.html" data-type="entity-link">StarkPreloadingPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPrettyPrintComponent.html" data-type="entity-link">StarkPrettyPrintComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkSessionExpiredPageComponent.html" data-type="entity-link">StarkSessionExpiredPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkSessionLogoutPageComponent.html" data-type="entity-link">StarkSessionLogoutPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkSliderComponent.html" data-type="entity-link">StarkSliderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkTableColumnComponent.html" data-type="entity-link">StarkTableColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkTableComponent.html" data-type="entity-link">StarkTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkToastNotificationComponent.html" data-type="entity-link">StarkToastNotificationComponent</a>
                            </li>
                    </ul>
                </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#directives-links"' : 'data-target="#xs-directives-links"' }>
                        <span class="icon ion-md-code-working"></span>
                        <span>Directives</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                            <li class="link">
                                <a href="directives/StarkOnEnterKeyDirective.html" data-type="entity-link">StarkOnEnterKeyDirective</a>
                            </li>
                            <li class="link">
                                <a href="directives/StarkRestrictInputDirective.html" data-type="entity-link">StarkRestrictInputDirective</a>
                            </li>
                            <li class="link">
                                <a href="directives/StarkSvgViewBoxDirective.html" data-type="entity-link">StarkSvgViewBoxDirective</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/AbstractStarkUiComponent.html" data-type="entity-link">AbstractStarkUiComponent</a>
                    </li>
                    <li class="link">
                        <a href="classes/MockAppSidebarService.html" data-type="entity-link">MockAppSidebarService</a>
                    </li>
                    <li class="link">
                        <a href="classes/MockToastNotificationService.html" data-type="entity-link">MockToastNotificationService</a>
                    </li>
                    <li class="link">
                        <a href="classes/StarkDOMUtil.html" data-type="entity-link">StarkDOMUtil</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                ${ isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"' }>
                <span class="icon ion-md-information-circle-outline"></span>
                <span>Interfaces</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                    <li class="link">
                        <a href="interfaces/StarkAction.html" data-type="entity-link">StarkAction</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkActionBarConfig.html" data-type="entity-link">StarkActionBarConfig</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkActionBase.html" data-type="entity-link">StarkActionBase</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkAppSidebarOpenEvent.html" data-type="entity-link">StarkAppSidebarOpenEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkAppSidebarService.html" data-type="entity-link">StarkAppSidebarService</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkBreadcrumbConfig.html" data-type="entity-link">StarkBreadcrumbConfig</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkBreadcrumbPath.html" data-type="entity-link">StarkBreadcrumbPath</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkCustomizablePredefinedAction.html" data-type="entity-link">StarkCustomizablePredefinedAction</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkDateRangePickerEvent.html" data-type="entity-link">StarkDateRangePickerEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkDefaultPredefinedAction.html" data-type="entity-link">StarkDefaultPredefinedAction</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkMessage.html" data-type="entity-link">StarkMessage</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkPaginateEvent.html" data-type="entity-link">StarkPaginateEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkPaginationConfig.html" data-type="entity-link">StarkPaginationConfig</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkSliderConfig.html" data-type="entity-link">StarkSliderConfig</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkSliderFormatter.html" data-type="entity-link">StarkSliderFormatter</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkSliderPips.html" data-type="entity-link">StarkSliderPips</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkSortingRule.html" data-type="entity-link">StarkSortingRule</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkTableColumnFilter.html" data-type="entity-link">StarkTableColumnFilter</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkTableColumnProperties.html" data-type="entity-link">StarkTableColumnProperties</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkTableFilter.html" data-type="entity-link">StarkTableFilter</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkTableMultisortDialogData.html" data-type="entity-link">StarkTableMultisortDialogData</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkToastMessage.html" data-type="entity-link">StarkToastMessage</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkToastNotificationOptions.html" data-type="entity-link">StarkToastNotificationOptions</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/StarkToastNotificationService.html" data-type="entity-link">StarkToastNotificationService</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
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
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
