/* tslint:disable */
import { browser } from "protractor";
import "tslib";

describe("Home", () => {
	beforeEach(async () => {
		/**
		 * Change hash depending on router LocationStrategy.
		 */
		await browser.get("/#/home");
	});
});

/* tslint:enable */
