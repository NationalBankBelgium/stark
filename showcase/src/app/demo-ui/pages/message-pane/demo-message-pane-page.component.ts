import { Component, Inject, Renderer2 } from "@angular/core";
import {
	STARK_MESSAGE_PANE_SERVICE,
	starkMessagePaneAlignClassPrefix,
	StarkMessagePaneService,
	StarkMessageType
} from "@nationalbankbelgium/stark-ui";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../../shared/components";
import uniqueId from "lodash-es/uniqueId";

@Component({
	selector: "demo-message-pane",
	templateUrl: "./demo-message-pane-page.component.html"
})
export class DemoMessagePanePageComponent {
	public messagePanePosition = "right";
	public starkMessagePaneString = ".stark-message-pane";

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Message Pane component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkMessagePaneComponent.html"
		}
	];

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_MESSAGE_PANE_SERVICE) public starkMessagePaneService: StarkMessagePaneService,
		protected renderer: Renderer2
	) {}

	public notifyMessages(): void {
		this.starkMessagePaneService.add([
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.ERROR_1",
				interpolateValues: { priority: "priority = 500" },
				code: "54987",
				type: StarkMessageType.ERROR,
				priority: 500
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.ERROR_2",
				interpolateValues: { priority: "priority = 10" },
				code: "333",
				type: StarkMessageType.ERROR,
				priority: 10
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.ERROR_3",
				interpolateValues: { priority: "priority = 200" },
				code: "777",
				type: StarkMessageType.ERROR,
				priority: 200
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.WARNINGS.WARNING_1",
				interpolateValues: { priority: "priority = 1" },
				code: "",
				type: StarkMessageType.WARNING,
				priority: 1
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.WARNINGS.WARNING_2",
				interpolateValues: { priority: "priority = undefined" },
				code: "PMO",
				type: StarkMessageType.WARNING
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.INFOS.INFO_1",
				interpolateValues: { priority: "priority = undefined" },
				code: "54987",
				type: StarkMessageType.INFO
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.INFOS.INFO_2",
				interpolateValues: { priority: "priority = 998" },
				code: "333",
				type: StarkMessageType.INFO,
				priority: 998
			}
		]);
	}

	public clearMessages(): void {
		this.starkMessagePaneService.clearAll();
	}

	public clearAndNotifyMessages(): void {
		this.starkMessagePaneService.clearAll();
		this.starkMessagePaneService.add([
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.NEW_ERROR_1",
				interpolateValues: {},
				code: "54987",
				type: StarkMessageType.ERROR
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.NEW_ERROR_2",
				interpolateValues: {},
				code: "333",
				type: StarkMessageType.ERROR
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.WARNINGS.NEW_WARNING_1",
				interpolateValues: {},
				code: "",
				type: StarkMessageType.WARNING
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.INFOS.NEW_INFO_1",
				interpolateValues: {},
				code: "54987",
				type: StarkMessageType.INFO
			},
			{
				id: uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.INFOS.NEW_INFO_2",
				interpolateValues: {},
				code: "333",
				type: StarkMessageType.INFO
			}
		]);
	}

	public changeMessagePaneTheme(): void {
		const messagePaneElement: HTMLElement = <HTMLElement>document.querySelector(this.starkMessagePaneString);

		if (messagePaneElement.classList.contains("dark")) {
			this.renderer.removeClass(messagePaneElement, "dark");
		} else {
			this.renderer.addClass(messagePaneElement, "dark");
		}
	}

	public changeMessagePanePosition(val: string): void {
		const messagePaneElement: HTMLElement = <HTMLElement>document.querySelector(this.starkMessagePaneString);

		this.renderer.removeClass(messagePaneElement, starkMessagePaneAlignClassPrefix + this.messagePanePosition);
		this.renderer.addClass(messagePaneElement, starkMessagePaneAlignClassPrefix + val);
		this.messagePanePosition = val;
	}
}
