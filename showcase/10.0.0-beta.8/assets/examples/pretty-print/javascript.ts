import { Component } from "@angular/core";

@Component({
	selector: "demo-pretty-print",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent {
	public rawJavascriptData = [
		"function calculateData(seed, operationFn) {",
		"var data = operationFn(seed);",
		"if (!data){",
		"data = 'could not calculate data';",
		"}",
		"return data;",
		"}"
	].join("");
}
