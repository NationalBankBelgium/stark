/**
 * Describes the configuration to be passed to the {@link StarkShowOnPermissionDirective} and {@link StarkHideOnPermissionDirective}.
 */
export interface StarkRBACDirectivePermission {
	/**
	 * The roles to be checked by the directives in order to determine whether the user has permission to access the content
	 */
	roles: string[];
}
