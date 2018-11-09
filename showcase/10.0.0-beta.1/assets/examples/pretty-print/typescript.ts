import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-pretty-print",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent implements OnInit {
	public rawTypescriptData: string;

	public ngOnInit(): void {
		this.rawTypescriptData = [
			"function calculateData(seed:any, operationFn:Function):any {",
			"var data:any = operationFn(seed);",
			"if (!data){",
			"data = 'could not calculate data';",
			"}",
			"return data;",
			"}"
		].join("");
	}
}
