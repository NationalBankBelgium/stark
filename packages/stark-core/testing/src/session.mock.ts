import { StarkSessionService } from "@nationalbankbelgium/stark-core";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * Mock class of the {@link StarkSessionService} interface.
 */
export class MockStarkSessionService implements SpyObj<StarkSessionService> {
	/**
	 * See [StarkSessionService devAuthenticationHeaders]{@link StarkSessionService#devAuthenticationHeaders} property
	 */
	public devAuthenticationHeaders: StarkSessionService["devAuthenticationHeaders"];

	/**
	 * See [StarkSessionService getCurrentUser()]{@link StarkSessionService#getCurrentUser} method
	 */
	public getCurrentUser: Spy<StarkSessionService["getCurrentUser"]> = createSpy("getCurrentUser");

	/**
	 * See [StarkSessionService getCurrentLanguage()]{@link StarkSessionService#getCurrentLanguage} method
	 */
	public getCurrentLanguage: Spy<StarkSessionService["getCurrentLanguage"]> = createSpy("getCurrentLanguage");

	/**
	 * See [StarkSessionService setCurrentLanguage()]{@link StarkSessionService#setCurrentLanguage} method
	 */
	public setCurrentLanguage: Spy<StarkSessionService["setCurrentLanguage"]> = createSpy("setCurrentLanguage");

	/**
	 * See [StarkSessionService login()]{@link StarkSessionService#login} method
	 */
	public login: Spy<StarkSessionService["login"]> = createSpy("login");

	/**
	 * See [StarkSessionService logout()]{@link StarkSessionService#logout} method
	 */
	public logout: Spy<StarkSessionService["logout"]> = createSpy("logout");

	/**
	 * See [StarkSessionService pauseUserActivityTracking()]{@link StarkSessionService#pauseUserActivityTracking} method
	 */
	public pauseUserActivityTracking: Spy<StarkSessionService["pauseUserActivityTracking"]> = createSpy("pauseUserActivityTracking");

	/**
	 * See [StarkSessionService resumeUserActivityTracking()]{@link StarkSessionService#resumeUserActivityTracking} method
	 */
	public resumeUserActivityTracking: Spy<StarkSessionService["resumeUserActivityTracking"]> = createSpy("resumeUserActivityTracking");

	/**
	 * See [StarkSessionService setDevAuthenticationHeaders()]{@link StarkSessionService#setDevAuthenticationHeaders} method
	 */
	public setDevAuthenticationHeaders: Spy<StarkSessionService["setDevAuthenticationHeaders"]> = createSpy("setDevAuthenticationHeaders");

	/**
	 * Creates a new mock instance.
	 * @param devAuthenticationHeaders - Development authentication headers to set to this instance
	 */
	public constructor(devAuthenticationHeaders?: Map<string, string | string[]>) {
		if (!devAuthenticationHeaders) {
			this.devAuthenticationHeaders = new Map<string, string>();
		} else {
			this.devAuthenticationHeaders = devAuthenticationHeaders;
		}
	}
}
