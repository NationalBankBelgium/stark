/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MaxLength, validateSync, ValidationError } from "class-validator";
import { StarkArrayIsValid, starkArrayIsValidValidatorName } from "./array-is-valid.validator.decorator";

class ValueClass {
	@MaxLength(10)
	public description!: string;
}

class MyClass {
	@StarkArrayIsValid()
	public dummyArray: (ValueClass | string)[] = [];
}

class SimpleClass {
	@StarkArrayIsValid()
	public name!: string;
}

describe("ValidatorDecorator: StarkArrayIsValid", () => {
	let myClass: MyClass;
	let simpleClass: SimpleClass;
	let valueClass: ValueClass;
	const validatorConstraintName: string = starkArrayIsValidValidatorName;

	beforeEach(() => {
		myClass = new MyClass();
		simpleClass = new SimpleClass();
		valueClass = new ValueClass();
	});

	it("should fail if the object to validate is not an Array", () => {
		const errors: ValidationError[] = validateSync(simpleClass);

		expect(errors.length).toBe(1);
		expect(errors[0].constraints).toBeDefined();
		expect(errors[0].constraints![validatorConstraintName]).toBeDefined();
	});

	it("should fail if Array contains invalid values", () => {
		valueClass.description = "this is not a valid length";
		myClass.dummyArray.push(valueClass);
		const errors: ValidationError[] = validateSync(myClass);

		expect(errors.length).toBe(1);
		expect(errors[0].constraints).toBeDefined();
		expect(errors[0].constraints![validatorConstraintName]).toBeDefined();
		expect(errors[0].constraints![validatorConstraintName]).toContain("array values");
	});

	it("should NOT fail if Array contains valid values", () => {
		valueClass.description = "length ok";
		myClass.dummyArray.push("stringValue");
		const errors: ValidationError[] = validateSync(myClass);

		expect(errors.length).toBe(0);
	});
});
