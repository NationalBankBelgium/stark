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
                    <a href="index.html" data-type="index-link">@nationalbankbelgium/stark-ui documentation</a>
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
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/getting-started.html" data-type="entity-link" data-context-id="additional">Getting Started</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/generic-search-component.html" data-type="entity-link" data-context-id="additional">Generic Search component</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/timeout-warning-configuration.html" data-type="entity-link" data-context-id="additional">Timeout Warning configuration</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/testing-subpackage.html" data-type="entity-link" data-context-id="additional">Testing Subpackage</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/StarkActionBarModule.html" data-type="entity-link" >StarkActionBarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkActionBarModule-92fd9a498eaa3a185d82ab47161aaaa6a8a087c74fba26fe344c732c995239c8ab96b486054df0e79e06e1fb94e8e0320d75f85bd3eccc05474b9d1485023a49"' : 'data-target="#xs-components-links-module-StarkActionBarModule-92fd9a498eaa3a185d82ab47161aaaa6a8a087c74fba26fe344c732c995239c8ab96b486054df0e79e06e1fb94e8e0320d75f85bd3eccc05474b9d1485023a49"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkActionBarModule-92fd9a498eaa3a185d82ab47161aaaa6a8a087c74fba26fe344c732c995239c8ab96b486054df0e79e06e1fb94e8e0320d75f85bd3eccc05474b9d1485023a49"' :
                                            'id="xs-components-links-module-StarkActionBarModule-92fd9a498eaa3a185d82ab47161aaaa6a8a087c74fba26fe344c732c995239c8ab96b486054df0e79e06e1fb94e8e0320d75f85bd3eccc05474b9d1485023a49"' }>
                                            <li class="link">
                                                <a href="components/StarkActionBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkActionBarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppDataModule.html" data-type="entity-link" >StarkAppDataModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppDataModule-5d501dc969241ea1b9f7db479e67eb4371c78ccf7bfbd48b12b2ac97873909a7fa34c626c65dd7f0feb52a6d4a01428e4aea99a19d49112dd312c23a681b980b"' : 'data-target="#xs-components-links-module-StarkAppDataModule-5d501dc969241ea1b9f7db479e67eb4371c78ccf7bfbd48b12b2ac97873909a7fa34c626c65dd7f0feb52a6d4a01428e4aea99a19d49112dd312c23a681b980b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppDataModule-5d501dc969241ea1b9f7db479e67eb4371c78ccf7bfbd48b12b2ac97873909a7fa34c626c65dd7f0feb52a6d4a01428e4aea99a19d49112dd312c23a681b980b"' :
                                            'id="xs-components-links-module-StarkAppDataModule-5d501dc969241ea1b9f7db479e67eb4371c78ccf7bfbd48b12b2ac97873909a7fa34c626c65dd7f0feb52a6d4a01428e4aea99a19d49112dd312c23a681b980b"' }>
                                            <li class="link">
                                                <a href="components/StarkAppDataComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAppDataComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppFooterModule.html" data-type="entity-link" >StarkAppFooterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppFooterModule-7043f9eafedbdddfb1c0f466ddbbf42d855a4464a14a774df8a39388015bf6dc8720ea6179b656661139395a3ad5096051fff8bf27ef54ac0cf90ce0a0dfec29"' : 'data-target="#xs-components-links-module-StarkAppFooterModule-7043f9eafedbdddfb1c0f466ddbbf42d855a4464a14a774df8a39388015bf6dc8720ea6179b656661139395a3ad5096051fff8bf27ef54ac0cf90ce0a0dfec29"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppFooterModule-7043f9eafedbdddfb1c0f466ddbbf42d855a4464a14a774df8a39388015bf6dc8720ea6179b656661139395a3ad5096051fff8bf27ef54ac0cf90ce0a0dfec29"' :
                                            'id="xs-components-links-module-StarkAppFooterModule-7043f9eafedbdddfb1c0f466ddbbf42d855a4464a14a774df8a39388015bf6dc8720ea6179b656661139395a3ad5096051fff8bf27ef54ac0cf90ce0a0dfec29"' }>
                                            <li class="link">
                                                <a href="components/StarkAppFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAppFooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppLogoModule.html" data-type="entity-link" >StarkAppLogoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppLogoModule-f30a4f71d4a124a1177db325d6a83e9110d8614f96aeb26e689fbcb78eb3997357e742b6826e47e45a2afe0d49b4957509d0f2ca96921879a1c6dacb27b3f847"' : 'data-target="#xs-components-links-module-StarkAppLogoModule-f30a4f71d4a124a1177db325d6a83e9110d8614f96aeb26e689fbcb78eb3997357e742b6826e47e45a2afe0d49b4957509d0f2ca96921879a1c6dacb27b3f847"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppLogoModule-f30a4f71d4a124a1177db325d6a83e9110d8614f96aeb26e689fbcb78eb3997357e742b6826e47e45a2afe0d49b4957509d0f2ca96921879a1c6dacb27b3f847"' :
                                            'id="xs-components-links-module-StarkAppLogoModule-f30a4f71d4a124a1177db325d6a83e9110d8614f96aeb26e689fbcb78eb3997357e742b6826e47e45a2afe0d49b4957509d0f2ca96921879a1c6dacb27b3f847"' }>
                                            <li class="link">
                                                <a href="components/StarkAppLogoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAppLogoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppLogoutModule.html" data-type="entity-link" >StarkAppLogoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppLogoutModule-0eb25dd6bfef03b556b08a1b2578aad08947e91bbb720c84cd8455814187d6f4d942928bae9ffbac7a173241985501802481a99c1b457b70497f6440f60e9e79"' : 'data-target="#xs-components-links-module-StarkAppLogoutModule-0eb25dd6bfef03b556b08a1b2578aad08947e91bbb720c84cd8455814187d6f4d942928bae9ffbac7a173241985501802481a99c1b457b70497f6440f60e9e79"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppLogoutModule-0eb25dd6bfef03b556b08a1b2578aad08947e91bbb720c84cd8455814187d6f4d942928bae9ffbac7a173241985501802481a99c1b457b70497f6440f60e9e79"' :
                                            'id="xs-components-links-module-StarkAppLogoutModule-0eb25dd6bfef03b556b08a1b2578aad08947e91bbb720c84cd8455814187d6f4d942928bae9ffbac7a173241985501802481a99c1b457b70497f6440f60e9e79"' }>
                                            <li class="link">
                                                <a href="components/StarkAppLogoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAppLogoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppMenuModule.html" data-type="entity-link" >StarkAppMenuModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppMenuModule-898ee4dd9e6551c58eab4c6d5a3ccbe0e3ba497df73717d0f438bcdb7b38962ac49f0916c1d7255335fad0c8e55d0653e3804fa18a91fd43670e043a3d71a1b5"' : 'data-target="#xs-components-links-module-StarkAppMenuModule-898ee4dd9e6551c58eab4c6d5a3ccbe0e3ba497df73717d0f438bcdb7b38962ac49f0916c1d7255335fad0c8e55d0653e3804fa18a91fd43670e043a3d71a1b5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppMenuModule-898ee4dd9e6551c58eab4c6d5a3ccbe0e3ba497df73717d0f438bcdb7b38962ac49f0916c1d7255335fad0c8e55d0653e3804fa18a91fd43670e043a3d71a1b5"' :
                                            'id="xs-components-links-module-StarkAppMenuModule-898ee4dd9e6551c58eab4c6d5a3ccbe0e3ba497df73717d0f438bcdb7b38962ac49f0916c1d7255335fad0c8e55d0653e3804fa18a91fd43670e043a3d71a1b5"' }>
                                            <li class="link">
                                                <a href="components/StarkAppMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAppMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkAppMenuItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAppMenuItemComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppSidebarModule.html" data-type="entity-link" >StarkAppSidebarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppSidebarModule-5fc0af23764a21493d8ce72c85f46d8dd615198cfa6a983d555a6e670d196e28ea60f8eb72adf4a9f3a2d2cce96f749747d2565aab162f8dc64e0d8a2fdcacfd"' : 'data-target="#xs-components-links-module-StarkAppSidebarModule-5fc0af23764a21493d8ce72c85f46d8dd615198cfa6a983d555a6e670d196e28ea60f8eb72adf4a9f3a2d2cce96f749747d2565aab162f8dc64e0d8a2fdcacfd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppSidebarModule-5fc0af23764a21493d8ce72c85f46d8dd615198cfa6a983d555a6e670d196e28ea60f8eb72adf4a9f3a2d2cce96f749747d2565aab162f8dc64e0d8a2fdcacfd"' :
                                            'id="xs-components-links-module-StarkAppSidebarModule-5fc0af23764a21493d8ce72c85f46d8dd615198cfa6a983d555a6e670d196e28ea60f8eb72adf4a9f3a2d2cce96f749747d2565aab162f8dc64e0d8a2fdcacfd"' }>
                                            <li class="link">
                                                <a href="components/StarkAppSidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAppSidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkBreadcrumbModule.html" data-type="entity-link" >StarkBreadcrumbModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkBreadcrumbModule-62546991531d9237d96482f471c7f5227da1717bf04c7fb956491a06fa01a6a48e81a1ea1d579804fbf76be70b2cf6140f3116ec759cd5d8b60c988d9e1b8c67"' : 'data-target="#xs-components-links-module-StarkBreadcrumbModule-62546991531d9237d96482f471c7f5227da1717bf04c7fb956491a06fa01a6a48e81a1ea1d579804fbf76be70b2cf6140f3116ec759cd5d8b60c988d9e1b8c67"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkBreadcrumbModule-62546991531d9237d96482f471c7f5227da1717bf04c7fb956491a06fa01a6a48e81a1ea1d579804fbf76be70b2cf6140f3116ec759cd5d8b60c988d9e1b8c67"' :
                                            'id="xs-components-links-module-StarkBreadcrumbModule-62546991531d9237d96482f471c7f5227da1717bf04c7fb956491a06fa01a6a48e81a1ea1d579804fbf76be70b2cf6140f3116ec759cd5d8b60c988d9e1b8c67"' }>
                                            <li class="link">
                                                <a href="components/StarkBreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkBreadcrumbComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkCollapsibleModule.html" data-type="entity-link" >StarkCollapsibleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkCollapsibleModule-945dd55f323d1e15a514c01f602a4e43855c5a064b3427cf3bcf12b8c558d5d4fabc098a1b237ee96abf8da14bb0c83e1b85a0439077ad19e15d10146f75a1d6"' : 'data-target="#xs-components-links-module-StarkCollapsibleModule-945dd55f323d1e15a514c01f602a4e43855c5a064b3427cf3bcf12b8c558d5d4fabc098a1b237ee96abf8da14bb0c83e1b85a0439077ad19e15d10146f75a1d6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkCollapsibleModule-945dd55f323d1e15a514c01f602a4e43855c5a064b3427cf3bcf12b8c558d5d4fabc098a1b237ee96abf8da14bb0c83e1b85a0439077ad19e15d10146f75a1d6"' :
                                            'id="xs-components-links-module-StarkCollapsibleModule-945dd55f323d1e15a514c01f602a4e43855c5a064b3427cf3bcf12b8c558d5d4fabc098a1b237ee96abf8da14bb0c83e1b85a0439077ad19e15d10146f75a1d6"' }>
                                            <li class="link">
                                                <a href="components/StarkCollapsibleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkCollapsibleComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDatePickerModule.html" data-type="entity-link" >StarkDatePickerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDatePickerModule-4e83f9f72606e3d2521a21f061a214e29bd36f16f95ffe5760f7f2dd2efd409ca4798cae3208dba5c73083500f065a2dc576481622a3fbd749402b62981d3c1e"' : 'data-target="#xs-components-links-module-StarkDatePickerModule-4e83f9f72606e3d2521a21f061a214e29bd36f16f95ffe5760f7f2dd2efd409ca4798cae3208dba5c73083500f065a2dc576481622a3fbd749402b62981d3c1e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDatePickerModule-4e83f9f72606e3d2521a21f061a214e29bd36f16f95ffe5760f7f2dd2efd409ca4798cae3208dba5c73083500f065a2dc576481622a3fbd749402b62981d3c1e"' :
                                            'id="xs-components-links-module-StarkDatePickerModule-4e83f9f72606e3d2521a21f061a214e29bd36f16f95ffe5760f7f2dd2efd409ca4798cae3208dba5c73083500f065a2dc576481622a3fbd749402b62981d3c1e"' }>
                                            <li class="link">
                                                <a href="components/StarkDatePickerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkDatePickerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDateRangePickerModule.html" data-type="entity-link" >StarkDateRangePickerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDateRangePickerModule-31f25e41624948c774a43754446b5b39c06e53268a3fb1173ffba2a007f3c74e4f814d5e16e643f3aa710be71d5839aa16843930d769ad587b8eb947f22de0d7"' : 'data-target="#xs-components-links-module-StarkDateRangePickerModule-31f25e41624948c774a43754446b5b39c06e53268a3fb1173ffba2a007f3c74e4f814d5e16e643f3aa710be71d5839aa16843930d769ad587b8eb947f22de0d7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDateRangePickerModule-31f25e41624948c774a43754446b5b39c06e53268a3fb1173ffba2a007f3c74e4f814d5e16e643f3aa710be71d5839aa16843930d769ad587b8eb947f22de0d7"' :
                                            'id="xs-components-links-module-StarkDateRangePickerModule-31f25e41624948c774a43754446b5b39c06e53268a3fb1173ffba2a007f3c74e4f814d5e16e643f3aa710be71d5839aa16843930d769ad587b8eb947f22de0d7"' }>
                                            <li class="link">
                                                <a href="components/StarkDateRangePickerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkDateRangePickerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDateTimePickerModule.html" data-type="entity-link" >StarkDateTimePickerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDateTimePickerModule-6c5f5d3b1126b65858aa38251c9a94e6c2bfaf591a245e13d8bbde6c02dc43e9349d1af4420d9cff2ae4fbb713554c66a7963c80da0958d60e5dfe88db6644dc"' : 'data-target="#xs-components-links-module-StarkDateTimePickerModule-6c5f5d3b1126b65858aa38251c9a94e6c2bfaf591a245e13d8bbde6c02dc43e9349d1af4420d9cff2ae4fbb713554c66a7963c80da0958d60e5dfe88db6644dc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDateTimePickerModule-6c5f5d3b1126b65858aa38251c9a94e6c2bfaf591a245e13d8bbde6c02dc43e9349d1af4420d9cff2ae4fbb713554c66a7963c80da0958d60e5dfe88db6644dc"' :
                                            'id="xs-components-links-module-StarkDateTimePickerModule-6c5f5d3b1126b65858aa38251c9a94e6c2bfaf591a245e13d8bbde6c02dc43e9349d1af4420d9cff2ae4fbb713554c66a7963c80da0958d60e5dfe88db6644dc"' }>
                                            <li class="link">
                                                <a href="components/StarkDateTimePickerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkDateTimePickerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDialogsModule.html" data-type="entity-link" >StarkDialogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDialogsModule-904a011cb6a35a67b81a2bab9882f03d279e4a789e7e78e6d7de3167e394b0d63c2b05ccf43c7e398ebc52c66b4516a6bbba89526085a77fa6cc6e41e74db164"' : 'data-target="#xs-components-links-module-StarkDialogsModule-904a011cb6a35a67b81a2bab9882f03d279e4a789e7e78e6d7de3167e394b0d63c2b05ccf43c7e398ebc52c66b4516a6bbba89526085a77fa6cc6e41e74db164"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDialogsModule-904a011cb6a35a67b81a2bab9882f03d279e4a789e7e78e6d7de3167e394b0d63c2b05ccf43c7e398ebc52c66b4516a6bbba89526085a77fa6cc6e41e74db164"' :
                                            'id="xs-components-links-module-StarkDialogsModule-904a011cb6a35a67b81a2bab9882f03d279e4a789e7e78e6d7de3167e394b0d63c2b05ccf43c7e398ebc52c66b4516a6bbba89526085a77fa6cc6e41e74db164"' }>
                                            <li class="link">
                                                <a href="components/StarkAlertDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkAlertDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkConfirmDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkConfirmDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkPromptDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkPromptDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDropdownModule.html" data-type="entity-link" >StarkDropdownModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDropdownModule-a87b57e47cf67bff06935792f8bfd6b93f0927d58be6651c062322e30530018d055c377e7714a2c0383ecacaa696d834594b7986813b6dc1e0abdc007d6f867b"' : 'data-target="#xs-components-links-module-StarkDropdownModule-a87b57e47cf67bff06935792f8bfd6b93f0927d58be6651c062322e30530018d055c377e7714a2c0383ecacaa696d834594b7986813b6dc1e0abdc007d6f867b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDropdownModule-a87b57e47cf67bff06935792f8bfd6b93f0927d58be6651c062322e30530018d055c377e7714a2c0383ecacaa696d834594b7986813b6dc1e0abdc007d6f867b"' :
                                            'id="xs-components-links-module-StarkDropdownModule-a87b57e47cf67bff06935792f8bfd6b93f0927d58be6651c062322e30530018d055c377e7714a2c0383ecacaa696d834594b7986813b6dc1e0abdc007d6f867b"' }>
                                            <li class="link">
                                                <a href="components/StarkDropdownComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkDropdownComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkGenericSearchModule.html" data-type="entity-link" >StarkGenericSearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkGenericSearchModule-f70acd50b609e73c3dcc5b8456743d0581f36403c4ca4417c7e55eebb21be04147c02e3a91c2a29399f6579e3fb12e2dc59650dca0fb9cbe19603c07aa3dff23"' : 'data-target="#xs-components-links-module-StarkGenericSearchModule-f70acd50b609e73c3dcc5b8456743d0581f36403c4ca4417c7e55eebb21be04147c02e3a91c2a29399f6579e3fb12e2dc59650dca0fb9cbe19603c07aa3dff23"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkGenericSearchModule-f70acd50b609e73c3dcc5b8456743d0581f36403c4ca4417c7e55eebb21be04147c02e3a91c2a29399f6579e3fb12e2dc59650dca0fb9cbe19603c07aa3dff23"' :
                                            'id="xs-components-links-module-StarkGenericSearchModule-f70acd50b609e73c3dcc5b8456743d0581f36403c4ca4417c7e55eebb21be04147c02e3a91c2a29399f6579e3fb12e2dc59650dca0fb9cbe19603c07aa3dff23"' }>
                                            <li class="link">
                                                <a href="components/StarkGenericSearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkGenericSearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkInputMaskDirectivesModule.html" data-type="entity-link" >StarkInputMaskDirectivesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkInputMaskDirectivesModule-22e17c860302f6600b16339a755208245e9acc4a6561ccbddf3dd1a9256b97602552af83062647da16b346952c85d9a0502d7c232860b39ff211c4d518efd0a9"' : 'data-target="#xs-directives-links-module-StarkInputMaskDirectivesModule-22e17c860302f6600b16339a755208245e9acc4a6561ccbddf3dd1a9256b97602552af83062647da16b346952c85d9a0502d7c232860b39ff211c4d518efd0a9"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkInputMaskDirectivesModule-22e17c860302f6600b16339a755208245e9acc4a6561ccbddf3dd1a9256b97602552af83062647da16b346952c85d9a0502d7c232860b39ff211c4d518efd0a9"' :
                                        'id="xs-directives-links-module-StarkInputMaskDirectivesModule-22e17c860302f6600b16339a755208245e9acc4a6561ccbddf3dd1a9256b97602552af83062647da16b346952c85d9a0502d7c232860b39ff211c4d518efd0a9"' }>
                                        <li class="link">
                                            <a href="directives/StarkEmailMaskDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkEmailMaskDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkNumberMaskDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkNumberMaskDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkTextMaskDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTextMaskDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkTimestampMaskDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTimestampMaskDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkLanguageSelectorModule.html" data-type="entity-link" >StarkLanguageSelectorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkLanguageSelectorModule-8f70710d76cfda2c9d60fab2924967efd8b8da413acbbe0723b61d910bdf1657c85629945d8bb2dc36f3ec624eb92a4e173c3753ceeb9f0205458015a4098a63"' : 'data-target="#xs-components-links-module-StarkLanguageSelectorModule-8f70710d76cfda2c9d60fab2924967efd8b8da413acbbe0723b61d910bdf1657c85629945d8bb2dc36f3ec624eb92a4e173c3753ceeb9f0205458015a4098a63"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkLanguageSelectorModule-8f70710d76cfda2c9d60fab2924967efd8b8da413acbbe0723b61d910bdf1657c85629945d8bb2dc36f3ec624eb92a4e173c3753ceeb9f0205458015a4098a63"' :
                                            'id="xs-components-links-module-StarkLanguageSelectorModule-8f70710d76cfda2c9d60fab2924967efd8b8da413acbbe0723b61d910bdf1657c85629945d8bb2dc36f3ec624eb92a4e173c3753ceeb9f0205458015a4098a63"' }>
                                            <li class="link">
                                                <a href="components/StarkLanguageSelectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkLanguageSelectorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkMessagePaneModule.html" data-type="entity-link" >StarkMessagePaneModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkMessagePaneModule-1f18f21ef3e61e14de89fce118d7fa84a3546b11ad617959ab430ba8dab3c960c8ec374ceeabbf35f278d1cd5060856eb4a71662a39158a154a6bc7c3ed61ed9"' : 'data-target="#xs-components-links-module-StarkMessagePaneModule-1f18f21ef3e61e14de89fce118d7fa84a3546b11ad617959ab430ba8dab3c960c8ec374ceeabbf35f278d1cd5060856eb4a71662a39158a154a6bc7c3ed61ed9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkMessagePaneModule-1f18f21ef3e61e14de89fce118d7fa84a3546b11ad617959ab430ba8dab3c960c8ec374ceeabbf35f278d1cd5060856eb4a71662a39158a154a6bc7c3ed61ed9"' :
                                            'id="xs-components-links-module-StarkMessagePaneModule-1f18f21ef3e61e14de89fce118d7fa84a3546b11ad617959ab430ba8dab3c960c8ec374ceeabbf35f278d1cd5060856eb4a71662a39158a154a6bc7c3ed61ed9"' }>
                                            <li class="link">
                                                <a href="components/StarkMessagePaneComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkMessagePaneComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkMinimapModule.html" data-type="entity-link" >StarkMinimapModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkMinimapModule-d8da33e70c47a872c87c1a62254f10f994443e5218fc7532c7e384a32218e18990bae4208bf1a5baffb23d3479d973db528871c0e6c73de914351b90f4303ec2"' : 'data-target="#xs-components-links-module-StarkMinimapModule-d8da33e70c47a872c87c1a62254f10f994443e5218fc7532c7e384a32218e18990bae4208bf1a5baffb23d3479d973db528871c0e6c73de914351b90f4303ec2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkMinimapModule-d8da33e70c47a872c87c1a62254f10f994443e5218fc7532c7e384a32218e18990bae4208bf1a5baffb23d3479d973db528871c0e6c73de914351b90f4303ec2"' :
                                            'id="xs-components-links-module-StarkMinimapModule-d8da33e70c47a872c87c1a62254f10f994443e5218fc7532c7e384a32218e18990bae4208bf1a5baffb23d3479d973db528871c0e6c73de914351b90f4303ec2"' }>
                                            <li class="link">
                                                <a href="components/StarkMinimapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkMinimapComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkPaginationModule.html" data-type="entity-link" >StarkPaginationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkPaginationModule-b5cc3bb3f066496f85e54ada7d927f6147a009f4e64d028d96267334077d4f506cbf6ae3030d3d99914ca4403454eb9cce7d394184c302c22c6de2844e9087c0"' : 'data-target="#xs-components-links-module-StarkPaginationModule-b5cc3bb3f066496f85e54ada7d927f6147a009f4e64d028d96267334077d4f506cbf6ae3030d3d99914ca4403454eb9cce7d394184c302c22c6de2844e9087c0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkPaginationModule-b5cc3bb3f066496f85e54ada7d927f6147a009f4e64d028d96267334077d4f506cbf6ae3030d3d99914ca4403454eb9cce7d394184c302c22c6de2844e9087c0"' :
                                            'id="xs-components-links-module-StarkPaginationModule-b5cc3bb3f066496f85e54ada7d927f6147a009f4e64d028d96267334077d4f506cbf6ae3030d3d99914ca4403454eb9cce7d394184c302c22c6de2844e9087c0"' }>
                                            <li class="link">
                                                <a href="components/StarkPaginationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkPaginationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkPrettyPrintModule.html" data-type="entity-link" >StarkPrettyPrintModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkPrettyPrintModule-6bf1365d2e71100f6e7a21101abc084d87fc733ebbc2e437105126f8ebc95807d74b86720662002617ef4b791cd2009619d7942bbc8c6218b5249da07805888c"' : 'data-target="#xs-components-links-module-StarkPrettyPrintModule-6bf1365d2e71100f6e7a21101abc084d87fc733ebbc2e437105126f8ebc95807d74b86720662002617ef4b791cd2009619d7942bbc8c6218b5249da07805888c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkPrettyPrintModule-6bf1365d2e71100f6e7a21101abc084d87fc733ebbc2e437105126f8ebc95807d74b86720662002617ef4b791cd2009619d7942bbc8c6218b5249da07805888c"' :
                                            'id="xs-components-links-module-StarkPrettyPrintModule-6bf1365d2e71100f6e7a21101abc084d87fc733ebbc2e437105126f8ebc95807d74b86720662002617ef4b791cd2009619d7942bbc8c6218b5249da07805888c"' }>
                                            <li class="link">
                                                <a href="components/StarkPrettyPrintComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkPrettyPrintComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkProgressIndicatorModule.html" data-type="entity-link" >StarkProgressIndicatorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' : 'data-target="#xs-components-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' :
                                            'id="xs-components-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' }>
                                            <li class="link">
                                                <a href="components/StarkProgressIndicatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkProgressIndicatorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' : 'data-target="#xs-directives-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' :
                                        'id="xs-directives-links-module-StarkProgressIndicatorModule-9c1fdc6043c7d6f05ba91b3c9fd238b8ce9eab64ef4fda4e80fb6988bad73f8816774068f4c509106c55b8f36ce23fae21e275b02b402f15774aacad98e690fe"' }>
                                        <li class="link">
                                            <a href="directives/StarkProgressIndicatorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkProgressIndicatorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkRestrictInputDirectiveModule.html" data-type="entity-link" >StarkRestrictInputDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkRestrictInputDirectiveModule-ae281ee54798af63d91989404d7f0c3e9337370210b35164ec8d797b38712d1c242dcd1866b292b5ef72d5d836921a6e2c60ac77378ec5196b532cac5f6b9c11"' : 'data-target="#xs-directives-links-module-StarkRestrictInputDirectiveModule-ae281ee54798af63d91989404d7f0c3e9337370210b35164ec8d797b38712d1c242dcd1866b292b5ef72d5d836921a6e2c60ac77378ec5196b532cac5f6b9c11"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkRestrictInputDirectiveModule-ae281ee54798af63d91989404d7f0c3e9337370210b35164ec8d797b38712d1c242dcd1866b292b5ef72d5d836921a6e2c60ac77378ec5196b532cac5f6b9c11"' :
                                        'id="xs-directives-links-module-StarkRestrictInputDirectiveModule-ae281ee54798af63d91989404d7f0c3e9337370210b35164ec8d797b38712d1c242dcd1866b292b5ef72d5d836921a6e2c60ac77378ec5196b532cac5f6b9c11"' }>
                                        <li class="link">
                                            <a href="directives/StarkRestrictInputDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkRestrictInputDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkRouteSearchModule.html" data-type="entity-link" >StarkRouteSearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkRouteSearchModule-d14bf33ce48b54da17472b28863e0aed79297cacae171dfc9918ddbdfdefedab5e4e49dc2bbd722e4bab4b19b9c6b09205df1f9800ed3263d6969e8a2e660f6c"' : 'data-target="#xs-components-links-module-StarkRouteSearchModule-d14bf33ce48b54da17472b28863e0aed79297cacae171dfc9918ddbdfdefedab5e4e49dc2bbd722e4bab4b19b9c6b09205df1f9800ed3263d6969e8a2e660f6c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkRouteSearchModule-d14bf33ce48b54da17472b28863e0aed79297cacae171dfc9918ddbdfdefedab5e4e49dc2bbd722e4bab4b19b9c6b09205df1f9800ed3263d6969e8a2e660f6c"' :
                                            'id="xs-components-links-module-StarkRouteSearchModule-d14bf33ce48b54da17472b28863e0aed79297cacae171dfc9918ddbdfdefedab5e4e49dc2bbd722e4bab4b19b9c6b09205df1f9800ed3263d6969e8a2e660f6c"' }>
                                            <li class="link">
                                                <a href="components/StarkRouteSearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkRouteSearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSessionUiModule.html" data-type="entity-link" >StarkSessionUiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkSessionUiModule-552f668f1a52b25587b1f3042bf34db55cccb8618631ae2423371b1f0a1a4aef5be958d4e8bb14cfa8e3ba607f4bc3712544b4d0187b4257706a5235dc96eacc"' : 'data-target="#xs-components-links-module-StarkSessionUiModule-552f668f1a52b25587b1f3042bf34db55cccb8618631ae2423371b1f0a1a4aef5be958d4e8bb14cfa8e3ba607f4bc3712544b4d0187b4257706a5235dc96eacc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkSessionUiModule-552f668f1a52b25587b1f3042bf34db55cccb8618631ae2423371b1f0a1a4aef5be958d4e8bb14cfa8e3ba607f4bc3712544b4d0187b4257706a5235dc96eacc"' :
                                            'id="xs-components-links-module-StarkSessionUiModule-552f668f1a52b25587b1f3042bf34db55cccb8618631ae2423371b1f0a1a4aef5be958d4e8bb14cfa8e3ba607f4bc3712544b4d0187b4257706a5235dc96eacc"' }>
                                            <li class="link">
                                                <a href="components/StarkLoginPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkLoginPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkPreloadingPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkPreloadingPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkSessionCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionExpiredPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkSessionExpiredPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionLogoutPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkSessionLogoutPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionTimeoutWarningDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkSessionTimeoutWarningDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSliderModule.html" data-type="entity-link" >StarkSliderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkSliderModule-ea9433aa5cb792876eddd3a8e1cf83babaa854b251670a3f02b0d875b240245732886abeaeba2e752c12baf1650b552d2244f1ac66a114772a97420fbc95d072"' : 'data-target="#xs-components-links-module-StarkSliderModule-ea9433aa5cb792876eddd3a8e1cf83babaa854b251670a3f02b0d875b240245732886abeaeba2e752c12baf1650b552d2244f1ac66a114772a97420fbc95d072"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkSliderModule-ea9433aa5cb792876eddd3a8e1cf83babaa854b251670a3f02b0d875b240245732886abeaeba2e752c12baf1650b552d2244f1ac66a114772a97420fbc95d072"' :
                                            'id="xs-components-links-module-StarkSliderModule-ea9433aa5cb792876eddd3a8e1cf83babaa854b251670a3f02b0d875b240245732886abeaeba2e752c12baf1650b552d2244f1ac66a114772a97420fbc95d072"' }>
                                            <li class="link">
                                                <a href="components/StarkSliderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkSliderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSvgViewBoxModule.html" data-type="entity-link" >StarkSvgViewBoxModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkSvgViewBoxModule-1520dc3939851a994390907d67fe6af93ccc7e6115e190bb3bf36608bc16dd12537d160e014b3706e3e83fa4680fceacf77bcb52a2f50281a39fb93dc14d6a4c"' : 'data-target="#xs-directives-links-module-StarkSvgViewBoxModule-1520dc3939851a994390907d67fe6af93ccc7e6115e190bb3bf36608bc16dd12537d160e014b3706e3e83fa4680fceacf77bcb52a2f50281a39fb93dc14d6a4c"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkSvgViewBoxModule-1520dc3939851a994390907d67fe6af93ccc7e6115e190bb3bf36608bc16dd12537d160e014b3706e3e83fa4680fceacf77bcb52a2f50281a39fb93dc14d6a4c"' :
                                        'id="xs-directives-links-module-StarkSvgViewBoxModule-1520dc3939851a994390907d67fe6af93ccc7e6115e190bb3bf36608bc16dd12537d160e014b3706e3e83fa4680fceacf77bcb52a2f50281a39fb93dc14d6a4c"' }>
                                        <li class="link">
                                            <a href="directives/StarkSvgViewBoxDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkSvgViewBoxDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkTableModule.html" data-type="entity-link" >StarkTableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' : 'data-target="#xs-components-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' :
                                            'id="xs-components-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' }>
                                            <li class="link">
                                                <a href="components/StarkTableColumnComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTableColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkTableMultisortDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTableMultisortDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' : 'data-target="#xs-directives-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' :
                                        'id="xs-directives-links-module-StarkTableModule-2ca86f9d43f4358c209923341b8cc2f8e8a5a8cc1f508939dd81c34cce344f44b5f83ecfffed842133d401c5f76b3c82685d0736c0b869d99c97d99d2c1a7b71"' }>
                                        <li class="link">
                                            <a href="directives/StarkTableExpandDetailDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTableExpandDetailDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkTableRowContentDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTableRowContentDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkToastNotificationModule.html" data-type="entity-link" >StarkToastNotificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkToastNotificationModule-855a352e839005f811e79a788a1c6ddc8ba516962c07aa4794c9a8b22e66c9ef5f73ba7b910dc7946c3af0a018e14fc4c7e6cc8650a08cd96b6d25d5470ee393"' : 'data-target="#xs-components-links-module-StarkToastNotificationModule-855a352e839005f811e79a788a1c6ddc8ba516962c07aa4794c9a8b22e66c9ef5f73ba7b910dc7946c3af0a018e14fc4c7e6cc8650a08cd96b6d25d5470ee393"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkToastNotificationModule-855a352e839005f811e79a788a1c6ddc8ba516962c07aa4794c9a8b22e66c9ef5f73ba7b910dc7946c3af0a018e14fc4c7e6cc8650a08cd96b6d25d5470ee393"' :
                                            'id="xs-components-links-module-StarkToastNotificationModule-855a352e839005f811e79a788a1c6ddc8ba516962c07aa4794c9a8b22e66c9ef5f73ba7b910dc7946c3af0a018e14fc4c7e6cc8650a08cd96b6d25d5470ee393"' }>
                                            <li class="link">
                                                <a href="components/StarkToastNotificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkToastNotificationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkTransformInputDirectiveModule.html" data-type="entity-link" >StarkTransformInputDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkTransformInputDirectiveModule-70d2a2ca8649ec58052df18effedb432f65b054573e12d0e8a7c497cc8699d9cf6edcafd08ae36691a6bec7c41a58f50c6c553d96f76a8bfe48371ea8267f5c1"' : 'data-target="#xs-directives-links-module-StarkTransformInputDirectiveModule-70d2a2ca8649ec58052df18effedb432f65b054573e12d0e8a7c497cc8699d9cf6edcafd08ae36691a6bec7c41a58f50c6c553d96f76a8bfe48371ea8267f5c1"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkTransformInputDirectiveModule-70d2a2ca8649ec58052df18effedb432f65b054573e12d0e8a7c497cc8699d9cf6edcafd08ae36691a6bec7c41a58f50c6c553d96f76a8bfe48371ea8267f5c1"' :
                                        'id="xs-directives-links-module-StarkTransformInputDirectiveModule-70d2a2ca8649ec58052df18effedb432f65b054573e12d0e8a7c497cc8699d9cf6edcafd08ae36691a6bec7c41a58f50c6c553d96f76a8bfe48371ea8267f5c1"' }>
                                        <li class="link">
                                            <a href="directives/StarkTransformInputDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarkTransformInputDirective</a>
                                        </li>
                                    </ul>
                                </li>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/StarkActionBarComponent.html" data-type="entity-link" >StarkActionBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAlertDialogComponent.html" data-type="entity-link" >StarkAlertDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppDataComponent.html" data-type="entity-link" >StarkAppDataComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppFooterComponent.html" data-type="entity-link" >StarkAppFooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppLogoComponent.html" data-type="entity-link" >StarkAppLogoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppLogoutComponent.html" data-type="entity-link" >StarkAppLogoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppMenuComponent.html" data-type="entity-link" >StarkAppMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppMenuItemComponent.html" data-type="entity-link" >StarkAppMenuItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppSidebarComponent.html" data-type="entity-link" >StarkAppSidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkBreadcrumbComponent.html" data-type="entity-link" >StarkBreadcrumbComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkCollapsibleComponent.html" data-type="entity-link" >StarkCollapsibleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkConfirmDialogComponent.html" data-type="entity-link" >StarkConfirmDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkDatePickerComponent.html" data-type="entity-link" >StarkDatePickerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkDateRangePickerComponent.html" data-type="entity-link" >StarkDateRangePickerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkDropdownComponent.html" data-type="entity-link" >StarkDropdownComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkGenericSearchComponent.html" data-type="entity-link" >StarkGenericSearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkLanguageSelectorComponent.html" data-type="entity-link" >StarkLanguageSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkLoginPageComponent.html" data-type="entity-link" >StarkLoginPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkMessagePaneComponent.html" data-type="entity-link" >StarkMessagePaneComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkMinimapComponent.html" data-type="entity-link" >StarkMinimapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPaginationComponent.html" data-type="entity-link" >StarkPaginationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPreloadingPageComponent.html" data-type="entity-link" >StarkPreloadingPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPrettyPrintComponent.html" data-type="entity-link" >StarkPrettyPrintComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkProgressIndicatorComponent.html" data-type="entity-link" >StarkProgressIndicatorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPromptDialogComponent.html" data-type="entity-link" >StarkPromptDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkRouteSearchComponent.html" data-type="entity-link" >StarkRouteSearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkSessionExpiredPageComponent.html" data-type="entity-link" >StarkSessionExpiredPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkSessionLogoutPageComponent.html" data-type="entity-link" >StarkSessionLogoutPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkSliderComponent.html" data-type="entity-link" >StarkSliderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkTableColumnComponent.html" data-type="entity-link" >StarkTableColumnComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkTableComponent.html" data-type="entity-link" >StarkTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkToastNotificationComponent.html" data-type="entity-link" >StarkToastNotificationComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/AbstractStarkFormComponent.html" data-type="entity-link" >AbstractStarkFormComponent</a>
                                </li>
                                <li class="link">
                                    <a href="directives/AbstractStarkSearchComponent.html" data-type="entity-link" >AbstractStarkSearchComponent</a>
                                </li>
                                <li class="link">
                                    <a href="directives/AbstractStarkUiComponent.html" data-type="entity-link" >AbstractStarkUiComponent</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkEmailMaskDirective.html" data-type="entity-link" >StarkEmailMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkNumberMaskDirective.html" data-type="entity-link" >StarkNumberMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkProgressIndicatorDirective.html" data-type="entity-link" >StarkProgressIndicatorDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkRestrictInputDirective.html" data-type="entity-link" >StarkRestrictInputDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkSvgViewBoxDirective.html" data-type="entity-link" >StarkSvgViewBoxDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkTextMaskDirective.html" data-type="entity-link" >StarkTextMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkTimestampMaskDirective.html" data-type="entity-link" >StarkTimestampMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkTransformInputDirective.html" data-type="entity-link" >StarkTransformInputDirective</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/MockStarkAppSidebarService.html" data-type="entity-link" >MockStarkAppSidebarService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MockStarkMessagePaneService.html" data-type="entity-link" >MockStarkMessagePaneService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MockStarkProgressIndicatorService.html" data-type="entity-link" >MockStarkProgressIndicatorService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MockStarkToastNotificationService.html" data-type="entity-link" >MockStarkToastNotificationService</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkDOMUtil.html" data-type="entity-link" >StarkDOMUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkFormUtil.html" data-type="entity-link" >StarkFormUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSessionUiConfig.html" data-type="entity-link" >StarkSessionUiConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkTextMasks.html" data-type="entity-link" >StarkTextMasks</a>
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
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/StarkMessagePaneEffects.html" data-type="entity-link" >StarkMessagePaneEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StarkPrettyPrintServiceImpl.html" data-type="entity-link" >StarkPrettyPrintServiceImpl</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StarkSessionTimeoutWarningDialogEffects.html" data-type="entity-link" >StarkSessionTimeoutWarningDialogEffects</a>
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
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/StarkAction.html" data-type="entity-link" >StarkAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkActionBarConfig.html" data-type="entity-link" >StarkActionBarConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkActionBase.html" data-type="entity-link" >StarkActionBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkAlertDialogContent.html" data-type="entity-link" >StarkAlertDialogContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkAppSidebarOpenEvent.html" data-type="entity-link" >StarkAppSidebarOpenEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkAppSidebarService.html" data-type="entity-link" >StarkAppSidebarService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkBaseDialogContent.html" data-type="entity-link" >StarkBaseDialogContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkBreadcrumbConfig.html" data-type="entity-link" >StarkBreadcrumbConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkBreadcrumbPath.html" data-type="entity-link" >StarkBreadcrumbPath</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkColumnCellClickedOutput.html" data-type="entity-link" >StarkColumnCellClickedOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkColumnFilterChangedOutput.html" data-type="entity-link" >StarkColumnFilterChangedOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkColumnSortChangedOutput.html" data-type="entity-link" >StarkColumnSortChangedOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkConfirmDialogContent.html" data-type="entity-link" >StarkConfirmDialogContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkCustomizablePredefinedAction.html" data-type="entity-link" >StarkCustomizablePredefinedAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkDateRangePickerEvent.html" data-type="entity-link" >StarkDateRangePickerEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkDefaultPredefinedAction.html" data-type="entity-link" >StarkDefaultPredefinedAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkFormButton.html" data-type="entity-link" >StarkFormButton</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkFormButtonBase.html" data-type="entity-link" >StarkFormButtonBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkFormCustomizablePredefinedButton.html" data-type="entity-link" >StarkFormCustomizablePredefinedButton</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkFormDefaultPredefinedButton.html" data-type="entity-link" >StarkFormDefaultPredefinedButton</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkGenericSearchActionBarConfig.html" data-type="entity-link" >StarkGenericSearchActionBarConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkGenericSearchFormButtonsConfig.html" data-type="entity-link" >StarkGenericSearchFormButtonsConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkGenericSearchService.html" data-type="entity-link" >StarkGenericSearchService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuConfig.html" data-type="entity-link" >StarkMenuConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuEntry.html" data-type="entity-link" >StarkMenuEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuGroup.html" data-type="entity-link" >StarkMenuGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuSection.html" data-type="entity-link" >StarkMenuSection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessage.html" data-type="entity-link" >StarkMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessageCollection.html" data-type="entity-link" >StarkMessageCollection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessagePaneService.html" data-type="entity-link" >StarkMessagePaneService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessageState.html" data-type="entity-link" >StarkMessageState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMinimapItemProperties.html" data-type="entity-link" >StarkMinimapItemProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkNumberMaskConfig.html" data-type="entity-link" >StarkNumberMaskConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPaginateEvent.html" data-type="entity-link" >StarkPaginateEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPaginationConfig.html" data-type="entity-link" >StarkPaginationConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPrettyPrintService.html" data-type="entity-link" >StarkPrettyPrintService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorConfig.html" data-type="entity-link" >StarkProgressIndicatorConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorFullConfig.html" data-type="entity-link" >StarkProgressIndicatorFullConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorService.html" data-type="entity-link" >StarkProgressIndicatorService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorState.html" data-type="entity-link" >StarkProgressIndicatorState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPromptDialogContent.html" data-type="entity-link" >StarkPromptDialogContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkRouteSearchEntry.html" data-type="entity-link" >StarkRouteSearchEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSearchFormComponent.html" data-type="entity-link" >StarkSearchFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSearchState.html" data-type="entity-link" >StarkSearchState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSliderConfig.html" data-type="entity-link" >StarkSliderConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSliderFormatter.html" data-type="entity-link" >StarkSliderFormatter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSliderPips.html" data-type="entity-link" >StarkSliderPips</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSortingRule.html" data-type="entity-link" >StarkSortingRule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTableColumnFilter.html" data-type="entity-link" >StarkTableColumnFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTableColumnProperties.html" data-type="entity-link" >StarkTableColumnProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTableFilter.html" data-type="entity-link" >StarkTableFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTableMultisortDialogData.html" data-type="entity-link" >StarkTableMultisortDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTableRowActions.html" data-type="entity-link" >StarkTableRowActions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTextMaskBaseConfig.html" data-type="entity-link" >StarkTextMaskBaseConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTextMaskConfig.html" data-type="entity-link" >StarkTextMaskConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTimestampMaskConfig.html" data-type="entity-link" >StarkTimestampMaskConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkToastMessage.html" data-type="entity-link" >StarkToastMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkToastNotificationOptions.html" data-type="entity-link" >StarkToastNotificationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkToastNotificationService.html" data-type="entity-link" >StarkToastNotificationService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkUIApplicationState.html" data-type="entity-link" >StarkUIApplicationState</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
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