import { Component, Input, ViewEncapsulation } from "@angular/core";

/**
 * The name of the component
 */
const componentName: string = "stark-session-card";

/**
 * Component to display session pages
 */
@Component({
	selector: "stark-session-card",
	templateUrl: "./session-card.component.html",
	encapsulation: ViewEncapsulation.None,
	host: {
		class: componentName
	}
})
export class StarkSessionCardComponent {
	/**
	 * The title shown in the header of the card
	 */
	@Input()
	public cardTitle: string;
}
