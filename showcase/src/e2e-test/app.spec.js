const BASE_URL = "http://bs-local.com:3000";

describe("General tests:", () => {
	beforeEach(async () => {
		await browser.driver.get(BASE_URL);
	});

	it("Site should load", async () => {
		const subject = await browser.driver.getTitle();
		const result = "Stark Showcase";
		expect(subject).toBe(result);
	});
});
