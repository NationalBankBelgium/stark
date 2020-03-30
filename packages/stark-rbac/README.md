[![NPM version](https://img.shields.io/npm/v/@nationalbankbelgium/stark-rbac.svg)](https://www.npmjs.com/package/@nationalbankbelgium/stark-rbac)
[![npm](https://img.shields.io/npm/dm/@nationalbankbelgium/stark-rbac.svg)](https://www.npmjs.com/package/@nationalbankbelgium/stark-rbac)
[![Build Status](https://travis-ci.org/NationalBankBelgium/stark.svg?branch=master)](https://travis-ci.org/NationalBankBelgium/stark)
[![Dependency Status](https://david-dm.org/NationalBankBelgium/stark-rbac.svg)](https://david-dm.org/NationalBankBelgium/stark-rbac)
[![devDependency Status](https://david-dm.org/NationalBankBelgium/stark-rbac/dev-status.svg)](https://david-dm.org/NationalBankBelgium/stark-rbac#info=devDependencies)
[![License](https://img.shields.io/cocoapods/l/AFNetworking.svg)](LICENSE)

# Stark RBAC

Stark's RBAC package (aka stark-rbac) is a separate module in Stark that can be optionally included in any Stark based application in order to provide different elements
(directives, services and components) to support Role Based Access Control (RBAC) mechanism.

The Stark-RBAC module depends on some functionalities provided by the Stark-Core module such as services. However you can use this module without Stark-Core
as long as you provide the same functionalities/services yourself.

**[Getting Started](https://stark.nbb.be/api-docs/stark-rbac/latest/additional-documentation/getting-started.html)**

## Testing subpackage

Stark RBAC comes also with the subpackage `@nationalbankbelgium/stark-rbac/testing` which contains the mock classes that come in hand
when implementing unit tests that depend on any of the main services provided by Stark RBAC.

**[Using Stark RBAC mock classes](https://stark.nbb.be/api-docs/stark-rbac/latest/additional-documentation/testing-subpackage.html)**
