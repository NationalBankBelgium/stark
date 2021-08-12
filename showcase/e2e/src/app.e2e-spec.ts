import { browser, by, element, ElementFinder } from "protractor";

describe("General tests:", () => {
	beforeAll(async () => {
		await browser.get("");
	});

	it("should have title 'Stark Showcase'", async () => {
		const subject: string = await browser.driver.getTitle();
		const result = "Stark Showcase";
		expect(subject).toBe(result);
	});

	it("should have stark logo", () => {
		const subject: ElementFinder = element(by.css(".stark-app-bar stark-app-logo"));
		expect(subject.isPresent()).withContext("Unable to find logo").toBeTruthy();
	});
});
