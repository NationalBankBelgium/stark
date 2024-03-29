import { StarkFormControlState, StarkFormUtil } from "./form.util";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import startCase from "lodash-es/startCase";

describe("Util: FormUtil", () => {
	const formItemStates: string[] = ["untouched", "touched", "pristine", "dirty"];

	let mockUntypedFormGroup: UntypedFormGroup;
	let mockFormControls: UntypedFormControl[];

	function getMockFormControl(name: string): UntypedFormControl {
		// prettier-ignore
		return <UntypedFormControl>
			(<unknown>(
				jasmine.createSpyObj<UntypedFormControl>(name, [
					"value",
					"setValue",
					"markAsUntouched",
					"markAsTouched",
					"markAsPristine",
					"markAsDirty"
				])
			)
		);
	}

	function assertFormControl(formItem: UntypedFormControl, newState?: string): void {
		if (newState) {
			const newStateSetter: string = "markAs" + startCase(newState);
			expect(formItem[newStateSetter]).toHaveBeenCalledTimes(1);
		}

		// check that the setters for other states where not called
		const nonUsedStates: string[] = formItemStates.filter((state: string) => state !== newState);
		for (const nonUsedState of nonUsedStates) {
			const nonUsedStateSetter: string = "markAs" + startCase(nonUsedState);
			expect(formItem[nonUsedStateSetter]).not.toHaveBeenCalled();
		}
	}

	beforeEach(() => {
		mockFormControls = [getMockFormControl("item1"), getMockFormControl("item2")];

		mockUntypedFormGroup = <any>{
			controls: {
				formControl0: mockFormControls[0],
				formControl1: mockFormControls[1]
			}
		};
	});

	describe("setFormChildControlsState", () => {
		it("should call markAsTouched() on every form control if state to be set is 'touched'", () => {
			const stateToBeSet: StarkFormControlState = "touched";

			StarkFormUtil.setFormChildControlsState(mockUntypedFormGroup, [stateToBeSet]);

			for (const formControl of mockFormControls) {
				assertFormControl(formControl, stateToBeSet);
			}
		});

		it("should call markAsUntouched() on every form control if state to be set is 'untouched'", () => {
			const stateToBeSet: StarkFormControlState = "untouched";

			StarkFormUtil.setFormChildControlsState(mockUntypedFormGroup, [stateToBeSet]);

			for (const formControl of mockFormControls) {
				assertFormControl(formControl, stateToBeSet);
			}
		});

		it("should call markAsPristine() on every form control if state to be set is 'pristine'", () => {
			const stateToBeSet: StarkFormControlState = "pristine";

			StarkFormUtil.setFormChildControlsState(mockUntypedFormGroup, [stateToBeSet]);

			for (const formControl of mockFormControls) {
				assertFormControl(formControl, stateToBeSet);
			}
		});

		it("should call markAsDirty() on every form control if state to be set is 'dirty'", () => {
			const stateToBeSet: StarkFormControlState = "dirty";

			StarkFormUtil.setFormChildControlsState(mockUntypedFormGroup, [stateToBeSet]);

			for (const formControl of mockFormControls) {
				assertFormControl(formControl, stateToBeSet);
			}
		});

		it("should NOT call any method on any form control if state to be set is unknown", () => {
			const stateToBeSet: any = "unknown state";

			StarkFormUtil.setFormChildControlsState(mockUntypedFormGroup, [stateToBeSet]);

			for (const formControl of mockFormControls) {
				assertFormControl(formControl);
			}
		});
	});

	describe("setFormControlState", () => {
		let formItem: UntypedFormControl;

		beforeEach(() => {
			formItem = getMockFormControl("dummy item");
		});

		it("should call markAsTouched() on the given form item if state to be set is 'touched'", () => {
			const stateToBeSet: StarkFormControlState = "touched";

			StarkFormUtil.setFormControlState(formItem, [stateToBeSet]);

			assertFormControl(formItem, stateToBeSet);
		});

		it("should call markAsUntouched() on the given form item if state to be set is 'untouched'", () => {
			const stateToBeSet: StarkFormControlState = "untouched";

			StarkFormUtil.setFormControlState(formItem, [stateToBeSet]);

			assertFormControl(formItem, stateToBeSet);
		});

		it("should call markAsPristine() on the given form item if state to be set is 'pristine'", () => {
			const stateToBeSet: StarkFormControlState = "pristine";

			StarkFormUtil.setFormControlState(formItem, [stateToBeSet]);

			assertFormControl(formItem, stateToBeSet);
		});

		it("should call markAsDirty() on the given form item if state to be set is 'dirty'", () => {
			const stateToBeSet: StarkFormControlState = "dirty";

			StarkFormUtil.setFormControlState(formItem, [stateToBeSet]);

			assertFormControl(formItem, stateToBeSet);
		});

		it("should NOT call any method on the given form item if state to be set is unknown", () => {
			const stateToBeSet: any = "unknown state";

			StarkFormUtil.setFormControlState(formItem, [stateToBeSet]);

			assertFormControl(formItem);
		});
	});

	describe("isFormGroupValid", () => {
		it("should set form state to 'pristine' and return TRUE if the form is valid", () => {
			spyOn(StarkFormUtil, "setFormChildControlsState");

			const result: boolean = StarkFormUtil.isFormGroupValid(mockUntypedFormGroup);

			expect(result).toBe(true);
			expect(StarkFormUtil.setFormChildControlsState).toHaveBeenCalledTimes(1);
			expect(StarkFormUtil.setFormChildControlsState).toHaveBeenCalledWith(mockUntypedFormGroup, ["pristine"]);
		});

		it("should set form state to 'touched' and return FALSE if the form is NOT valid", () => {
			mockUntypedFormGroup = <any>{
				controls: {
					formControl0: mockFormControls[0],
					formControl1: mockFormControls[1]
				},
				invalid: true
			};

			spyOn(StarkFormUtil, "setFormChildControlsState");

			const result: boolean = StarkFormUtil.isFormGroupValid(mockUntypedFormGroup);

			expect(result).toBe(false);
			expect(StarkFormUtil.setFormChildControlsState).toHaveBeenCalledTimes(1);
			expect(StarkFormUtil.setFormChildControlsState).toHaveBeenCalledWith(mockUntypedFormGroup, ["touched"]);
		});
	});

	describe("isFormGroup", () => {
		it("should return TRUE if the form is an instance of an FormGroup", () => {
			const result: boolean = StarkFormUtil.isFormGroup(mockUntypedFormGroup);

			expect(result).toBe(true);
		});

		it("should return FALSE if the form is NOT an instance of an FormGroup", () => {
			const result: boolean = StarkFormUtil.isFormGroup("this is not a form");

			expect(result).toBe(false);
		});
	});

	describe("isFormControl", () => {
		it("should return TRUE if the form item is an instance of an FormControl", () => {
			const mockFormItem: UntypedFormControl = getMockFormControl("dummy item");

			const result: boolean = StarkFormUtil.isFormControl(mockFormItem);

			expect(result).toBe(true);
		});

		it("should return FALSE if the form item is NOT an instance of an FormControl", () => {
			const result: boolean = StarkFormUtil.isFormControl("this is not a form item");

			expect(result).toBe(false);
		});
	});
});
