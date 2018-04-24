import { StarkLoggingService } from "../services";

export class MockStarkLoggingService implements StarkLoggingService {
	public correlationId: string;

	public debug: () => void = jasmine.createSpy("debug");
	public info: () => void = jasmine.createSpy("info");
	public warn: () => void = jasmine.createSpy("warn");
	public error: () => void = jasmine.createSpy("error");
	public generateNewCorrelationId: () => string = jasmine.createSpy("generateNewCorrelationId");

	public constructor(correlationId: string = "dummyCorrelationId") {
		this.correlationId = correlationId;
	}
}
