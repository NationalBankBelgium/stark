import { Component, Inject, OnInit } from "@angular/core";
import {
	STARK_MESSAGE_PANE_SERVICE,
	StarkMessagePaneService,
	starkMessagePaneAlignClassPrefix,
	StarkMessageType
} from "@nationalbankbelgium/stark-ui";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

const componentName: string = "demo-message-pane";
const _uniqueId: any = require("lodash/uniqueId");

/**
 * @ngdoc component
 * @description Layout overview smart component MessagePane
 *
 */
@Component({
	selector: "demo-message-pane",
	templateUrl: "./demo-message-pane.component.html"
})
export class DemoMessagePaneComponent implements OnInit {
	public messagePanePosition: string;
	public starkMessagePaneString: string = ".stark-message-pane";

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_MESSAGE_PANE_SERVICE) public starkMessagePaneService: StarkMessagePaneService // private elementRef: HTMLElement
	) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
		this.messagePanePosition = "right";
	}

	public notifyMessages(): void {
		this.starkMessagePaneService.add([
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.ERROR_1",
				interpolateValues: { priority: "priority = 500" },
				code: "54987",
				type: StarkMessageType.ERROR,
				priority: 500
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.ERROR_2",
				interpolateValues: { priority: "priority = 10" },
				code: "333",
				type: StarkMessageType.ERROR,
				priority: 10
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.ERROR_3",
				interpolateValues: { priority: "priority = 200" },
				code: "777",
				type: StarkMessageType.ERROR,
				priority: 200
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.WARNINGS.WARNING_1",
				interpolateValues: { priority: "priority = 1" },
				code: "",
				type: StarkMessageType.WARNING,
				priority: 1
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.WARNINGS.WARNING_2",
				interpolateValues: { priority: "priority = undefined" },
				code: "PMO",
				type: StarkMessageType.WARNING
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.INFOS.INFO_1",
				interpolateValues: { priority: "priority = undefined" },
				code: "54987",
				type: StarkMessageType.INFO
			},
			{
				id: _uniqueId(),
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
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.NEW_ERROR_1",
				interpolateValues: {},
				code: "54987",
				type: StarkMessageType.ERROR
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.ERRORS.NEW_ERROR_2",
				interpolateValues: {},
				code: "333",
				type: StarkMessageType.ERROR
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.WARNINGS.NEW_WARNING_1",
				interpolateValues: {},
				code: "",
				type: StarkMessageType.WARNING
			},
			{
				id: _uniqueId(),
				key: "SHOWCASE.DEMO.MESSAGE_PANE.MESSAGES.INFOS.NEW_INFO_1",
				interpolateValues: {},
				code: "54987",
				type: StarkMessageType.INFO
			},
			{
				id: _uniqueId(),
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
			messagePaneElement.classList.remove("dark");
		} else {
			messagePaneElement.classList.add("dark");
		}
	}

	public changeMessagePanePosition(val: string): void {
		const messagePaneElement: HTMLElement = <HTMLElement>document.querySelector(this.starkMessagePaneString);

		messagePaneElement.classList.remove(starkMessagePaneAlignClassPrefix + this.messagePanePosition);
		messagePaneElement.classList.add(starkMessagePaneAlignClassPrefix + val);
		this.messagePanePosition = val;
	}
}
