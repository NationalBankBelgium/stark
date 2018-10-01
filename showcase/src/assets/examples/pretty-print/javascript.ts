import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-pretty-print",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent implements OnInit {
	public rawJavascriptData: string;

	public ngOnInit(): void {
		this.rawJavascriptData = [
			"function calculateData(seed, operationFn) {",
			"var data = operationFn(seed);",
			"if (!data){",
			"data = 'could not calculate data';",
			"}",
			"return data;",
			"}"
		].join("");
	}
}
