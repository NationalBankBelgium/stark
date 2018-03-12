import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class Title {
	public value = "Angular 2";

	constructor(public http: HttpClient) {}

	public getData(): Observable<any> {
		console.log("Title#getData(): Get Data");
		return this.http.get("/assets/data.json");
	}
}
