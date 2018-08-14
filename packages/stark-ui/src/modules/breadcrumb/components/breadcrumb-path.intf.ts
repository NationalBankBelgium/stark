/**
 * Interface that will define a path used in the breadcrumn ocmponent
 */
export interface StarkBreadcrumbPath {
	id: string;
	state: string;
	stateParams: { [param: string]: any };
	translationKey: string;
}
