import { Component, OnInit } from "@angular/core";

@Component({
	selector: "demo-pretty-print-example",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent implements OnInit {
	public rawSqlData: string;

	public ngOnInit(): void {
		this.rawSqlData = [
			"SELECT DISTINCT Name FROM Production.Product AS p WHERE EXISTS (SELECT * ",
			"FROM Production.ProductModel AS pm WHERE p.ProductModelID = pm.ProductModelID ",
			"AND pm.Name LIKE 'Long-Sleeve Logo Jersey%')"
		].join("");
	}
}
