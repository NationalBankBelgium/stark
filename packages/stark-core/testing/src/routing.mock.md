# Usage

The mock class `MockStarkRoutingService` can be imported as follows:

```typescript
import { MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
```

Since the mock class implements the base interface of the service it mocks, you just need to provide the mock in your `TestingModule`:

```typescript
TestBed.configureTestingModule({
    imports: [...],
    declarations: [...],
    providers: [
        ...
        { provide: STARK_ROUTING_SERVICE, useValue: new MockStarkRoutingService() },
        ...
    ]
});
```

Then you can just inject the Stark service via the TestBed using its corresponding `InjectionToken`:

```typescript
// this will inject the instantiated mock class
mockRoutingService = TestBed.inject(STARK_ROUTING_SERVICE);
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
mockRoutingService.isCurrentUiState.and.returnValue(false);

// overriding a method with a custom function
mockRoutingService.isCurrentUiState.and.callFake((someState) => {
  // some custom logic to return a specific value
});

// asserting that a method was indeed called
expect(mockRoutingService.isCurrentUiState).toHaveBeenCalledTimes(1);
expect(mockRoutingService.isCurrentUiState).toHaveBeenCalledWith(someState, someParams);
```
