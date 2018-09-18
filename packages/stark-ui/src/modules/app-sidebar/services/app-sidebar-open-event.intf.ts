/**
 * StarkAppSidebarOpenEvent interface
 */
export interface StarkAppSidebarOpenEvent {
	/**
	 * The left sidebar type
	 */
	type?: "regular" | "menu";

	/**
	 * The targeted sidenav
	 */
	sidebar: "left" | "right";
}
