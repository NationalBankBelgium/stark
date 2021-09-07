import { Directive, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, ViewRef } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkRBACDirectivePermission } from "./permission.intf";
import { STARK_RBAC_AUTHORIZATION_SERVICE, StarkRBACAuthorizationService } from "../services";

/**
 * Name of the directive
 */
const directiveName = "[starkHideOnPermission]";

/**
 * [Structural Directive](https://v12.angular.io/guide/structural-directives) to remove an element if the user has any of the roles specified
 * in the {@link StarkRBACDirectivePermission} object passed as input.
 *
 * This directive should be used in cases where some content in the application should be shown to all the users except to those that have a specific role.
 *
 * @example
 * <div *starkHideOnPermission="permissionsObject">
 *   <!-- protected content to be shown only to those users that don't have any of the specified roles -->
 *   Some protected content
 * </div>
 */
@Directive({
	selector: directiveName
})
export class StarkHideOnPermissionDirective implements OnInit, OnDestroy {
	/**
	 * @ignore
	 * @internal
	 */
	private _isValidInput = false;

	/**
	 * {@link StarkRBACDirectivePermission} object containing any of the roles that the user must not have in order to display the element that this directive is applied to.
	 */
	@Input()
	public set starkHideOnPermission(value: StarkRBACDirectivePermission) {
		// Checks whether the value is valid and contains `roles` property
		this._isValidInput = !(!value || typeof value.roles === "undefined");

		if (!this.authorizationService.hasAnyRole(value.roles)) {
			if (!this.viewRef) {
				this.viewRef = this._viewContainer.createEmbeddedView(this._templateRef);
			} else {
				if (this._viewContainer.length === 0) {
					this._viewContainer.insert(this.viewRef);
				}
			}
		} else {
			if (this._viewContainer.length === 1) {
				this._viewContainer.detach();
			}
		}
	}

	/**
	 * @ignore
	 * @internal
	 * Reference to the view of the embedded template that will be inserted/removed based on the user permissions
	 */
	private viewRef?: ViewRef;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application
	 * @param authorizationService - The `StarkRBACAuthorizationService` instance of the application
	 * @param _templateRef - The embedded template of the host element of this directive.
	 * @param _viewContainer - The container where one or more views can be attached to the host element of this directive.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_RBAC_AUTHORIZATION_SERVICE) public authorizationService: StarkRBACAuthorizationService,
		private _templateRef: TemplateRef<any>,
		private _viewContainer: ViewContainerRef
	) {
		this.authorizationService = authorizationService;
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		if (!this._isValidInput) {
			throw new Error(directiveName + ": Passed object must contain 'roles'.");
		}

		this.logger.debug(directiveName + ": directive initialized");
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		this._viewContainer.clear(); // destroy all views just in case
	}
}
