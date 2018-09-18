/**
 * StarkMenuEntry interface
 */
export interface StarkMenuEntry {
	id: string;
	icon?: string;
	label: string;
	isVisible: boolean;
	isEnabled: boolean;
	targetState?: string;
	targetStateParams?: { [param: string]: any };
}
