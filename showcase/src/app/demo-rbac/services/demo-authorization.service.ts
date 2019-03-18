import { StarkRBACAuthorizationServiceImpl } from "@nationalbankbelgium/stark-rbac";
import { StarkUser } from "@nationalbankbelgium/stark-core";
import { Injectable } from "@angular/core";

@Injectable()
export class DemoAuthorizationService extends StarkRBACAuthorizationServiceImpl {
	/**
	 * To be called only when the app initializes
	 */
	public initializeService(): void {
		this.sessionService.getCurrentUser().subscribe(
			(user: StarkUser | undefined) => {
				if (user) {
					this.user = { ...user, roles: [...user.roles, "blabla"] };
				}
			},
			() => {
				throw new Error("DemoAuthorizationService: error while getting the user profile");
			}
		);

		this.registerTransitionHook();
	}
}
