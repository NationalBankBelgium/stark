import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { FormControl } from "@angular/forms";

@Component({
	selector: "demo-transform-input",
	templateUrl: "./demo-transform-input.component.html"
})
export class DemoTransformInputComponent {
	public value = "";
	public formControl = new FormControl("");
	private _emojiMap = new Map([
		[":+1:", "👍"],
		[":-1:", "👎"],
		[":smile:", "😄"],
		[":tada:", "🎉"],
		[":rocket:", "🚀"],
		[":zap:", "⚡️"]
	]);

	public simpleEmojiTransform = (value: string): string =>
		value.replace(/:[+-]?\w+:/, (match: string): string => this._emojiMap.get(match) || match);

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {
		this.formControl.valueChanges.subscribe((v: string) => this.logger.debug("formControl value changed: ", v));
	}
}
