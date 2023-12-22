import { Inject, Injectable } from "@angular/core";
import { StarkPrettyPrintService, starkPrettyPrintServiceName } from "./pretty-print.service.intf";
import { StarkPrettyPrintFormat } from "../types";
import * as Prism from "prismjs";
import { Grammar } from "prismjs";

/* eslint-disable import/no-unassigned-import */
// prism loads these languages by default: "css", "clike", "javascript" and "markup" (which includes "xml", "html", "mathml", "svg")
import "prismjs/components/prism-typescript.min.js";
import "prismjs/components/prism-sql.min.js";
import "prismjs/components/prism-json.min.js";
import "prismjs/components/prism-css-extras.min.js";
import "prismjs/components/prism-scss.min.js";
/* eslint-enable import/no-unassigned-import */

import { Options, format as prettierFormat } from "prettier";
import * as prettierParserAngular from "prettier/plugins/angular";
import * as prettierParserEstree from "prettier/plugins/estree";
import * as prettierParserBabel from "prettier/plugins/babel";
import * as prettierParserHtml from "prettier/plugins/html";
import * as prettierParserPostcss from "prettier/plugins/postcss";
import * as prettierParserTypescript from "prettier/plugins/typescript";
import { Observable, from, throwError } from "rxjs";
import { catchError, map, toArray } from "rxjs/operators";
import sqlFormatter from "@sqltools/formatter";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

/**
 * The prefix used in the PrismJs CSS classes
 */
const prismClassPrefix = "language-";

@Injectable()
export class StarkPrettyPrintServiceImpl implements StarkPrettyPrintService {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public format(data: string, format: StarkPrettyPrintFormat, highlightingEnabled: boolean): Observable<string> {
		let prismGrammar: Grammar = <any>"";
		let prismClass = "";
		const options: Options = {};

		switch (format) {
			case "xml":
				prismGrammar = Prism.languages["markup"];
				prismClass = prismClassPrefix + "markup";
				options.parser = "html";
				options.htmlWhitespaceSensitivity = "ignore";
				options.plugins = [prettierParserHtml];
				break;
			case "html":
				prismGrammar = Prism.languages["markup"];
				prismClass = prismClassPrefix + "markup";
				options.parser = "angular";
				options.htmlWhitespaceSensitivity = "ignore";
				options.plugins = [
					prettierParserAngular,
					prettierParserEstree,
					prettierParserBabel,
					prettierParserHtml,
					prettierParserPostcss
				];
				break;
			case "json":
				prismGrammar = Prism.languages["json"];
				prismClass = prismClassPrefix + format;
				try {
					JSON.parse(data);
				} catch (error: any) {
					this.logger.warn(starkPrettyPrintServiceName + " : JSON parsing error -> ", error);
					return throwError(data);
				}
				options.parser = "json";
				options.plugins = [prettierParserEstree, prettierParserBabel];
				break;
			case "css":
				prismGrammar = Prism.languages["css"];
				prismClass = prismClassPrefix + format;
				options.parser = "css";
				options.plugins = [prettierParserPostcss];
				break;
			case "scss":
				prismGrammar = Prism.languages["scss"];
				prismClass = prismClassPrefix + format;
				options.parser = "scss";
				options.plugins = [prettierParserPostcss];
				break;
			case "sql":
				prismGrammar = Prism.languages["sql"];
				prismClass = prismClassPrefix + format;
				data = sqlFormatter.format(data, { language: "sql" });
				break;
			case "javascript":
				prismGrammar = Prism.languages["javascript"];
				prismClass = prismClassPrefix + format;
				options.parser = "babel";
				options.plugins = [prettierParserEstree, prettierParserBabel];
				break;
			case "typescript":
				prismGrammar = Prism.languages["typescript"];
				prismClass = prismClassPrefix + format;
				options.parser = "typescript";
				options.plugins = [prettierParserEstree, prettierParserTypescript];
				break;
			default:
				this.logger.warn(starkPrettyPrintServiceName + " : Unknown format -> ", format);
				return throwError(data);
		}

		// sql format do not use `Prettier`
		if (format === "sql") {
			let formattedText = data;
			if (highlightingEnabled) {
				const prismString = Prism.highlight(data, prismGrammar, format);
				formattedText = "<pre class='" + prismClass + "'><code class='" + prismClass + "'>" + prismString + "</code></pre>";
			}
			return from([formattedText]);
		} else {
			return from(prettierFormat(data, options)).pipe(
				toArray(),
				map((prettyStringArray: string[]): string => {
					const prettyString = prettyStringArray.join("");
					if (highlightingEnabled) {
						const prismString = Prism.highlight(prettyString, prismGrammar, format);
						return "<pre class='" + prismClass + "'><code class='" + prismClass + "'>" + prismString + "</code></pre>";
					} else {
						return prettyString;
					}
				}),
				catchError((error: any) => {
					this.logger.warn(starkPrettyPrintServiceName + " : invalid  : " + format + "data", error);
					return throwError(data);
				})
			);
		}
	}
}
