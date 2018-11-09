import { StarkComponentUtil } from "./component.util";

/* tslint:disable:no-big-function */
describe("Util: ComponentUtil", () => {
	describe("isInputEnabled", () => {
		it("shouldReturnTrue", () => {
			let result: boolean = StarkComponentUtil.isInputEnabled("");
			expect(result).toBe(true);

			result = StarkComponentUtil.isInputEnabled("true");
			expect(result).toBe(true);

			result = StarkComponentUtil.isInputEnabled(<any>true);
			expect(result).toBe(true);
		});

		it("shouldReturnFalse", () => {
			let result: boolean = StarkComponentUtil.isInputEnabled("false");
			expect(result).toBe(false);

			result = StarkComponentUtil.isInputEnabled(<any>false);
			expect(result).toBe(false);

			/* tslint:disable-next-line:no-undefined-argument */
			result = StarkComponentUtil.isInputEnabled(undefined);
			expect(result).toBe(false);
		});
	});
});
