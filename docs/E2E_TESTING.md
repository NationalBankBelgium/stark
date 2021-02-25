# End-to-End (E2E) Testing with Stark

The Stark Starter comes with a setup to write and run end-to-end tests.

## Protractor

Protractor is an end-to-end test framework for Angular and AngularJS applications. Protractor runs tests against your application running in a real browser, interacting with it as a user would.

For more information go to [https://www.protractortest.org](https://www.protractortest.org).

### Running end-to-end tests

Install all dependencies.

```shell
npm run install:all
```

Build the application

```shell
npm run build:starter
```

Run the end-to-end tests with protractor. _(make sure you have nothing running on `http://localhost:3000`)_

```shell
npm run test:starter:e2e
```

### Adding Tests

If you add tests they should be added as `starter/e2e/src/[testSubset]/testName.e2e-spec.ts`.
They are automatically found here by the configuration of `specs` in the `packages/stark-testing/protractor.conf.js`.

Keeping e2e tests separate like this prevents confusion when testing multiple components.

## BrowserStack (optional)

The showcase app uses GitHub Actions and BrowserStack to automatically run e2e-tests on multiple setups (Chrome, Firefox, IE, Safari, Android, IOS, ...).

If you want to run your e2e-tests automatically on multiple setups one of the easiest solutions is BrowserStack.
They offer a free solution for open source projects.

For more information go to [https://www.browserstack.com/automate](https://www.browserstack.com/automate).

### Running end-to-end tests with BrowserStack

#### Prerequisites

-   BrowserStack Account ([https://www.browserstack.com/](https://www.browserstack.com/))

#### Setup

Find your credentials on the [BrowserStack dashboard](https://automate.browserstack.com/dashboard).

Set the environmental `BROWSERSTACK_USERNAME` to the username and `BROWSERSTACK_ACCESS_KEY` to the access key.

#### Run the tests

```shell
npm run test:e2e:showcase:browserstack
```

_If you want to integrate BrowserStack in your own project you can have a look at `showcase/e2e/protractor.browserstack.conf.js` where we configured our setup._

_For more documentation see:_

-   _[https://github.com/angular/protractor/blob/master/lib/config.ts](https://github.com/angular/protractor/blob/master/lib/config.ts)_
-   _[https://www.browserstack.com/automate/capabilities](https://www.browserstack.com/automate/capabilities)_

### Integrating BrowserStack with GitHub Actions

To integrate the BrowserStack testing with GitHub Actions simply add the same environmentals as before. **Remember to keep them private.**

### Common errors

#### Port busy

```shell
LocalError: Either another browserstack local client is running on your machine or some server is listening on port 45691
```

BrowserStack Local was probably not stopped properly on the last run. You can resolve this by manually terminating it.

-   MacOS: `pkill BrowserStack`
-   Windows: Find the task in Task Manager and end it.
