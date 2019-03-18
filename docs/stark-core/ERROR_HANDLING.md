# Stark Default Error Handling

Stark provides its own error handler, StarkErrorHandler, that overrides [ Angular's default ErrorHandler](https://angular.io/api/core/ErrorHandler).

This handler will dispatch a StarkUnhandledError action to the application Store which you can treat as you want.

## StarkErrorHandlingModule

If you want to use this handler, you simply have to import StarkErrorHandlingModule from stark-core in your `app.module.ts` file.

```typescript
import {StarkErrorHandlingModule} from "@nationalbankbelgium/stark-core";

@NgModule({
	bootstrap: ...
	declarations: ...
	imports: [
		StarkErrorHandlingModule.forRoot(),
		...
		]
	})
```

## Effects definition

To define what to do when an error happens, you can simply create a new effects file, like in the following example:

```typescript
...
import {StarkErrorHandlingActionTypes, StarkUnhandledError} from "@nationalbankbelgium/stark-core";

/**
 * This class is used to determine what to do with an error
 */
@Injectable()
export class StarkErrorHandlingEffects {

	public constructor(
		private actions$: Actions
	) {}

	@Effect()
	public doSomething(): Observable<void> {
		return this.actions$.pipe(
			ofType<StarkUnhandledError>(StarkErrorHandlingActionTypes.UNHANDLED_ERROR),
			map((action: StarkUnhandledError) => {
				//DO SOMETHING
			})
		);
	}
}
```

If you do create that file, don't forget to import it in your `app.module.ts` file:

```typescript
...
import { StarkErrorHandlingEffects } from "./shared/effects/stark-error-handler.effects";

@NgModule({
	bootstrap: ...
	declarations: ...
	imports: [
		...
		EffectsModule.forRoot([StarkErrorHandlingEffects]),
		...
	]
})
```
