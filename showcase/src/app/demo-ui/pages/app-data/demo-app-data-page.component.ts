import { Component, Inject, OnInit } from "@angular/core";
import {
	STARK_APP_METADATA,
	STARK_LOGGING_SERVICE,
	STARK_SESSION_SERVICE,
	STARK_USER_SERVICE,
	StarkApplicationMetadata,
	StarkLoggingService,
	StarkSessionService,
	StarkUser,
	StarkUserService
} from "@nationalbankbelgium/stark-core";
import * as moment from "moment";
import { ReferenceLink } from "../../../shared/components/reference-block";
import { filter } from "rxjs/operators";

const componentName: string = "demo-app-data";

@Component({
	selector: "demo-app-data",
	templateUrl: "./demo-app-data-page.component.html"
})
export class DemoAppDataPageComponent implements OnInit {
	public referenceList: ReferenceLink[];
	public user?: StarkUser;
	public time: string;

	public constructor(
		@Inject(STARK_USER_SERVICE) public userService: StarkUserService,
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Inject(STARK_APP_METADATA) public appMetadata: StarkApplicationMetadata
	) {}

	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");

		this.referenceList = [
			{
				label: "Stark App Data component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppDataComponent.html"
			}
		];

		this.userService
			.fetchUserProfile()
			.pipe(filter<StarkUser | undefined, StarkUser>((user?: StarkUser): user is StarkUser => typeof user !== "undefined"))
			.subscribe((user: StarkUser) => {
				this.user = user;
			});

		this.time = moment().format("lll");
	}
}
