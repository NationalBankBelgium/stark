import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-pretty-print-example",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent implements OnInit {
	public rawJsonData: string;

	public ngOnInit(): void {
		this.rawJsonData = [
			'{"menu": { "id": "file", "value": "File",',
			'"menuitem": [{"value": "New", "onclick": "CreateNewDoc()"},',
			'{"value": "Open", "onclick": "OpenDoc()"},',
			'{"value": "Close", "onclick": "CloseDoc()"}]}}'
		].join("");
	}
}
