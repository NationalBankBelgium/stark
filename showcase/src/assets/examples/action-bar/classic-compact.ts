import { Component, Inject } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkAction, StarkActionBarConfig } from "@nationalbankbelgium/stark-ui";

@Component({
	selector: "demo-action-bar",
	templateUrl: "./demo-action-bar.component.html"
})
export class DemoActionBarComponent {
	public actions: StarkAction[] = [
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

	public actionBarConfig: StarkActionBarConfig = {
		actions: this.actions,
		isPresent: true
	};

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
}
