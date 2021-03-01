<p align="center">
	<a href="/packages/stark-core/assets/logo/dark/stark_logo_dark_small.png?raw=true" target="_blank" rel="noopener noreferrer">
		<img src="/packages/stark-core/assets/logo/dark/stark_logo_dark_small.png?raw=true" alt="Stark: a powerful front-end framework" style="max-width:100%;">
	</a>
</p>

> An Angular 6+ based front-end framework built on top of [Angular](https://angular.io)...
> Stark features an awesome reusable build using [Webpack](https://webpack.js.org/) and built-in support for state of the art front-end tech

[![NPM version](https://img.shields.io/npm/v/@nationalbankbelgium/stark-core.svg)](https://www.npmjs.com/package/@nationalbankbelgium/stark-core)
[![npm](https://img.shields.io/npm/dm/@nationalbankbelgium/stark-core.svg)](https://www.npmjs.com/package/@nationalbankbelgium/stark-core)
[![Build Status](https://travis-ci.org/NationalBankBelgium/stark.svg?branch=master)](https://travis-ci.org/NationalBankBelgium/stark)
[![Build Status](https://github.com/NationalBankBelgium/stark/workflows/ci/badge.svg)](https://github.com/NationalBankBelgium/stark/actions?query=workflow%3Aci)
[![Coverage Status](https://coveralls.io/repos/github/NationalBankBelgium/stark/badge.svg?branch=master)](https://coveralls.io/github/NationalBankBelgium/stark?branch=master)
[![Dependency Status](https://david-dm.org/NationalBankBelgium/stark.svg)](https://david-dm.org/NationalBankBelgium/stark)
[![devDependency Status](https://david-dm.org/NationalBankBelgium/stark/dev-status.svg)](https://david-dm.org/NationalBankBelgium/stark#info=devDependencies)
[![taylor swift](https://img.shields.io/badge/secured%20by-taylor%20swift-brightgreen.svg)](https://twitter.com/SwiftOnSecurity)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/cocoapods/l/AFNetworking.svg)](LICENSE)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=NationalBankBelgium/stark)](https://dependabot.com)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=Tm5SaUZSU2IyN3NRMUJubytEUFdrZUNSRTg1RUhoNjJSbHNFdDJGbUZ0az0tLUtza3NYT3JVdGJoNVJ1Y2Ywa3NUY2c9PQ==--f293e37574a75b6a4f37428b1ff6978c55760aa7)](https://automate.browserstack.com/public-build/Tm5SaUZSU2IyN3NRMUJubytEUFdrZUNSRTg1RUhoNjJSbHNFdDJGbUZ0az0tLUtza3NYT3JVdGJoNVJ1Y2Ywa3NUY2c9PQ==--f293e37574a75b6a4f37428b1ff6978c55760aa7)

Stark provides main building blocks for accelerating front-end development:

-   a solid reusable build based on Webpack
-   a [starter](/starter) project inspired by [Angular Starter](https://github.com/gdi2290/angular-starter) by [AngularClass](https://angularclass.com) and Google's [Web Starter Kit](https://github.com/google/web-starter-kit)
-   [core modules](https://stark.nbb.be/api-docs/stark-core/latest/) providing reusable APIs (e.g., reactive client for RESTful APIs based on [NBB's RESTful API Design Guide](https://github.com/NationalBankBelgium/REST-API-Design-Guide/wiki), routing, logging, log shipping, ...)
-   [UI modules](https://stark.nbb.be/api-docs/stark-ui/latest/) providing reusable UI components (e.g., data table, message pane, ...) and themes
-   a [showcase](https://stark.nbb.be) application containing
    -   demos of all components/services along with their API
    -   our [living style guide](https://www.smashingmagazine.com/2016/05/creating-a-living-style-guide-case-study/)
    -   our developer guide

Stark modules are like LEGO blocks: add what you need, no less, no more. If you don't like our defaults then you may replace/override/ignore anything you fancy.

## Stark's build

Stark's reusable build integrates support for:

-   Angular optimizations: [AOT](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html), lazy loading with [UI-Router](https://github.com/angular-ui/ui-router)
-   [TypeScript](https://www.typescriptlang.org/), [@types](https://www.npmjs.com/~types), [TSLint](http://palantir.github.io/tslint/), [Codelyzer](https://github.com/mgechev/codelyzer)
-   Code formatting with [Prettier](https://prettier.io/)
-   HTML templating with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
-   [PostCSS](http://postcss.org/) with CSSNext, nesting, prefixing, ...
-   [Code splitting](https://robertknight.github.io/posts/webpack-dll-plugins/)
-   [Tree shaking](https://webpack.js.org/guides/tree-shaking/) to automatically remove unused code from your production bundle
-   [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html) with [@angularclass/hmr](https://github.com/angularclass/angular-hmr) and [@angularclass/hmr-loader](https://github.com/angularclass/angular-hmr-loader)
-   Minification & uglification
-   Cache busting with file hashes
-   [Tests](https://angular.io/docs/ts/latest/guide/testing.html): [E2E](https://angular.github.io/protractor/#/faq#what-s-the-difference-between-karma-and-protractor-when-do-i-use-which-), [Karma](https://karma-runner.github.io/), [Protractor](https://angular.github.io/protractor/), [Jasmine](https://github.com/jasmine/jasmine), with source maps support, possibility to execute subsets of the tests, ...
-   Tests code coverage with [Istanbul](https://github.com/gotwarlost/istanbul)
-   Environments definition (development | production)
-   Assets copying
-   Security with a DEV mode [Content Security Policy (CSP)](https://content-security-policy.com/) enabled
-   Local testing with fake back-ends using [json-server](https://github.com/typicode/json-server)
-   Router visualization with [UI-Router Visualizer](https://github.com/ui-router/visualizer)

## Stark packaging

All the Stark packages are built following the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview) so the following bundles are provided:

-   FESM2015
-   FESM5
-   ESM2015
-   ESM5
-   UMD

So they can be consumed by [Angular CLI](https://github.com/angular/angular-cli), [Webpack](https://github.com/webpack/webpack) or [SystemJS](https://github.com/systemjs/systemjs).

## Developer guide

-   [Stark-Build](docs/stark-build/NG_CLI_BUILD_CUSTOMIZATIONS.md)
-   [Stark-Core](https://stark.nbb.be/api-docs/stark-core/latest/additional-documentation/getting-started.html)
-   [Stark-UI](https://stark.nbb.be/api-docs/stark-ui/latest/additional-documentation/getting-started.html)

## Stark monorepo documentation

-   [Common errors during development](docs/COMMON_DEV_ERRORS.md)
-   [End-to-End Testing](docs/E2E_TESTING.md)
-   [Polyfills](docs/POLYFILLS.md)
-   [Prettier](docs/PRETTIER.md)
-   [TSConfig files structure](docs/TSCONFIG.md)

## Releases

Stark releases are available on npm: https://www.npmjs.com/settings/nationalbankbelgium/packages

### Snapshot builds

Each and every day, a new snapshot of Stark is built, tested and published on npm: https://www.npmjs.com/settings/nationalbankbelgium/packages
See [this page](/SNAPSHOTS.md) for more information about the process behind this.

## Contributing

Please follow our [contribution guidelines](/CONTRIBUTING.md).

To know how to release Stark, refer to [this page](/RELEASE.md).

## Authors

### Sebastien Dubois

-   [@Twitter](https://twitter.com/dSebastien)
-   [@Medium](https://medium.com/@dSebastien)
-   [@Blog](https://www.dsebastien.net)
-   [@GitHub](https://github.com/dSebastien)

### Alexis Georges

-   [@Twitter](https://twitter.com/SuperITMan_BE)
-   [@GitHub](https://github.com/SuperITMan)

### Christopher Cortes

-   [@GitHub](https://github.com/christophercr)

### Olivia Tournois

-   [@Twitter](https://twitter.com/mallikki)
-   [@GitHub](https://github.com/Mallikki)

## License

This project and all associated source code is licensed under the terms of the [MIT License](/LICENSE).

## Showcase and Documentation

The Stark Showcase can be found **[here](https://stark.nbb.be)**.
There, you'll also find links about:

-   the latest [API docs for Stark-Core](https://stark.nbb.be/api-docs/stark-core/latest/)
-   the previous API docs for Stark-Core
-   the latest [API docs for Stark-UI](https://stark.nbb.be/api-docs/stark-ui/latest/)
-   the previous API docs for Stark-UI
-   the previous Showcase versions

## Thank you notes :)

We'd like to thank the following companies who support the open source community with great tools and platforms.

### Jetbrains

We're supported by [Jetbrains](https://www.jetbrains.com) and their awesome [support for open source](https://www.jetbrains.com/buy/opensource/), thanks to which we are able to use the best products on the market to work on this open source project!

<a href="https://www.jetbrains.com"><img src="http://www.underconsideration.com/brandnew/archives/jetbrains_logo_detail.jpg" width="144px"></a>

### Travis

We're supported by [Travis](https://travis-ci.org/)

<a href="https://travis-ci.org/"><img src="https://travis-ci.com/images/logos/TravisCI-Full-Color.png" width="144px"></a>

### GitHub Actions

We're supported by [GitHub Actions](https://github.com/features/actions)

<a href="https://github.com/features/actions"><img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" width="144px"></a>


### BrowserStack

We're supported by [BrowserStack](https://www.browserstack.com)

<a href="https://www.browserstack.com"><img src="http://www.browserstack.com/images/layout/browserstack-logo-600x315.png" width="144px"></a>
