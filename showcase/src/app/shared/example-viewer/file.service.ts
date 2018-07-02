import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class FileService {
	public constructor(private http: HttpClient) {}

	public fetchFile(path: string): Observable<string> {
		return this.http.get(path, { responseType: "text" });
	}
}
