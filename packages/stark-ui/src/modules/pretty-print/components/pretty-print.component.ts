import { Component, HostBinding, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";

/* tslint:disable:no-duplicate-imports no-import-side-effect */
import * as Prism from "prismjs";
import { LanguageDefinition } from "prismjs";
import "prismjs/components/prism-typescript.min.js";
import "prismjs/components/prism-sql.min.js";
import "prismjs/components/prism-json.min.js";
import "prismjs/components/prism-scss.min.js";
/* tslint:enable */

import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

/**
 * Name of the component
 */
const componentName: string = "stark-pretty-print";

/**
 * The prefix used in the PrismJs css classes
 */
const prismClassPrefix: string = "language-";

/**
 * A reference to the prettyData library
 */
const prettyData: any = require("pretty-data").pd;

/**
 * The code languages that are supported by the Stark-Pretty-Print component
 */
export type StarkPrettyPrintFormat = "css" | "scss" | "html" | "xml" | "json" | "sql" | "javascript" | "typescript";

/**
 * Component to format and highlight code like HTML, CSS, Typescript...
 * Can be used to display code examples
 */
@Component({
	selector: "stark-pretty-print",
	templateUrl: "./pretty-print.component.html",
	encapsulation: ViewEncapsulation.None
})
export class StarkPrettyPrintComponent implements OnChanges, OnInit {
	/**
	 * Adds class="stark-pretty-print" attribute on the host component
	 */
	@HostBinding("class") public class: string = componentName;
	/**
	 * The text to be pretty printed
	 */
	@Input() public data: string;

	/**
	 * The format to be used to pretty print the data string
	 */
	@Input() public format: StarkPrettyPrintFormat;

	/**
	 * If true, also highlight the pretty printed string
	 */
	@Input() public enableHighlighting?: boolean;

	public prettyString: string;
	public highlightingEnabled: boolean;

	/**
	 * Class constructor
	 * @param logger : the logger of the application
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService
	) {}

	/**
	 * Component lifecycle hook that is called after data-bound properties of a directive are initialized.
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
	}

	/**
	 * Component lifecycle hook that is called when any data-bound property of a directive changes.
	 * @param Contains the changed properties
	 */
	public ngOnChanges(_onChangesObj: SimpleChanges): void {
		if (!this.data || !this.format) {
			this.prettyString = this.data;
			return;
		}

		this.format = <StarkPrettyPrintFormat>this.format.toLowerCase();
		this.highlightingEnabled = !!this.enableHighlighting;
		this.prettyString = "";

		if (this.data && this.data.length > 0) {
			let prismGrammar: LanguageDefinition = <any>"";
			let prismClass: string = "";

			switch (this.format) {
				case "xml":
				case "html":
					prismGrammar = Prism.languages.markup;
					prismClass = prismClassPrefix + "markup";
					this.prettyString = prettyData.xml(this.data);
					break;

				case "json":
					try {
						prismGrammar = Prism.languages.json;
						prismClass = prismClassPrefix + this.format;
						JSON.parse(this.data);
						this.prettyString = prettyData.json(this.data);
					} catch (e) {
						this.logger.warn(componentName + ": Invalid JSON data");
						// the json string might not be valid so it should be in a try-catch clause
						// otherwise the pretty-data throws an error and it stops working :s
						// in this case we just show the raw data
						this.prettyString = this.data;
						this.highlightingEnabled = false;
					}
					break;

				case "css":
					prismGrammar = Prism.languages.css;
					prismClass = prismClassPrefix + this.format;
					this.prettyString = prettyData.css(this.data);
					break;

				case "scss":
					prismGrammar = Prism.languages.scss;
					prismClass = prismClassPrefix + this.format;
					this.prettyString = prettyData.css(this.data);
					break;

				case "sql":
					prismGrammar = Prism.languages.sql;
					prismClass = prismClassPrefix + this.format;
					this.prettyString = prettyData.sql(this.data);
					break;

				case "javascript":
					prismGrammar = Prism.languages.javascript;
					prismClass = prismClassPrefix + this.format;
					this.prettyString = this.data;
					break;

				case "typescript":
					prismGrammar = Prism.languages.typescript;
					prismClass = prismClassPrefix + this.format;
					this.prettyString = this.data;
					break;

				default:
					this.logger.warn(componentName + ": Unknown format -> ", this.format);
					this.highlightingEnabled = false;
					this.prettyString = this.data;
					break;
			}

			if (this.highlightingEnabled) {
				this.prettyString = Prism.highlight(this.prettyString, prismGrammar);
				this.prettyString =
					"<pre class='" + prismClass + "'><code class='" + prismClass + "'>" + this.prettyString + "</code></pre>";
			}
		}
	}
}
