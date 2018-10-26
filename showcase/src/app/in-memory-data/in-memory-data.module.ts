import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
// using the full path to import the "HttpClientInMemoryWebApiModule" to avoid adding "@angular/http" to Showcase npm dependencies!
// see https://github.com/angular/in-memory-web-api/issues/215
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api/http-client-in-memory-web-api.module";
import { InMemoryDataService } from "./services";
import { InMemoryDataHttpInterceptor } from "./interceptors";

@NgModule({
	imports: [
		// advanced configuration for the HttpClientInMemoryWebApiModule (see https://github.com/angular/in-memory-web-api#advanced-features)
		// see all possible options in InMemoryBackendConfigArgs in node_modules/angular-in-memory-web-api/interfaces.d.ts
		HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
			delay: 100,
			apiBase: "/",
			passThruUnknownUrl: true
		})
	],
	providers: [
		// Add the InMemoryDataHttpInterceptor as an Http interceptor to adapt requests/responses according to the NBB Rest API Guide
		{ provide: HTTP_INTERCEPTORS, useClass: InMemoryDataHttpInterceptor, multi: true }
	]
})
export class InMemoryDataModule {}
