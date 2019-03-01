# Session Timeout Warning configuration

Stark provides a nice feature when it comes to session expiration handling: in case the user's session is about to end due
to inactivity (the user is idle for some time) and you want to warn him about this, a dialog will be displayed.

This is what the `SessionTimeoutWarningDialogComponent` does and also asks the user if its session should be kept alive.

This warning dialog is displayed by an NGRX Effect that triggers when a `StarkSessionActionTypes.SESSION_TIMEOUT_COUNTDOWN_START` action
is dispatched (by the Session service when the user becomes idle).

To use this feature, you'll have to modify the `app.module.ts` file of your application

## app.module.ts

You'll have to import the StarkSessionUiModule like follow:

```typescript
import {StarkSessionUiModule} from "@nationalbankbelgium/stark-ui";

@NgModule({
	imports: [
		StarkSessionUiModule.forRoot(),
		...
	]
})
```

To indicate that you don't wish to display such warning dialog, just set `timeoutWarningDialogDisabled` value to true.
This option is false by default.

```typescript
import {StarkSessionUiModule} from "@nationalbankbelgium/stark-ui";

@NgModule({
	imports: [
		StarkSessionUiModule.forRoot({
			timeoutWarningDialogDisabled: true
        }),
		...
	]
})
```
