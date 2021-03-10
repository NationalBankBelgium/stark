# Usage

The mock class `MockStarkXsrfService` can be imported as follows:

```typescript
import { MockStarkXsrfService } from "@nationalbankbelgium/stark-core/testing";
```

Since the mock class implements the base interface of the service it mocks, you just need to provide the mock in your `TestingModule`:

```typescript
TestBed.configureTestingModule({
    imports: [...],
    declarations: [...],
    providers: [
        ...
        { provide: STARK_XSRF_SERVICE, useValue: new MockStarkXsrfService() },
        ...
    ]
});
```

Then you can just inject the Stark service via the TestBed using its corresponding `InjectionToken`:

```typescript
// this will inject the instantiated mock class
mockXSRFService = TetBed.get(STARK_XSRF_SERVICE);
```

In fact, every method of the base interface is simply mocked
with a [Jasmine Spy](https://jasmine.github.io/api/3.5/Spy.html) which can then be used in the unit tests to:

- return custom values
- override a method with a custom function
- asserting that they are actually called
- do any other operation than can be performed with an Spy.

For example:

```typescript
// returning custom value
mockXSRFService.getXSRFToken.and.returnValue("some token");

// overriding a method with a custom function
mockXSRFService.getXSRFToken.and.callFake(() => {
  // some custom logic to return a specific value
});

// asserting that a method was indeed called
expect(mockXSRFService.configureHttpRequest).toHaveBeenCalledTimes(1);
expect(mockXSRFService.configureHttpRequest).toHaveBeenCalledWith(someRequest);
```
