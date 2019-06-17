import { StarkSessionService } from "@nationalbankbelgium/stark-core";
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;

/**
 * @ignore
 */
export class MockStarkSessionService implements SpyObj<StarkSessionService> {
	public devAuthenticationHeaders: SpyObj<StarkSessionService>["devAuthenticationHeaders"];

	public getCurrentUser: SpyObj<StarkSessionService>["getCurrentUser"] = createSpy("getCurrentLanguage");
	public getCurrentLanguage: SpyObj<StarkSessionService>["getCurrentLanguage"] = createSpy("getCurrentLanguage");
	public setCurrentLanguage: SpyObj<StarkSessionService>["setCurrentLanguage"] = createSpy("setCurrentLanguage");
	public login: SpyObj<StarkSessionService>["login"] = createSpy("login");
	public logout: SpyObj<StarkSessionService>["logout"] = createSpy("logout");
	public pauseUserActivityTracking: SpyObj<StarkSessionService>["pauseUserActivityTracking"] = createSpy("pauseUserActivityTracking");
	public resumeUserActivityTracking: SpyObj<StarkSessionService>["resumeUserActivityTracking"] = createSpy("resumeUserActivityTracking");
	public setDevAuthenticationHeaders: SpyObj<StarkSessionService>["setDevAuthenticationHeaders"] = createSpy(
		"setDevAuthenticationHeaders"
	);

	public constructor(devAuthenticationHeaders?: Map<string, string>) {
		if (!devAuthenticationHeaders) {
			this.devAuthenticationHeaders = new Map<string, string>();
		} else {
			this.devAuthenticationHeaders = devAuthenticationHeaders;
		}
	}
}
