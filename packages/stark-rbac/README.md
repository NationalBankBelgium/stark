[![NPM version](https://img.shields.io/npm/v/@nationalbankbelgium/stark-rbac.svg?logo=npm&logoColor=fff&label=npm+package&color=limegreen)](https://www.npmjs.com/package/@nationalbankbelgium/stark-rbac)
[![npm](https://img.shields.io/npm/dm/@nationalbankbelgium/stark-rbac.svg?logo=npm)](https://www.npmjs.com/package/@nationalbankbelgium/stark-rbac)
[![Build Status](https://img.shields.io/travis/com/NationalBankBelgium/stark.svg?branch=master&logo=travis)](https://travis-ci.com/NationalBankBelgium/stark)
[![Build Status](https://github.com/NationalBankBelgium/stark/workflows/build/badge.svg)](https://github.com/NationalBankBelgium/stark/actions?query=workflow%3Abuild)
[![Dependency Status](https://img.shields.io/david/nationalbankbelgium/stark-rbac)](https://david-dm.org/NationalBankBelgium/stark-rbac)
[![devDependency Status](https://img.shields.io/david/dev/nationalbankbelgium/stark-rbac?label=devDependencies)](https://david-dm.org/NationalBankBelgium/stark-rbac#info=devDependencies)
[![License](https://img.shields.io/npm/l/@nationalbankbelgium/stark-rbac)](LICENSE)

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
