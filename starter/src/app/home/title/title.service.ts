import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class Title {
	public value: string = "Angular 2";
	public http: HttpClient;

	public constructor(http: HttpClient) {
		this.http = http;
	}

	public getData(): Observable<any> {
		console.log("Title#getData(): Get Data");
		return this.http.get("/assets/data.json");
	}
}
