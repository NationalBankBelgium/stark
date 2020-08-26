import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";

/**
 * @ignore
 */
const componentName = "stark-session-card";

/**
 * Component to display session pages
 */
@Component({
	selector: "stark-session-card",
	templateUrl: "./session-card.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkSessionCardComponent {
	/**
	 * The title shown in the header of the card
	 */
	@Input()
	public cardTitle = "";
}
