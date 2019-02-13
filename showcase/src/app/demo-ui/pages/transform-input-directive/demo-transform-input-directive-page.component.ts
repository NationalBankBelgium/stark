import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { FormControl } from "@angular/forms";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "showcase-demo-transform-input-directive-page",
	templateUrl: "./demo-transform-input-directive-page.component.html"
})
export class DemoTransformInputDirectivePageComponent implements OnInit {
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
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.referenceList = [
			{
				label: "Stark Transform Input directive",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkTransformInputDirective.html"
			}
		];

		this.formControl.valueChanges.subscribe((v: string) => this.logger.debug("formControl value changed: ", v));
	}
}
