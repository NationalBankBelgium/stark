import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkAction, StarkActionBarConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-action-bar",
	templateUrl: "./demo-action-bar-page.component.html"
})
export class DemoActionBarPageComponent implements OnInit {
	public actions: StarkAction[];
	public actionBarConfig: StarkActionBarConfig;
	public alternativeActions: StarkAction[];
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.actions = [
			{
				id: "actionValidate",
				buttonColor: "success",
				label: "STARK.ICONS.APPROVE_ITEM",
				icon: "check",
				actionCall: ($event: Event, data: any): void => {
					this.logger.debug($event);
					this.logger.debug(data);
				},
				isEnabled: true,
				isVisible: true
			},
			{
				id: "actionSave",
				label: "STARK.ICONS.SAVE_ITEM",
				icon: "content-save",
				actionCall: ($event: Event, data: any): void => {
					this.logger.debug($event);
					this.logger.debug(data);
				},
				isEnabled: true,
				isVisible: true
			},
			{
				id: "actionDelete",
				label: "STARK.ICONS.DELETE_ITEM",
				icon: "delete",
				actionCall: ($event: Event, data: any): void => {
					this.logger.debug($event);
					this.logger.debug(data);
				},
				isEnabled: false,
				isVisible: true
			},
			{
				id: "actionClose",
				label: "STARK.ICONS.CLOSE_ITEM",
				icon: "close",
				actionCall: ($event: Event, data: any): void => {
					this.logger.debug($event);
					this.logger.debug(data);
				},
				isEnabled: true,
				isVisible: true
			}
		];

		this.referenceList = [
			{
				label: "Stark Action Bar component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkActionBarComponent.html"
			}
		];

		this.actionBarConfig = {
			actions: this.actions,
			isPresent: true
		};

		this.alternativeActions = [
			{
				id: "actionAdd",
				buttonColor: "warn",
				label: "STARK.ICONS.ADD_ITEM",
				icon: "account-plus",
				actionCall: ($event: Event, data: any): void => {
					this.logger.debug($event);
					this.logger.debug(data);
				},
				isEnabled: true,
				isVisible: true
			},
			{
				id: "actionMinus",
				label: "STARK.ICONS.DELETE_ITEM",
				icon: "account-minus",
				actionCall: ($event: Event, data: any): void => {
					this.logger.debug($event);
					this.logger.debug(data);
				},
				isEnabled: false,
				isVisible: true
			},
			{
				id: "actionEdit",
				label: "STARK.ICONS.EDIT_ITEM",
				icon: "pencil",
				actionCall: ($event: Event, data: any): void => {
					this.logger.debug($event);
					this.logger.debug(data);
				},
				isEnabled: true,
				isVisible: true
			}
		];
	}
}
