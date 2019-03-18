/* tslint:disable:completed-docs*/
import { Inject, Injectable } from "@angular/core";
import { StateDeclaration, StateObject, TargetState, Transition } from "@uirouter/core";
import { Store } from "@ngrx/store";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_SESSION_SERVICE,
	starkAppExitStateName,
	starkAppInitStateName,
	StarkLoggingService,
	StarkRoutingService,
	StarkRoutingTransitionHook,
	StarkSessionService,
	StarkUser
} from "@nationalbankbelgium/stark-core";
import { StarkRBACAuthorizationService, starkRBACAuthorizationServiceName } from "./authorization.service.intf";
import { StarkRBACStatePermissions, StarkStateRedirection, StarkStateRedirectionFn } from "../entities";
import { StarkUserNavigationUnauthorized, StarkUserNavigationUnauthorizedRedirected } from "../actions/authorization.actions";

/**
 * @ignore
 */
export const starkUnauthorizedUserError: string = starkRBACAuthorizationServiceName + " => user not authorized";

/**
 * @ignore
 */
@Injectable()
export class StarkRBACAuthorizationServiceImpl implements StarkRBACAuthorizationService {
	public user?: StarkUser;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		private store: Store<any>
	) {
		this.logger.debug(starkRBACAuthorizationServiceName + " loaded");
	}

	/**
	 * To be called only when the app initializes
	 */
	public initializeService(): void {
		this.sessionService.getCurrentUser().subscribe(
			(user: StarkUser | undefined) => {
				if (user) {
					this.user = user;
				}
			},
			() => {
				throw new Error(starkRBACAuthorizationServiceName + ": error while getting the user profile");
			}
		);

		this.registerTransitionHook();
	}

	public hasRole(roleCode: string): boolean {
		if (this.user && roleCode && roleCode.trim() !== "") {
			return this.user.roles.indexOf(roleCode) > -1;
		} else {
			return false;
		}
	}

	public hasAnyRole(roleCodes: string[]): boolean {
		let hasAnyRole: boolean = false;

		if (roleCodes instanceof Array) {
			for (const roleCode of roleCodes) {
				if (this.hasRole(roleCode)) {
					hasAnyRole = true;
					break;
				}
			}
		}

		return hasAnyRole;
	}

	public isAnonymous(): boolean {
		if (this.user) {
			return this.user.isAnonymous === true;
		} else {
			return false;
		}
	}

	protected registerTransitionHook(): void {
		this.routingService.addKnownNavigationRejectionCause(starkUnauthorizedUserError);

		this.routingService.addTransitionHook(
			StarkRoutingTransitionHook.ON_START,
			{
				// match only states with permissions except the ones that are children of starkAppInit/starkAppExit or the Ui-Router's root state
				entering: (state?: StateObject) => {
					const regexInitExitStateName: RegExp = new RegExp("(" + starkAppInitStateName + "|" + starkAppExitStateName + ")");
					if (
						state &&
						typeof state.name !== "undefined" &&
						!state.name.match(regexInitExitStateName) &&
						!(state.abstract && state.name === "")
					) {
						return state.data && typeof state.data.permissions !== "undefined";
					}
					return false;
				}
			},
			(transition: Transition): boolean | TargetState => {
				const state: StateDeclaration = transition.to();
				const permissions: StarkRBACStatePermissions = state.data.permissions;

				if (!this.isNavigationAuthorized(permissions)) {
					return this.handleUnauthorizedNavigation(permissions, transition);
				}

				return true;
			},
			{ priority: 900 } // very high priority (this should be one of the first hooks to be called to reject/redirect transitions immediately)
		);
	}

	protected isNavigationAuthorized(permissions: StarkRBACStatePermissions): boolean {
		if (permissions) {
			if (permissions.only instanceof Array) {
				return this.hasAnyRole(permissions.only);
			} else if (permissions.except instanceof Array) {
				return !this.hasAnyRole(permissions.except);
			} else {
				this.logger.warn(starkRBACAuthorizationServiceName + ": could not find 'only' or 'except' in state 'data.permissions'");
			}
		}

		return true;
	}

	protected handleUnauthorizedNavigation(permissions: StarkRBACStatePermissions, transition: Transition): TargetState {
		this.logger.warn(starkUnauthorizedUserError);
		if (permissions && permissions.redirectTo) {
			return this.redirectNavigation(permissions.redirectTo, transition);
		} else {
			// dispatch action so an effect can run any logic if needed
			this.store.dispatch(new StarkUserNavigationUnauthorized(transition.targetState().name()));
			throw new Error(starkUnauthorizedUserError);
		}
	}

	protected redirectNavigation(redirectTo: StarkStateRedirection | StarkStateRedirectionFn, transition: Transition): TargetState {
		let stateRedirection: StarkStateRedirection;

		if (redirectTo instanceof Function) {
			stateRedirection = redirectTo(transition);
		} else {
			stateRedirection = redirectTo;
		}

		this.logger.warn(starkRBACAuthorizationServiceName + ": redirecting to state '" + stateRedirection.stateName + "'");
		const originalTargetState: TargetState = transition.targetState();
		// dispatch action so an effect can run any logic if needed
		this.store.dispatch(new StarkUserNavigationUnauthorizedRedirected(originalTargetState.name(), stateRedirection.stateName));
		// overriding the target state with that one to be redirected to
		return originalTargetState.withState(stateRedirection.stateName).withParams(stateRedirection.params || {}, true);
	}
}
