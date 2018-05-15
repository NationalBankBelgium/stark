import { StarkHttpService } from "../services";
import { StarkHttpRequest, StarkSingleItemResponseWrapper, StarkCollectionResponseWrapper } from "../entities";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class MockStarkHttpService implements StarkHttpService<any> {
	public readonly rawHttpClient: HttpClient;

	public executeSingleItemRequest: (request: StarkHttpRequest) => Observable<StarkSingleItemResponseWrapper<any>> = jasmine.createSpy(
		"executeSingleItemRequest"
	);
	public executeCollectionRequest: (request: StarkHttpRequest) => Observable<StarkCollectionResponseWrapper<any>> = jasmine.createSpy(
		"executeCollectionRequest"
	);
}
