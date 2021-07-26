# Usage

The mock class `MockStarkAppSidebarService` can be imported as follows:

```typescript
import { MockStarkAppSidebarService } from "@nationalbankbelgium/stark-ui/testing";
```

Since the mock class implements the base interface of the service it mocks, you just need to provide the mock in your `TestingModule`:

```typescript
TestBed.configureTestingModule({
    imports: [...],
    declarations: [...],
    providers: [
        ...
        { provide: STARK_APP_SIDEBAR_SERVICE, useValue: new MockStarkAppSidebarService() },
        ...
    ]
});
```

Then you can just inject the Stark service via the TestBed using its corresponding `InjectionToken`:

```typescript
// this will inject the instantiated mock class
mockStarkAppSidebarService = TestBed.inject(STARK_APP_SIDEBAR_SERVICE);
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
const sidebarOpen$ = mockStarkAppSidebarService.openSidebar$;

// overriding a method with a custom function
mockStarkAppSidebarService.openMenu.and.callFake(() => {
  // some custom logic
});

// asserting that a method was indeed called
expect(mockStarkAppSidebarService.close).toHaveBeenCalledTimes(1);
```
