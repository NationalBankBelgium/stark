# Usage

The mock class `MockStarkSessionService` can be imported as follows:

```typescript
import { MockStarkSessionService } from "@nationalbankbelgium/stark-core/testing";
```

Since the mock class implements the base interface of the service it mocks, you just need to provide the mock in your `TestingModule`:

```typescript
TestBed.configureTestingModule({
    imports: [...],
    declarations: [...],
    providers: [
        ...
        { provide: STARK_SESSION_SERVICE, useValue: new MockStarkSessionService() },
        ...
    ]
});
```

The instantiated mock will have this default property assigned:

- `devAuthenticationHeaders = new Map<string, string>()`

In case you need specific values for those headers, then you need to pass a custom `devAuthenticationHeaders`
to the constructor of the mock class:

```typescript
const customAuthenticationHeaders = new Map<string, string>();
// add the headers you need to the map
customAuthenticationHeaders.set(someHeaderName, someHeaderValue);
customAuthenticationHeaders.set(anotherHeaderName, anotherHeaderValue);
// pass the map to the constructor
new MockStarkSessionService(customAuthenticationHeaders);
```

Then you can just inject the Stark service via the TestBed using its corresponding `InjectionToken`:

```typescript
// this will inject the instantiated mock class
mockSessionService = TestBed.inject(STARK_SESSION_SERVICE);
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
const devAuthenticationHeaders = mockSessionService.devAuthenticationHeaders;

// overriding a method with a custom function
mockSessionService.getCurrentUser.and.callFake(() => {
  // some custom logic to return a specific value
});

// asserting that a method was indeed called
expect(mockSessionService.login).toHaveBeenCalledTimes(1);
expect(mockSessionService.login).toHaveBeenCalledWith(someUser);
```
