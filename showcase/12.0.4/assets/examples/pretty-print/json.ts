import { Component } from "@angular/core";

@Component({
	selector: "demo-pretty-print",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent {
	public rawJsonData = [
		'{"menu": { "id": "file", "value": "File",',
		'"menuitem": [{"value": "New", "onclick": "CreateNewDoc()"},',
		'{"value": "Open", "onclick": "OpenDoc()"},',
		'{"value": "Close", "onclick": "CloseDoc()"}]}}'
	].join("");
}
