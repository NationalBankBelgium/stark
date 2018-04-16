import { StarkHttpService } from "../services/index";
import { StarkHttpRequest, StarkSingleItemResponseWrapper, StarkCollectionResponseWrapper } from "../entities/index";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

export class MockStarkHttpService implements StarkHttpService<any> {
	public readonly rawHttpClient: HttpClient;

	public executeSingleItemRequest: (request: StarkHttpRequest) => Observable<StarkSingleItemResponseWrapper<any>> = jasmine.createSpy(
		"executeSingleItemRequest"
	);
	public executeCollectionRequest: (request: StarkHttpRequest) => Observable<StarkCollectionResponseWrapper<any>> = jasmine.createSpy(
		"executeCollectionRequest"
	);
}
