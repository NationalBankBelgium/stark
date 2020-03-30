import { Ng2StateDeclaration } from "@uirouter/angular";
import { StarkStateRedirection, StarkStateRedirectionFn } from "./state-redirection.intf";

/**
 * Describes the content of the `permissions` object to be set inside the `data` property of a Router state configuration
 */
export interface StarkRBACStatePermissions {
	/**
	 * Array of roles that the user must have in order to have permission to navigate to this route
	 */
	only?: string[];
	/**
	 * Array of roles that the user must not have in order to have permission to navigate to this route
	 */
	except?: string[];
	/**
	 * The redirection to be performed by the Router in case the user does not have permission to navigate to this route
	 */
	redirectTo?: StarkStateRedirection | StarkStateRedirectionFn;
}

/* tslint:disable:jsdoc-format */
/**
 * Describes a Router state configuration with `data.permissions` defined in order to protect such state(s) with RBAC authorization
 * via the {@link StarkRBACAuthorizationService}.
 *
 * **IMPORTANT:** Although the [Ng2StateDeclaration](https://ui-router.github.io/ng2/docs/latest/interfaces/state.ng2statedeclaration.html) can
 * be used to define Router state configurations, it is recommended to use this interface instead because it clearly indicates the intention
 * to protect the given state(s) and also enables the IDE to provide code completion and code hinting.
 *
```typescript
export const APP_STATES: StarkRBACStateDeclaration[] = [
	{
		name: "someState",
		url: "/someUrl",
		component: SomeComponent,
		data: {
			...
			permissions: {
				only: ["roleA", "roleB"], // or define 'except' option instead
				redirectTo: {
					stateName: "anotherState",
					params: {...}
				}
			}
		}
	},
  ...
];
```
 */
/* tslint:enable:jsdoc-format */
export interface StarkRBACStateDeclaration extends Ng2StateDeclaration {
	/**
	 * An inherited property to store state data
	 *
	 * Child states' `data` object will prototypally inherit from their parent state.
	 *
	 * This is the right spot to store RBAC authorization info (`permissions`)
	 *
	 * **Note: because prototypal inheritance is used, changes to parent `data` objects reflect in the child `data` objects.
	 * Care should be taken if you are using `hasOwnProperty` on the `data` object.
	 * Properties from parent objects will return false for `hasOwnProperty`.**
	 */
	data: {
		permissions: StarkRBACStatePermissions;
		[prop: string]: any;
	};
}
