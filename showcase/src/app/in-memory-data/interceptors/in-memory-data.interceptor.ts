import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import cloneDeep from "lodash-es/cloneDeep";
import uniqueId from "lodash-es/uniqueId";

export interface HostUrlParts {
	protocol?: string;
	domain: string;
	port?: string;
	path: string;
}

/**
 * Angular Http interceptor that normalizes the requests and responses sent to/received from the "angular-in-memory-web-api" database
 *
 * Defined in the InMemoryDataModule set in showcase/src/app/in-memory-data/in-memory-data.module.ts
 */
@Injectable()
export class InMemoryDataHttpInterceptor implements HttpInterceptor {
	protected xsrfCookieName: string = "XSRF-TOKEN";

	public constructor() {
		/* empty constructor */
	}

	/**
	 * Intercept an outgoing `HttpRequest` and optionally transform it if necessary.
	 * @param request - The intercepted outgoing `HttpRequest`
	 * @param next - The next request handler where the `HttpRequest` will be forwarded to
	 * @returns The modified `HttpRequest` with the XSRF configuration enabled.
	 */
	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let httpRequest: HttpRequest<any> = request;
		const isGetCollectionRequest: boolean = this.isGetCollectionRequest(httpRequest);

		if (isGetCollectionRequest) {
			httpRequest = httpRequest.clone({
				params: httpRequest.params.delete("mockCollectionRequest")
			});
		}

		if (httpRequest.method === "POST" || httpRequest.method === "PUT") {
			httpRequest = this.interceptRequestPOST(httpRequest);
		}

		if (httpRequest.method === "GET") {
			httpRequest = this.interceptRequestGET(httpRequest);
		}

		return next
			.handle(httpRequest) // pass request through to the next request handler
			.pipe(
				map((httpResponse: HttpEvent<any>) => {
					if (httpResponse instanceof HttpResponse) {
						if (httpRequest.method === "GET") {
							httpResponse = this.interceptResponseGET(httpRequest, httpResponse);
						}

						if (isGetCollectionRequest) {
							httpResponse = this.normalizeCollectionResponse(httpResponse);
						}

						this.setXSRFCookie();
					}

					return httpResponse;
				})
			);
	}

	protected interceptRequestGET(request: HttpRequest<any>): HttpRequest<any> {
		let modifiedRequest: HttpRequest<any> = request;

		// for the "userprofile" request, remove the "style" param to let the in-memory-db handle the request properly
		if (request.url.match(/\/security\/userprofile/)) {
			modifiedRequest = request.clone({
				url: "/userprofile",
				params: request.params.delete("style")
			});
		}

		return modifiedRequest;
	}

	protected interceptRequestPOST(request: HttpRequest<any>): HttpRequest<any> {
		let modifiedRequest: HttpRequest<any>;

		// add a unique Id to the new item(s) if they don't have any
		const normalizedBody: any = cloneDeep(request.body);
		this.deepSetUniqueId(normalizedBody, "id");

		modifiedRequest = request.clone({
			body: normalizedBody
		});

		return modifiedRequest;
	}

	protected interceptResponseGET(request: HttpRequest<any>, response: HttpResponse<any>): HttpResponse<any> {
		let modifiedResponse: HttpResponse<any> = response;
		const urlParts: HostUrlParts = this.getHostUrlParts(request.url);

		// for the "userprofile" endpoint, return just the first profile in the array
		if (request.url.match(/userprofile/) && response.body instanceof Array) {
			const userProfile: any = response.body[0];
			modifiedResponse = response.clone<any>({
				body: userProfile
			});
		}

		// for requests with no path (targeting the root url of the backend)
		if (!urlParts.path) {
			const xsrfResponseHeaders: HttpHeaders = new HttpHeaders();

			modifiedResponse = response.clone({
				headers: xsrfResponseHeaders
					.set("Access-Control-Allow-Credentials", "true")
					.set("Access-Control-Allow-Origin", "http://localhost:3000")
			});
		}

		return modifiedResponse;
	}

	private normalizeCollectionResponse(httpResponse: HttpResponse<any>): HttpResponse<any> {
		let modifiedResponse: HttpResponse<any> = httpResponse;

		if (httpResponse.body instanceof Array) {
			const normalizedBody: any = cloneDeep(httpResponse.body);

			modifiedResponse = httpResponse.clone<any>({
				body: { items: normalizedBody, metadata: {} } // TODO: collection metadata
			});
		}

		return modifiedResponse;
	}

	protected isGetCollectionRequest(request: HttpRequest<any>): boolean {
		if (ENV === "development") {
			return request.method === "GET" && request.params.has("mockCollectionRequest");
		} else {
			return request.method === "GET"; // on PROD we take all GET requests as GetCollectionRequests
		}
	}

	protected deepSetUniqueId(item: any, idProperty: string): void {
		if (item instanceof Array) {
			for (const childItem of item) {
				this.deepSetUniqueId(childItem, idProperty);
			}
		} else if (typeof item === "object") {
			if (!item.hasOwnProperty(idProperty)) {
				item[idProperty] = uniqueId();
			}

			Object.keys(item).forEach((subItem: any) => {
				this.deepSetUniqueId(item[subItem], idProperty);
			});
		}
	}

	protected getHostUrlParts(url: string): HostUrlParts {
		// Regex to split all the parts of a URL
		// https://snippets.aktagon.com/snippets/72-split-a-url-into-protocol-domain-port-and-uri-using-regular-expressions
		const regexUrl: RegExp = /(https?:\/\/)?([^:^/]*)(:\d*)?(.*)?/;
		const matches: RegExpMatchArray = <RegExpMatchArray>url.match(regexUrl);

		return {
			protocol: matches[1],
			domain: matches[2],
			port: matches[3], // .replace(":", ""),
			path: matches[4]
		};
	}

	protected setXSRFCookie(): void {
		const xsrfToken: string = this.generateXSRFToken();

		// FIXME: why can't moment be loaded in this file?
		// const cookieExpiration: string = moment()
		// 	.add(40, "m")
		// 	.toDate()
		// 	.toUTCString(); // 40 minutes from now
		const expirationDate: Date = new Date();
		expirationDate.setTime(new Date().getTime() + 2400000); // 40 minutes from now
		const cookieExpiration: string = expirationDate.toUTCString();
		const cookieAttributes: string[] = [`${this.xsrfCookieName}=${xsrfToken}`, `path='/'`, `expires=${cookieExpiration}`];

		document.cookie = cookieAttributes.join(";");
	}

	protected generateXSRFToken(): string {
		return uniqueId("xsrf-token-");
	}
}
