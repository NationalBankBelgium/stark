/**
 * @module
 * @description
 * Entry point for all public APIs of this package.
 */
// FIXME: replace this dummy mock by the actual mocks once implemented => export * from "../src/modules/<module>/testing";
export class MockStarkUIDummyService {
	public readonly someProperty: string = "dummy property";

	public someMethod: (someParam: any) => any = jasmine.createSpy("someMethod");
}

// This file only reexports content of the `src/modules/**/testing` folders. Keep it that way.
