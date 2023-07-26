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
			expect(firstAccount.isPresent()).withContext("Unable to find login.").toBeTruthy();

			try {
				await firstAccount.click();
			} catch (e) {
				fail("Unable to click first account");
			}

			const logoutButton: ElementFinder = element(by.css(".stark-app-logout"));
			expect(logoutButton.isPresent()).withContext("Unable to find logout button").toBeTruthy();
		});

		it("should have stark logo", async () => {
			const subject: ElementFinder = element(by.className("stark-app-logo"));
			expect(await subject.isPresent())
				.withContext("Unable to find logo")
				.toBeTruthy();
		});

		it("should have 'Stark Starter Application' as header", async () => {
			const subject: ElementFinder = element(by.css(".stark-main-container h1"));
			expect(subject.isPresent()).withContext("No h1 found").toBeTruthy();
			expect(await subject.getText()).toEqual("Stark Starter Application");
		});
	});
});
