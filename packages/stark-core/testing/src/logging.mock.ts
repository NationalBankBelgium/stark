import { StarkLoggingService } from "@nationalbankbelgium/stark-core";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkLoggingService} interface.
 */
export class MockStarkLoggingService implements SpyObj<StarkLoggingService> {
	/**
	 * See [StarkLoggingService correlationId]{@link StarkLoggingService#correlationId} property
	 */
	public correlationId: StarkLoggingService["correlationId"];

	/**
	 * See [StarkLoggingService correlationIdHttpHeaderName]{@link StarkLoggingService#correlationIdHttpHeaderName} property
	 */
	public correlationIdHttpHeaderName: StarkLoggingService["correlationIdHttpHeaderName"];

	/**
	 * See [StarkLoggingService generateNewCorrelationId()]{@link StarkLoggingService#generateNewCorrelationId} method
	 */
	public generateNewCorrelationId: Spy<StarkLoggingService["generateNewCorrelationId"]> = createSpy("generateNewCorrelationId");

	/**
	 * See [StarkLoggingService debug()]{@link StarkLoggingService#debug} method
	 */
	public debug: Spy<StarkLoggingService["debug"]> = createSpy("debug");

	/**
	 * See [StarkLoggingService info()]{@link StarkLoggingService#info} method
	 */
	public info: Spy<StarkLoggingService["info"]> = createSpy("info");

	/**
	 * See [StarkLoggingService warn()]{@link StarkLoggingService#warn} method
	 */
	public warn: Spy<StarkLoggingService["warn"]> = createSpy("warn");

	/**
	 * See [StarkLoggingService error()]{@link StarkLoggingService#error} method
	 */
	public error: Spy<StarkLoggingService["error"]> = createSpy("error");

	/**
	 * Creates a new mock instance.
	 * @param mockCorrelationId - Correlation id to set to this instance
	 * @param mockCorrelationIdHeaderName - Correlation header name to set to this instance
	 */
	public constructor(
		mockCorrelationId: string = "dummyCorrelationId",
		mockCorrelationIdHeaderName: string = "Correlation-Id-HttpHeaderName"
	) {
		this.correlationId = mockCorrelationId;
		this.correlationIdHttpHeaderName = mockCorrelationIdHeaderName;
	}
}
