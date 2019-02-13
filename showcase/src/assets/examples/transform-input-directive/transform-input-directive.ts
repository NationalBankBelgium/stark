import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { FormControl } from "@angular/forms";

@Component({
	selector: "demo-transform-input",
	templateUrl: "./demo-transform-input.component.html"
})
export class DemoTransformInputComponent implements OnInit {
	public value: string = "";
	public formControl: FormControl = new FormControl("");
	private _emojiMap: Map<string, string> = new Map([
		[":+1:", "👍"],
		[":-1:", "👎"],
		[":smile:", "😄"],
		[":tada:", "🎉"],
		[":rocket:", "🚀"],
		[":zap:", "⚡️"]
	]);
	public simpleEmojiTransform: (value: string) => string = (value: string) =>
		value.replace(/:[+-]?\w+:/, (match: string): string => this._emojiMap.get(match) || match);

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}
	public ngOnInit(): void {
		this.formControl.valueChanges.subscribe((v: string) => this.logger.debug("formControl value changed: ", v));
	}
}
