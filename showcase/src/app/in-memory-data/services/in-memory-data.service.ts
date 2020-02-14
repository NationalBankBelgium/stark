import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import cloneDeep from "lodash-es/cloneDeep";
// using the full path to import the "angular-in-memory-web-api" interfaces to avoid adding "@angular/http" to Showcase npm dependencies!
// see https://github.com/angular/in-memory-web-api/issues/215
import {
	InMemoryDbService,
	ParsedRequestUrl,
	RequestInfo,
	RequestInfoUtilities,
	ResponseOptions
} from "angular-in-memory-web-api/interfaces";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

const mockData: object = require("../../../../config/json-server/data.json");

@Injectable()
export class InMemoryDataService implements InMemoryDbService {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {
		/* empty constructor */
	}

	/**
	 * Method called by the "angular-in-memory-web-api" to create the "database" hash whose keys are collection names and
	 * whose values are arrays of collection objects to return or update
	 * @param _reqInfo - The RequestInfo object in case this method is invoked as a result of a POST `commands/resetDb` request
	 * @returns The "database" object or an Observable of Promise that will return such object asynchronously
	 * @link https://github.com/angular/in-memory-web-api#basic-setup
	 */
	public createDb(_reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
		// replace the "uuid" field defined in the mock data by the "id" field expected by the in-memory-db
		const normalizedMockData: object = cloneDeep(mockData); // avoid modifying the original mock data
		this.deepReplaceProperty(normalizedMockData, "uuid", "id");

		// 	IMPORTANT: cannot mock "logging" and "logout" requests since they are performed via XHR and not via Angular
		return normalizedMockData;
	}

	/**
	 * Custom implementation of the "parseRequestUrl" method which will be called by the "angular-in-memory-web-api"
	 * @param _url - The request URL
	 * @param _requestInfoUtils - Some utility methods provided by the "angular-in-memory-web-api" library including the default parser.
	 * @returns The ParsedRequestUrl object in case the original one was modified or "undefined" to let the service use the default parser.
	 * @link https://github.com/angular/in-memory-web-api#custom-parserequesturl
	 */
	public parseRequestUrl(_url: string, _requestInfoUtils: RequestInfoUtilities): ParsedRequestUrl | undefined {
		// the default parser is in the RequestInfoUtilities. You can use it by calling  _requestInfoUtils.parseRequestUrl(_url))
		return undefined;
	}

	/**
	 * Method to override the default handling of Http GET requests
	 * @param requestInfo - The RequestInfo object with info about the current request url extracted from an Http Request.
	 * @returns An observable that will emit the Http response in case it is manually constructed or "undefined" to let the service
	 * continue with its default processing of the HTTP request.
	 * @link https://github.com/angular/in-memory-web-api#http-method-interceptors
	 */
	public get(requestInfo: RequestInfo): Observable<Response> | undefined {
		if (requestInfo.apiBase === "/" && (requestInfo.collectionName === undefined || requestInfo.collectionName === "")) {
			const inMemoryDBResponse = `<h2>Congrats!</h2>
				<p>You\'re successfully running <b>Stark in memory database</b></p>
				<br>
				<p>
				  To access and modify resources, you can use any HTTP method
				  <br>
				  <ul>
				  <li><code>GET</code></li>
				  <li><code>POST</code></li>
				  <li><code>PUT</code></li>
				  <li><code>PATCH</code></li>
				  <li><code>DELETE</code></li>
				</p>`;

			return requestInfo.utils.createResponse$(() => {
				return {
					body: inMemoryDBResponse,
					status: 200,
					url: requestInfo.url
				};
			});
		}

		return undefined; // do not intercept, let the default GET handle it
	}

	/**
	 * Response interceptor to be called by this service.
	 * This can be used to modify the response before returning it (for example: to add a header that your application is expecting)
	 * @param response - The intercepted Response object.
	 * @param _requestInfo - The RequestInfo object with info about the current request url extracted from an Http Request.
	 * @returns The modified response (if needed)
	 * @link https://github.com/angular/in-memory-web-api#responseinterceptor
	 */
	public responseInterceptor(response: ResponseOptions, _requestInfo: RequestInfo): ResponseOptions {
		// a full copy of the database can be retrieved by calling _requestInfo.utils.getDb())

		// replace the "id" field coming from the in-memory-db by the "uuid" field expected by the application
		const normalizedBody: any = cloneDeep(response.body);
		this.deepReplaceProperty(normalizedBody, "id", "uuid");
		response.body = normalizedBody;

		return response;
	}

	/**
	 * Replace an object property recursively
	 */
	protected deepReplaceProperty(item: any, property: string, newProperty: string): void {
		if (item instanceof Array) {
			for (const childItem of item) {
				this.deepReplaceProperty(childItem, property, newProperty);
			}
		} else if (typeof item === "object") {
			if (item.hasOwnProperty(property)) {
				item[newProperty] = item[property];
				delete item[property];
			}

			Object.keys(item).forEach((subItem: any) => {
				this.deepReplaceProperty(item[subItem], property, newProperty);
			});
		}
	}
}
