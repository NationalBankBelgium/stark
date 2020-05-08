# Usage

The mock class `MockStarkMessagePaneService` can be imported as follows:

```typescript
import { MockStarkMessagePaneService } from "@nationalbankbelgium/stark-ui/testing";
```

Since the mock class implements the base interface of the service it mocks, you just need to provide the mock in your `TestingModule`:

```typescript
TestBed.configureTestingModule({
    imports: [...],
    declarations: [...],
    providers: [
        ...
        { provide: STARK_MESSAGE_PANE_SERVICE, useValue: new MockStarkMessagePaneService() },
        ...
    ]
});
```

Then you can just inject the Stark service via the TestBed using its corresponding `InjectionToken`:

```typescript
// this will inject the instantiated mock class
mockStarkMessagePaneService = TestBed.get(STARK_MESSAGE_PANE_SERVICE);
```

In fact, every method of the base interface is simply mocked
with a [Jasmine Spy](https://jasmine.github.io/api/3.5/Spy.html) which can then be used in the unit tests to:

-   return custom values
-   override a method with a custom function
-   asserting that they are actually called
-   do any other operation than can be performed with an Spy.

For example:

```typescript
// reading a value
const shouldBeClearedOnNavigation = mockStarkMessagePaneService.clearOnNavigation;

// returning custom value
mockStarkMessagePaneService.getAll.and.returnValue(someCustomObservable);

// overriding a method with a custom function
mockStarkMessagePaneService.add.and.callFake((messages: StarkMessage[]) => {
	// some custom logic to add the messages
});

// asserting that a method was indeed called
expect(mockStarkMessagePaneService.add).toHaveBeenCalledTimes(1);
```
