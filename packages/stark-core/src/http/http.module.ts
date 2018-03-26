import { NgModule } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { StarkHttpServiceImpl, starkHttpServiceName } from "./services/index";

// FIXME: remove this factory once LoggingService and SessionService are implemented
const starkHttpServiceFactory: any = (httpClient: HttpClient) => {
	const logger: any = {
		debug: console.debug,
		warn: console.warn,
		error: console.error,
		correlationId: "dummy-correlation-id"
	};

	const sessionService: any = {
		fakePreAuthenticationHeaders: new Map<string, string>([["nbb-dummy-header", "some value"], ["nbb-another-header", "whatever"]])
	};

	return new StarkHttpServiceImpl(logger, sessionService, httpClient);
};

@NgModule({
	imports: [HttpClientModule],
	providers: [
		// FIXME: replace this Factory provider by a simple Class provider once LoggingService and SessionService are implemented
		{ provide: starkHttpServiceName, useFactory: starkHttpServiceFactory, deps: [HttpClient] }
	]
})
export class StarkHttpModule {}
