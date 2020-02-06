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
                                <a href="modules/StarkActionBarModule.html" data-type="entity-link">StarkActionBarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkActionBarModule-3db30f0db65f18af1c6d312a9c3cb4f9"' : 'data-target="#xs-components-links-module-StarkActionBarModule-3db30f0db65f18af1c6d312a9c3cb4f9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkActionBarModule-3db30f0db65f18af1c6d312a9c3cb4f9"' :
                                            'id="xs-components-links-module-StarkActionBarModule-3db30f0db65f18af1c6d312a9c3cb4f9"' }>
                                            <li class="link">
                                                <a href="components/StarkActionBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkActionBarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppDataModule.html" data-type="entity-link">StarkAppDataModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppDataModule-1ec57ba8e9ea9a1794ed1e9886b6dc77"' : 'data-target="#xs-components-links-module-StarkAppDataModule-1ec57ba8e9ea9a1794ed1e9886b6dc77"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppDataModule-1ec57ba8e9ea9a1794ed1e9886b6dc77"' :
                                            'id="xs-components-links-module-StarkAppDataModule-1ec57ba8e9ea9a1794ed1e9886b6dc77"' }>
                                            <li class="link">
                                                <a href="components/StarkAppDataComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppDataComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppFooterModule.html" data-type="entity-link">StarkAppFooterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppFooterModule-e1ed5103f17ca9fe57b0f04b4b7b4180"' : 'data-target="#xs-components-links-module-StarkAppFooterModule-e1ed5103f17ca9fe57b0f04b4b7b4180"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppFooterModule-e1ed5103f17ca9fe57b0f04b4b7b4180"' :
                                            'id="xs-components-links-module-StarkAppFooterModule-e1ed5103f17ca9fe57b0f04b4b7b4180"' }>
                                            <li class="link">
                                                <a href="components/StarkAppFooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppFooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppLogoModule.html" data-type="entity-link">StarkAppLogoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' : 'data-target="#xs-components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' :
                                            'id="xs-components-links-module-StarkAppLogoModule-c6c89beeeb9e9f93408d1eeb7f7f5a31"' }>
                                            <li class="link">
                                                <a href="components/StarkAppLogoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppLogoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppLogoutModule.html" data-type="entity-link">StarkAppLogoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppLogoutModule-14e91a22866e3c76d74f4ce3e98a0a7a"' : 'data-target="#xs-components-links-module-StarkAppLogoutModule-14e91a22866e3c76d74f4ce3e98a0a7a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppLogoutModule-14e91a22866e3c76d74f4ce3e98a0a7a"' :
                                            'id="xs-components-links-module-StarkAppLogoutModule-14e91a22866e3c76d74f4ce3e98a0a7a"' }>
                                            <li class="link">
                                                <a href="components/StarkAppLogoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppLogoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppMenuModule.html" data-type="entity-link">StarkAppMenuModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppMenuModule-f1ead867aefdc8f7a6c23b6c571d5948"' : 'data-target="#xs-components-links-module-StarkAppMenuModule-f1ead867aefdc8f7a6c23b6c571d5948"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppMenuModule-f1ead867aefdc8f7a6c23b6c571d5948"' :
                                            'id="xs-components-links-module-StarkAppMenuModule-f1ead867aefdc8f7a6c23b6c571d5948"' }>
                                            <li class="link">
                                                <a href="components/StarkAppMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkAppMenuItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppMenuItemComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkAppSidebarModule.html" data-type="entity-link">StarkAppSidebarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkAppSidebarModule-659ee10af367fabd4d14efaf1ee2b634"' : 'data-target="#xs-components-links-module-StarkAppSidebarModule-659ee10af367fabd4d14efaf1ee2b634"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkAppSidebarModule-659ee10af367fabd4d14efaf1ee2b634"' :
                                            'id="xs-components-links-module-StarkAppSidebarModule-659ee10af367fabd4d14efaf1ee2b634"' }>
                                            <li class="link">
                                                <a href="components/StarkAppSidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAppSidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkBreadcrumbModule.html" data-type="entity-link">StarkBreadcrumbModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' : 'data-target="#xs-components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' :
                                            'id="xs-components-links-module-StarkBreadcrumbModule-7d606ebd0b78ef279a22e2f6515a588e"' }>
                                            <li class="link">
                                                <a href="components/StarkBreadcrumbComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkBreadcrumbComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkCollapsibleModule.html" data-type="entity-link">StarkCollapsibleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' : 'data-target="#xs-components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' :
                                            'id="xs-components-links-module-StarkCollapsibleModule-e629e32ea9b195a9292410678d2c094b"' }>
                                            <li class="link">
                                                <a href="components/StarkCollapsibleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkCollapsibleComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDatePickerModule.html" data-type="entity-link">StarkDatePickerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDatePickerModule-af8c171efcfd261772e1c578c2df7046"' : 'data-target="#xs-components-links-module-StarkDatePickerModule-af8c171efcfd261772e1c578c2df7046"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDatePickerModule-af8c171efcfd261772e1c578c2df7046"' :
                                            'id="xs-components-links-module-StarkDatePickerModule-af8c171efcfd261772e1c578c2df7046"' }>
                                            <li class="link">
                                                <a href="components/StarkDatePickerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkDatePickerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDateRangePickerModule.html" data-type="entity-link">StarkDateRangePickerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDateRangePickerModule-65881a6ff5ed9d3aff6ad868ff2a117a"' : 'data-target="#xs-components-links-module-StarkDateRangePickerModule-65881a6ff5ed9d3aff6ad868ff2a117a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDateRangePickerModule-65881a6ff5ed9d3aff6ad868ff2a117a"' :
                                            'id="xs-components-links-module-StarkDateRangePickerModule-65881a6ff5ed9d3aff6ad868ff2a117a"' }>
                                            <li class="link">
                                                <a href="components/StarkDateRangePickerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkDateRangePickerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDateTimePickerModule.html" data-type="entity-link">StarkDateTimePickerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDateTimePickerModule-af6b210472e2f32cbb4ed697ca7dfda5"' : 'data-target="#xs-components-links-module-StarkDateTimePickerModule-af6b210472e2f32cbb4ed697ca7dfda5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDateTimePickerModule-af6b210472e2f32cbb4ed697ca7dfda5"' :
                                            'id="xs-components-links-module-StarkDateTimePickerModule-af6b210472e2f32cbb4ed697ca7dfda5"' }>
                                            <li class="link">
                                                <a href="components/StarkDateTimePickerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkDateTimePickerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDialogsModule.html" data-type="entity-link">StarkDialogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDialogsModule-e8e046c12825d20ef2a28d7af244c6e2"' : 'data-target="#xs-components-links-module-StarkDialogsModule-e8e046c12825d20ef2a28d7af244c6e2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDialogsModule-e8e046c12825d20ef2a28d7af244c6e2"' :
                                            'id="xs-components-links-module-StarkDialogsModule-e8e046c12825d20ef2a28d7af244c6e2"' }>
                                            <li class="link">
                                                <a href="components/StarkAlertDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkAlertDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkConfirmDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkConfirmDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkPromptDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkPromptDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkDropdownModule.html" data-type="entity-link">StarkDropdownModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkDropdownModule-a3522b2c0a5a6b100bb009e5c167b0b3"' : 'data-target="#xs-components-links-module-StarkDropdownModule-a3522b2c0a5a6b100bb009e5c167b0b3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkDropdownModule-a3522b2c0a5a6b100bb009e5c167b0b3"' :
                                            'id="xs-components-links-module-StarkDropdownModule-a3522b2c0a5a6b100bb009e5c167b0b3"' }>
                                            <li class="link">
                                                <a href="components/StarkDropdownComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkDropdownComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkGenericSearchModule.html" data-type="entity-link">StarkGenericSearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkGenericSearchModule-69b7f0f9f9e58ba5b5b295b428081ffa"' : 'data-target="#xs-components-links-module-StarkGenericSearchModule-69b7f0f9f9e58ba5b5b295b428081ffa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkGenericSearchModule-69b7f0f9f9e58ba5b5b295b428081ffa"' :
                                            'id="xs-components-links-module-StarkGenericSearchModule-69b7f0f9f9e58ba5b5b295b428081ffa"' }>
                                            <li class="link">
                                                <a href="components/StarkGenericSearchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkGenericSearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkInputMaskDirectivesModule.html" data-type="entity-link">StarkInputMaskDirectivesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkInputMaskDirectivesModule-0233c34f288df175c1a393ca6a244209"' : 'data-target="#xs-directives-links-module-StarkInputMaskDirectivesModule-0233c34f288df175c1a393ca6a244209"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkInputMaskDirectivesModule-0233c34f288df175c1a393ca6a244209"' :
                                        'id="xs-directives-links-module-StarkInputMaskDirectivesModule-0233c34f288df175c1a393ca6a244209"' }>
                                        <li class="link">
                                            <a href="directives/StarkEmailMaskDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkEmailMaskDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkNumberMaskDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkNumberMaskDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkTextMaskDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTextMaskDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/StarkTimestampMaskDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTimestampMaskDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkLanguageSelectorModule.html" data-type="entity-link">StarkLanguageSelectorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkLanguageSelectorModule-80a2c5c270c6e5c4542db0a7bcfd448c"' : 'data-target="#xs-components-links-module-StarkLanguageSelectorModule-80a2c5c270c6e5c4542db0a7bcfd448c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkLanguageSelectorModule-80a2c5c270c6e5c4542db0a7bcfd448c"' :
                                            'id="xs-components-links-module-StarkLanguageSelectorModule-80a2c5c270c6e5c4542db0a7bcfd448c"' }>
                                            <li class="link">
                                                <a href="components/StarkLanguageSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkLanguageSelectorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkMessagePaneModule.html" data-type="entity-link">StarkMessagePaneModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkMessagePaneModule-c638bd2c4aa5de7a856fde5b63ff1c5b"' : 'data-target="#xs-components-links-module-StarkMessagePaneModule-c638bd2c4aa5de7a856fde5b63ff1c5b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkMessagePaneModule-c638bd2c4aa5de7a856fde5b63ff1c5b"' :
                                            'id="xs-components-links-module-StarkMessagePaneModule-c638bd2c4aa5de7a856fde5b63ff1c5b"' }>
                                            <li class="link">
                                                <a href="components/StarkMessagePaneComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkMessagePaneComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkMinimapModule.html" data-type="entity-link">StarkMinimapModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkMinimapModule-fa41848516ad14be0a187b86476c8404"' : 'data-target="#xs-components-links-module-StarkMinimapModule-fa41848516ad14be0a187b86476c8404"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkMinimapModule-fa41848516ad14be0a187b86476c8404"' :
                                            'id="xs-components-links-module-StarkMinimapModule-fa41848516ad14be0a187b86476c8404"' }>
                                            <li class="link">
                                                <a href="components/StarkMinimapComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkMinimapComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkPaginationModule.html" data-type="entity-link">StarkPaginationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkPaginationModule-c89296f497f45052b0f082acc16adb7c"' : 'data-target="#xs-components-links-module-StarkPaginationModule-c89296f497f45052b0f082acc16adb7c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkPaginationModule-c89296f497f45052b0f082acc16adb7c"' :
                                            'id="xs-components-links-module-StarkPaginationModule-c89296f497f45052b0f082acc16adb7c"' }>
                                            <li class="link">
                                                <a href="components/StarkPaginationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkPaginationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkPrettyPrintModule.html" data-type="entity-link">StarkPrettyPrintModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' : 'data-target="#xs-components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' :
                                            'id="xs-components-links-module-StarkPrettyPrintModule-ffbaba7367b83b97a37c74222627f4f2"' }>
                                            <li class="link">
                                                <a href="components/StarkPrettyPrintComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkPrettyPrintComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkProgressIndicatorModule.html" data-type="entity-link">StarkProgressIndicatorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' : 'data-target="#xs-components-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' :
                                            'id="xs-components-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' }>
                                            <li class="link">
                                                <a href="components/StarkProgressIndicatorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkProgressIndicatorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' : 'data-target="#xs-directives-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' :
                                        'id="xs-directives-links-module-StarkProgressIndicatorModule-be72bf601bedc16bb6978bf139543528"' }>
                                        <li class="link">
                                            <a href="directives/StarkProgressIndicatorDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkProgressIndicatorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkRestrictInputDirectiveModule.html" data-type="entity-link">StarkRestrictInputDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkRestrictInputDirectiveModule-93b6cce7605ea145fc1dec171402f5aa"' : 'data-target="#xs-directives-links-module-StarkRestrictInputDirectiveModule-93b6cce7605ea145fc1dec171402f5aa"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkRestrictInputDirectiveModule-93b6cce7605ea145fc1dec171402f5aa"' :
                                        'id="xs-directives-links-module-StarkRestrictInputDirectiveModule-93b6cce7605ea145fc1dec171402f5aa"' }>
                                        <li class="link">
                                            <a href="directives/StarkRestrictInputDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkRestrictInputDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkRouteSearchModule.html" data-type="entity-link">StarkRouteSearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkRouteSearchModule-e08b515d25805b9a2489f002d8499159"' : 'data-target="#xs-components-links-module-StarkRouteSearchModule-e08b515d25805b9a2489f002d8499159"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkRouteSearchModule-e08b515d25805b9a2489f002d8499159"' :
                                            'id="xs-components-links-module-StarkRouteSearchModule-e08b515d25805b9a2489f002d8499159"' }>
                                            <li class="link">
                                                <a href="components/StarkRouteSearchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkRouteSearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSessionUiModule.html" data-type="entity-link">StarkSessionUiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkSessionUiModule-22ed662479f2024b7f9b78f04c853551"' : 'data-target="#xs-components-links-module-StarkSessionUiModule-22ed662479f2024b7f9b78f04c853551"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkSessionUiModule-22ed662479f2024b7f9b78f04c853551"' :
                                            'id="xs-components-links-module-StarkSessionUiModule-22ed662479f2024b7f9b78f04c853551"' }>
                                            <li class="link">
                                                <a href="components/StarkLoginPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkLoginPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkPreloadingPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkPreloadingPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSessionCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionExpiredPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSessionExpiredPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionLogoutPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSessionLogoutPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkSessionTimeoutWarningDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSessionTimeoutWarningDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSliderModule.html" data-type="entity-link">StarkSliderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' : 'data-target="#xs-components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' :
                                            'id="xs-components-links-module-StarkSliderModule-1812430e9c4aa6740abcca7ba0d8e887"' }>
                                            <li class="link">
                                                <a href="components/StarkSliderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSliderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkSvgViewBoxModule.html" data-type="entity-link">StarkSvgViewBoxModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' : 'data-target="#xs-directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' :
                                        'id="xs-directives-links-module-StarkSvgViewBoxModule-c66a4efeaa2b906a1825dfc313cfb182"' }>
                                        <li class="link">
                                            <a href="directives/StarkSvgViewBoxDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkSvgViewBoxDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkTableModule.html" data-type="entity-link">StarkTableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkTableModule-1aff250c936aab842f16c5db35446bb0"' : 'data-target="#xs-components-links-module-StarkTableModule-1aff250c936aab842f16c5db35446bb0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkTableModule-1aff250c936aab842f16c5db35446bb0"' :
                                            'id="xs-components-links-module-StarkTableModule-1aff250c936aab842f16c5db35446bb0"' }>
                                            <li class="link">
                                                <a href="components/StarkTableColumnComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTableColumnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkTableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarkTableMultisortDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTableMultisortDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkToastNotificationModule.html" data-type="entity-link">StarkToastNotificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StarkToastNotificationModule-45b028c65d9f19e4017510d6cc68743a"' : 'data-target="#xs-components-links-module-StarkToastNotificationModule-45b028c65d9f19e4017510d6cc68743a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StarkToastNotificationModule-45b028c65d9f19e4017510d6cc68743a"' :
                                            'id="xs-components-links-module-StarkToastNotificationModule-45b028c65d9f19e4017510d6cc68743a"' }>
                                            <li class="link">
                                                <a href="components/StarkToastNotificationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkToastNotificationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarkTransformInputDirectiveModule.html" data-type="entity-link">StarkTransformInputDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StarkTransformInputDirectiveModule-0b17bff339bf764e7fad60a2f2df26a4"' : 'data-target="#xs-directives-links-module-StarkTransformInputDirectiveModule-0b17bff339bf764e7fad60a2f2df26a4"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StarkTransformInputDirectiveModule-0b17bff339bf764e7fad60a2f2df26a4"' :
                                        'id="xs-directives-links-module-StarkTransformInputDirectiveModule-0b17bff339bf764e7fad60a2f2df26a4"' }>
                                        <li class="link">
                                            <a href="directives/StarkTransformInputDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StarkTransformInputDirective</a>
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
                                <a href="components/StarkActionBarComponent.html" data-type="entity-link">StarkActionBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAlertDialogComponent.html" data-type="entity-link">StarkAlertDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppDataComponent.html" data-type="entity-link">StarkAppDataComponent</a>
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
                                <a href="components/StarkAppMenuComponent.html" data-type="entity-link">StarkAppMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkAppMenuItemComponent.html" data-type="entity-link">StarkAppMenuItemComponent</a>
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
                                <a href="components/StarkConfirmDialogComponent.html" data-type="entity-link">StarkConfirmDialogComponent</a>
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
                                <a href="components/StarkGenericSearchComponent.html" data-type="entity-link">StarkGenericSearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkLanguageSelectorComponent.html" data-type="entity-link">StarkLanguageSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkLoginPageComponent.html" data-type="entity-link">StarkLoginPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkMessagePaneComponent.html" data-type="entity-link">StarkMessagePaneComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkMinimapComponent.html" data-type="entity-link">StarkMinimapComponent</a>
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
                                <a href="components/StarkProgressIndicatorComponent.html" data-type="entity-link">StarkProgressIndicatorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkPromptDialogComponent.html" data-type="entity-link">StarkPromptDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StarkRouteSearchComponent.html" data-type="entity-link">StarkRouteSearchComponent</a>
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
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/StarkEmailMaskDirective.html" data-type="entity-link">StarkEmailMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkNumberMaskDirective.html" data-type="entity-link">StarkNumberMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkProgressIndicatorDirective.html" data-type="entity-link">StarkProgressIndicatorDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkRestrictInputDirective.html" data-type="entity-link">StarkRestrictInputDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkSvgViewBoxDirective.html" data-type="entity-link">StarkSvgViewBoxDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkTextMaskDirective.html" data-type="entity-link">StarkTextMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkTimestampMaskDirective.html" data-type="entity-link">StarkTimestampMaskDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StarkTransformInputDirective.html" data-type="entity-link">StarkTransformInputDirective</a>
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
                                <a href="classes/AbstractStarkFormComponent.html" data-type="entity-link">AbstractStarkFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractStarkSearchComponent.html" data-type="entity-link">AbstractStarkSearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractStarkUiComponent.html" data-type="entity-link">AbstractStarkUiComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkAddMessages.html" data-type="entity-link">StarkAddMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkClearMessages.html" data-type="entity-link">StarkClearMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkDOMUtil.html" data-type="entity-link">StarkDOMUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkFormUtil.html" data-type="entity-link">StarkFormUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkGetAllMessages.html" data-type="entity-link">StarkGetAllMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkProgressIndicatorDeregister.html" data-type="entity-link">StarkProgressIndicatorDeregister</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkProgressIndicatorHide.html" data-type="entity-link">StarkProgressIndicatorHide</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkProgressIndicatorRegister.html" data-type="entity-link">StarkProgressIndicatorRegister</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkProgressIndicatorShow.html" data-type="entity-link">StarkProgressIndicatorShow</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkRemoveMessages.html" data-type="entity-link">StarkRemoveMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkSessionUiConfig.html" data-type="entity-link">StarkSessionUiConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/StarkTextMasks.html" data-type="entity-link">StarkTextMasks</a>
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
                                    <a href="injectables/StarkMessagePaneEffects.html" data-type="entity-link">StarkMessagePaneEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StarkSessionTimeoutWarningDialogEffects.html" data-type="entity-link">StarkSessionTimeoutWarningDialogEffects</a>
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
                                <a href="interfaces/StarkAction.html" data-type="entity-link">StarkAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkActionBarConfig.html" data-type="entity-link">StarkActionBarConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkActionBase.html" data-type="entity-link">StarkActionBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkAlertDialogContent.html" data-type="entity-link">StarkAlertDialogContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkAppSidebarOpenEvent.html" data-type="entity-link">StarkAppSidebarOpenEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkAppSidebarService.html" data-type="entity-link">StarkAppSidebarService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkBaseDialogContent.html" data-type="entity-link">StarkBaseDialogContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkBreadcrumbConfig.html" data-type="entity-link">StarkBreadcrumbConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkBreadcrumbPath.html" data-type="entity-link">StarkBreadcrumbPath</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkColumnCellClickedOutput.html" data-type="entity-link">StarkColumnCellClickedOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkColumnFilterChangedOutput.html" data-type="entity-link">StarkColumnFilterChangedOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkColumnSortChangedOutput.html" data-type="entity-link">StarkColumnSortChangedOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkConfirmDialogContent.html" data-type="entity-link">StarkConfirmDialogContent</a>
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
                                <a href="interfaces/StarkFormButton.html" data-type="entity-link">StarkFormButton</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkFormButtonBase.html" data-type="entity-link">StarkFormButtonBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkFormCustomizablePredefinedButton.html" data-type="entity-link">StarkFormCustomizablePredefinedButton</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkFormDefaultPredefinedButton.html" data-type="entity-link">StarkFormDefaultPredefinedButton</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkGenericSearchActionBarConfig.html" data-type="entity-link">StarkGenericSearchActionBarConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkGenericSearchFormButtonsConfig.html" data-type="entity-link">StarkGenericSearchFormButtonsConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkGenericSearchService.html" data-type="entity-link">StarkGenericSearchService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuConfig.html" data-type="entity-link">StarkMenuConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuEntry.html" data-type="entity-link">StarkMenuEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuGroup.html" data-type="entity-link">StarkMenuGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMenuSection.html" data-type="entity-link">StarkMenuSection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessage.html" data-type="entity-link">StarkMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessageCollection.html" data-type="entity-link">StarkMessageCollection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessagePaneService.html" data-type="entity-link">StarkMessagePaneService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMessageState.html" data-type="entity-link">StarkMessageState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkMinimapItemProperties.html" data-type="entity-link">StarkMinimapItemProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkNumberMaskConfig.html" data-type="entity-link">StarkNumberMaskConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPaginateEvent.html" data-type="entity-link">StarkPaginateEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPaginationConfig.html" data-type="entity-link">StarkPaginationConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorConfig.html" data-type="entity-link">StarkProgressIndicatorConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorFullConfig.html" data-type="entity-link">StarkProgressIndicatorFullConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorService.html" data-type="entity-link">StarkProgressIndicatorService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkProgressIndicatorState.html" data-type="entity-link">StarkProgressIndicatorState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkPromptDialogContent.html" data-type="entity-link">StarkPromptDialogContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkRouteSearchEntry.html" data-type="entity-link">StarkRouteSearchEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSearchFormComponent.html" data-type="entity-link">StarkSearchFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkSearchState.html" data-type="entity-link">StarkSearchState</a>
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
                                <a href="interfaces/StarkTableRowActions.html" data-type="entity-link">StarkTableRowActions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTextMaskBaseConfig.html" data-type="entity-link">StarkTextMaskBaseConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTextMaskConfig.html" data-type="entity-link">StarkTextMaskConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarkTimestampMaskConfig.html" data-type="entity-link">StarkTimestampMaskConfig</a>
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
                            <li class="link">
                                <a href="interfaces/StarkUIApplicationState.html" data-type="entity-link">StarkUIApplicationState</a>
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