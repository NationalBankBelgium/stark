import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { mdiWall, mdiAtom, mdiTelevisionGuide, mdiShieldLockOutline, mdiTheater } from "@nationalbankbelgium/mdi-ts";

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: "home",
	templateUrl: "./home-page.component.html"
})
export class HomePageComponent implements OnInit {
	protected readonly mdiWall = mdiWall;
	protected readonly mdiAtom = mdiAtom;
	protected readonly mdiTelevisionGuide = mdiTelevisionGuide;
	protected readonly mdiShieldLockOutline = mdiShieldLockOutline;
	protected readonly mdiTheater = mdiTheater;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `Home` component");
	}
}
