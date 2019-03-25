import { browser, by, element, ElementFinder } from "protractor";

describe("General tests:", () => {
	beforeAll(async () => {
		await browser.get("");
	});

	it("should have title 'Stark Starter'", async () => {
		const subject: string = await browser.driver.getTitle();
		const result = "Stark Starter";
		expect(subject).toBe(result);
	});

	describe("Login flow:", () => {
		it("should login when clicking first account", async () => {
			const firstAccount: ElementFinder = element(by.css("stark-login-page ul li:first-child > a"));
			expect(firstAccount.isPresent()).toBeTruthy("Unable to find login.");

			try {
				await firstAccount.click();
			} catch (e) {
				fail("Unable to click first account");
			}

			const logoutButton: ElementFinder = element(by.css(".stark-app-logout"));
			expect(logoutButton.isPresent()).toBeTruthy("Unable to find logout button");
		});

		it("should have stark logo", async () => {
			const subject: ElementFinder = element(by.className("stark-app-logo"));
			expect(subject.isPresent()).toBeTruthy("Unable to find logo");
		});

		it("should have 'Stark Starter Application' as header", async () => {
			const subject: ElementFinder = element(by.css(".stark-main-container h1"));
			expect(subject.isPresent()).toBeTruthy("No h1 found");
			expect(await subject.getText()).toEqual("Stark Starter Application");
		});
	});
});
