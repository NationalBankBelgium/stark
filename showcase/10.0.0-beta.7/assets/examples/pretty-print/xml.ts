import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-pretty-print",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent implements OnInit {
	public rawXmlData: string;

	public ngOnInit(): void {
		this.rawXmlData = `<menu id="file" value="File"><menuitem value="New" onclick="CreateNewDoc()" />
			<menuitem value="Open" onclick="OpenDoc()" />
			<menuitem value="Close" onclick="CloseDoc()" /></menu>`;
	}
}
