import { Component } from "@angular/core";

@Component({
	selector: "demo-pretty-print",
	templateUrl: "./demo-pretty-print.component.html",
	styleUrls: ["./demo-pretty-print.component.scss"]
})
export class DemoPrettyPrintComponent {
	public rawSqlData = [
		"SELECT DISTINCT Name FROM Production.Product AS p WHERE EXISTS (SELECT * ",
		"FROM Production.ProductModel AS pm WHERE p.ProductModelID = pm.ProductModelID ",
		"AND pm.Name LIKE 'Long-Sleeve Logo Jersey%')"
	].join("");
}
