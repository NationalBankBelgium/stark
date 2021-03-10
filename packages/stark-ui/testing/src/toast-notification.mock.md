# Usage

The mock class `MockStarkToastNotificationService` can be imported as follows:

```typescript
import { MockStarkToastNotificationService } from "@nationalbankbelgium/stark-ui/testing";
```

Since the mock class implements the base interface of the service it mocks, you just need to provide the mock in your `TestingModule`:

```typescript
TestBed.configureTestingModule({
    imports: [...],
    declarations: [...],
    providers: [
        ...
        { provide: STARK_TOAST_NOTIFICATION_SERVICE, useValue: new MockStarkToastNotificationService() },
        ...
    ]
});
```

Then you can just inject the Stark service via the TestBed using its corresponding `InjectionToken`:

```typescript
// this will inject the instantiated mock class
mockStarkToastNotificationService = TestBed.get(STARK_TOAST_NOTIFICATION_SERVICE);
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
mockStarkToastNotificationService.show.and.returnValue(someCustomObservable);

// overriding a method with a custom function
mockStarkToastNotificationService.show.and.callFake((message: StarkToastMessage) => {
  // some custom logic
});

// asserting that a method was indeed called
expect(mockStarkToastNotificationService.hide).toHaveBeenCalledTimes(1);
```
