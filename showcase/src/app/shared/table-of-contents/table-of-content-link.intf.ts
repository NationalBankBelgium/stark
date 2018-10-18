/**
 * Defines the link to display in the table of contents
 */
export interface TableOfContentLink {
	/**
	 * id of the section
	 */
	id: string;

	/**
	 * header type h1/h2
	 */
	type: string;

	/**
	 * If the anchor is in view of the page
	 */
	active: boolean;

	/**
	 * name of the anchor
	 */
	name: string;

	/**
	 * top offset px of the anchor
	 */
	top: number;
}
