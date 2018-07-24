import { Directive, HostListener, Inject, Input, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

/**
 * Name of the directive
 */
const directiveName: string = "[starkRestrictInput]";

/**
 * Directive to restrict the characters that can be typed in a field to allow only those matching a regex pattern.
 */
@Directive({
	selector: directiveName
})
export class StarkRestrictInputDirective implements OnInit {
	/**
	 * A valid regular expression that defines the allowed characters
	 */
	/* tslint:disable:no-input-rename */
	@Input("starkRestrictInput") public inputRestriction: string;

	/**
	 * Event handler to be invoked on a "keypress" event in the field
	 */
	@HostListener("keypress", ["$event"])
	public eventHandler(event: KeyboardEvent): boolean {
		const regularExpression: string = this.inputRestriction || "";

		if (regularExpression) {
			const key: string = String.fromCharCode(!event.charCode ? event.which : event.charCode);
			const regex: RegExp = new RegExp(regularExpression);

			if (!regex.test(key)) {
				event.preventDefault();
				return false;
			}
		} else {
			this.logger.warn(directiveName + ": no input restriction defined");
		}

		return true;
	}

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 */
	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	/**
	 * Directive lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(directiveName + ": directive initialized");
	}
}
