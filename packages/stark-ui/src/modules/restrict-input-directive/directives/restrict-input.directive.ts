import { Directive, HostListener, Inject, Input, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

/**
 * @ignore
 */
const directiveName = "[starkRestrictInput]";

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
	@Input("starkRestrictInput")
	public inputRestriction = "";

	/**
	 * Event handler to be invoked on a "keypress" event in the field
	 */
	@HostListener("keypress", ["$event"])
	public eventHandler(event: KeyboardEvent): boolean {
		// some browsers return the special key value (i.e. keys in the numeric keypad), in such cases we use the 'char'
		// see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
		/* tslint:disable-next-line:deprecation */
		const key: string = event.key.length > 1 ? event.char : event.key;

		return this.testValue(event, key);
	}

	/**
	 * Event handler to be invoked on a "paste" event in the field
	 */
	@HostListener("paste", ["$event"])
	public onPaste(event: ClipboardEvent): boolean {
		if (!event.clipboardData) {
			return true;
		}
		const value = event.clipboardData.getData("text/plain");

		return this.testValue(event, value);
	}

	/**
	 * Event handler to be invoked on a "drop" event in the field
	 */
	@HostListener("drop", ["$event"])
	public onDrop(event: DragEvent): boolean {
		if (!event.dataTransfer) {
			return true;
		}
		const value = event.dataTransfer.getData("text/plain");
		return this.testValue(event, value);
	}

	/**
	 * Test the value past/drop/input 
	 * @param event The event object
	 * @param value the value to be tested
	 */
	private testValue(event: Event, value: string): boolean {
		const regularExpression: string = this.inputRestriction || "";
		if (regularExpression) {
			const regex: RegExp = new RegExp(regularExpression);
			if (!regex.test(value)) {
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
	 * @param logger - The `StarkLoggingService` instance of the application.
	 */
	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	/**
	 * Directive lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(directiveName + ": directive initialized");
	}
}
