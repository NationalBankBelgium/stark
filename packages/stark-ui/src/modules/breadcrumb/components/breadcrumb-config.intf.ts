import { StarkBreadcrumbPath } from "./breadcrumb-path.intf";

/**
 * Interface that will define all paths to be displayed by the {@link StarkBreadcrumbComponent}
 */
export interface StarkBreadcrumbConfig {
	/**
	 * Array of {@link StarkBreadcrumbPath} objects
	 */
	breadcrumbPaths: StarkBreadcrumbPath[];
}
