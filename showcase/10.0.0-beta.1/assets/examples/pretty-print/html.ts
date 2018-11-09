import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-pretty-print",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent implements OnInit {
	public rawHtmlData: string;

	public ngOnInit(): void {
		this.rawHtmlData = `<!DOCTYPE html><html><head><style>body {background-color: powderblue;}h1{color: blue;}
			flashy{color: red;}</style></head><body><h1>This is a heading</h1><p class="flashy">
			This is a flashy paragraph.</p></body></html>`;
	}
}
