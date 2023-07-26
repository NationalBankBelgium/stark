import { browser } from "protractor";
// eslint-disable-next-line import/no-unassigned-import
import "tslib";

describe("Home", () => {
	beforeEach(async () => {
		/**
		 * Change hash depending on router LocationStrategy.
		 */
		await browser.get("/#/home");
	});
});
