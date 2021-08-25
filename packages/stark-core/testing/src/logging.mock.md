# Usage

The mock class `MockStarkLoggingService` can be imported as follows:

```typescript
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
```

Since the mock class implements the base interface of the service it mocks, you just need to provide the mock in your `TestingModule`:

```typescript
TestBed.configureTestingModule({
    imports: [...],
    declarations: [...],
    providers: [
        ...
        { provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
        ...
    ]
});
```

The instantiated mock will have these default properties assigned:

- `correlationId = "dummyCorrelationId"`
- `correlationIdHttpHeaderName = "Correlation-Id-HttpHeaderName"`.

In case you need specific values for any of those properties, then you need to pass a custom `correlationId` and/or a custom `correlationIdHttpHeaderName`
to the constructor of the mock class:

```typescript
new MockStarkLoggingService("custom-correlation-id", "custom-correlation-id-header");
```

Then you can just inject the Stark service via the TestBed using its corresponding `InjectionToken`:

```typescript
// this will inject the instantiated mock class
mockLoggingService = TestBed.inject(STARK_LOGGING_SERVICE);
```

In fact, every method of the base interface is simply mocked
with a [Jasmine Spy](https://jasmine.github.io/api/3.5/Spy.html) which can then be used in the unit tests to:

- return custom values
- override a method with a custom function
- asserting that they are actually called
- do any other operation than can be performed with an Spy.

For example:

```typescript
// reading a value
const correlationId = mockLoggingService.correlationId;

// overriding a method with a custom function
mockLoggingService.error.and.callFake((someMessage, someError) => {
  // some custom logic to return a specific value
});

// asserting that a method was indeed called
expect(mockLoggingService.error).toHaveBeenCalledTimes(1);
expect(mockLoggingService.error).toHaveBeenCalledWith(someMessage, someError);
```
