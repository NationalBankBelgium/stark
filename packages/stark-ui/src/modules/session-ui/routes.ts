import { HookResult, Transition } from "@uirouter/core";
import { Ng2StateDeclaration } from "@uirouter/angular";
import { OverlayContainer } from "@angular/cdk/overlay";
import {
	starkLoginStateName,
	starkLoginStateUrl,
	starkPreloadingStateName,
	starkPreloadingStateUrl,
	starkSessionExpiredStateName,
	starkSessionExpiredStateUrl,
	starkSessionLogoutStateName,
	starkSessionLogoutStateUrl
} from "@nationalbankbelgium/stark-core";
import {
	StarkLoginPageComponent,
	StarkPreloadingPageComponent,
	StarkSessionExpiredPageComponent,
	StarkSessionLogoutPageComponent
} from "./pages";

/**
 * Hook to destroy the OverlayContainer inside which all overlays are rendered (i.e. stark-dropdown options)
 * Fixes https://github.com/NationalBankBelgium/stark/issues/1570
 */
export function destroyOverlaysOnEnterFn(transition: Transition): HookResult {
	try {
		// inject the OverlayContainer
		const overlayContainer = transition.injector().getNative<OverlayContainer>(OverlayContainer);
		// destroy the container by calling its own "ngOnDestroy" method
		// see https://github.com/angular/components/pull/5378/files
		/* tslint:disable-next-line:no-lifecycle-call*/
		overlayContainer.ngOnDestroy();
	} catch (err) {
		// the OverlayContainer could not be injected, do nothing
	}

	return true;
}

/**
 * States defined by Session-UI Module
 */
/* tslint:disable:no-duplicate-string */
export const SESSION_UI_STATES: Ng2StateDeclaration[] = [
	{
		name: starkLoginStateName, // the parent is defined in the state's name (contains a dot)
		url: starkLoginStateUrl,
		views: {
			"initOrExit@": {
				component: StarkLoginPageComponent
			}
		}
	},
	{
		name: starkPreloadingStateName, // the parent is defined in the state's name (contains a dot)
		url: starkPreloadingStateUrl,
		views: {
			"initOrExit@": {
				component: StarkPreloadingPageComponent
			}
		}
	},
	{
		name: starkSessionExpiredStateName, // the parent is defined in the state's name (contains a dot)
		url: starkSessionExpiredStateUrl,
		views: {
			"initOrExit@": {
				component: StarkSessionExpiredPageComponent
			}
		},
		onEnter: destroyOverlaysOnEnterFn
	},
	{
		name: starkSessionLogoutStateName, // the parent is defined in the state's name (contains a dot)
		url: starkSessionLogoutStateUrl,
		views: {
			"initOrExit@": {
				component: StarkSessionLogoutPageComponent
			}
		},
		onEnter: destroyOverlaysOnEnterFn
	}
];
