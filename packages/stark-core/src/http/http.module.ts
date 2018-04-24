import { NgModule } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { StarkHttpServiceImpl, starkHttpServiceName } from "./services";
import { StarkLoggingService, starkLoggingServiceName } from "../logging";

// FIXME: remove this factory once LoggingService and SessionService are implemented
export function starkHttpServiceFactory(httpClient: HttpClient, starkLoggingService: StarkLoggingService): StarkHttpServiceImpl<any> {
	const sessionService: any = {
		fakePreAuthenticationHeaders: new Map<string, string>([["nbb-dummy-header", "some value"], ["nbb-another-header", "whatever"]])
	};

	return new StarkHttpServiceImpl(starkLoggingService, sessionService, httpClient);
}

@NgModule({
	imports: [HttpClientModule],
	providers: [
		// FIXME: replace this Factory provider by a simple Class provider once LoggingService and SessionService are implemented
		{ provide: starkHttpServiceName, useFactory: starkHttpServiceFactory, deps: [HttpClient, starkLoggingServiceName] }
	]
})
export class StarkHttpModule {}
