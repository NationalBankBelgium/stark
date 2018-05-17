import { StarkHttpHeaders } from "../../http/constants";
import { StarkSessionService } from "../services";
import { Observable } from "rxjs";

export class MockStarkSessionService implements StarkSessionService {
	public fakePreAuthenticationHeaders: Map<string, string>;

	public getCurrentLanguage: () => Observable<string> = jasmine.createSpy("getCurrentLanguage");
	public setCurrentLanguage: () => Observable<string> = jasmine.createSpy("setCurrentLanguage");
	public login: () => Observable<string> = jasmine.createSpy("login");
	public logout: () => Observable<string> = jasmine.createSpy("logout");
	public pauseUserActivityTracking: () => Observable<string> = jasmine.createSpy("pauseUserActivityTracking");
	public resumeUserActivityTracking: () => Observable<string> = jasmine.createSpy("resumeUserActivityTracking");

	public constructor(fakePreAuthenticationHeaders?: Map<string, string>) {
		if (!fakePreAuthenticationHeaders) {
			this.fakePreAuthenticationHeaders = new Map<string, string>();
			this.fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_USER_NAME, "dummy username");
			this.fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_FIRST_NAME, "dummy firstName");
			this.fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_LAST_NAME, "dummy lastName");
			this.fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_MAIL, "dummy email");
			this.fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_LANGUAGE, "dummy language");
			this.fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_DESCRIPTION, "dummy description");
			this.fakePreAuthenticationHeaders.set(StarkHttpHeaders.NBB_ROLES, "dummy roles");
		} else {
			this.fakePreAuthenticationHeaders = fakePreAuthenticationHeaders;
		}
	}
}
