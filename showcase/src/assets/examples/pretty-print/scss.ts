import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-pretty-print-example",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent implements OnInit {
	public rawScssData: string;

	public ngOnInit(): void {
		this.rawScssData = [
			"$font-stack: Helvetica, sans-serif; $primary-color: #333; body { font: 100% $font-stack; color: $primary-color; }"
		].join("");
	}
}
