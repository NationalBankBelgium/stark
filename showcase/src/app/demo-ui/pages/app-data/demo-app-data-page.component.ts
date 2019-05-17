import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import {
	STARK_APP_METADATA,
	STARK_USER_SERVICE,
	StarkApplicationMetadata,
	StarkUser,
	StarkUserService
} from "@nationalbankbelgium/stark-core";
import * as moment from "moment";
import { ReferenceLink } from "../../../shared/components/reference-block";
import { filter } from "rxjs/operators";

@Component({
	selector: "demo-app-data",
	templateUrl: "./demo-app-data-page.component.html",
	styleUrls: ["./_demo-app-data-page.component.scss"],
	/* tslint:disable-next-line:use-view-encapsulation */
	encapsulation: ViewEncapsulation.None
})
export class DemoAppDataPageComponent implements OnInit {
	public user?: StarkUser;
	public time = moment().format("lll");

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark App Data component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppDataComponent.html"
		}
	];

	public constructor(
		@Inject(STARK_USER_SERVICE) public userService: StarkUserService,
		@Inject(STARK_APP_METADATA) public appMetadata: StarkApplicationMetadata
	) {}

	public ngOnInit(): void {
		this.userService
			.fetchUserProfile()
			.pipe(filter<StarkUser | undefined, StarkUser>((user?: StarkUser): user is StarkUser => typeof user !== "undefined"))
			.subscribe((user: StarkUser) => {
				this.user = user;
			});
	}
}
