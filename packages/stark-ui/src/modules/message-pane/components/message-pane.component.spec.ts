/* tslint:disable:completed-docs no-commented-code no-big-function no-duplicate-string max-union-size no-identical-functions */

/* angular imports */
import { async, ComponentFixture, fakeAsync, tick, TestBed } from "@angular/core/testing";
import { Component, ViewChild, NO_ERRORS_SCHEMA } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { FormsModule } from "@angular/forms";

/* rxjs imports */
import { BehaviorSubject, Observer, Observable } from "rxjs";

/* jasmine imports */
import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;

/* stark-core imports */
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

/* stark-ui imports */
import { StarkMessagePaneComponent, StarkMessagePaneNavItem } from "./message-pane.component";
import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneService } from "../services";
import { MockStarkMessagePaneService } from "../testing/message-pane.mock";
import { StarkMessageCollection } from "../entities";
import {
	starkMessagePaneAlignClassPrefix,
	starkMessagePaneDisplayedClass,
	starkMessagePaneDisplayAnimatedClass
} from "./message-pane.constants";
import { StarkMessage, StarkMessageType } from "../../../common/message";
import { StarkDOMUtil } from "../../../util/dom.util";

/***
 * To be able to test changes to the input fields, the message pane component is hosted inside the TestComponentHost class.
 */
@Component({
	selector: `host-component`,
	template: `
		<stark-message-pane [clearOnNavigation]="clearOnNavigation" [align]="align"></stark-message-pane>`
})
class TestHostComponent {
	@ViewChild(StarkMessagePaneComponent)
	public messagePaneComponent: StarkMessagePaneComponent;
	public clearOnNavigation: boolean;
	public align: string;
}

describe("MessagePaneController", () => {
	let component: StarkMessagePaneComponent;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	const mockClearOnNavigation: boolean = false;
	const mockDefaultAlign: "center" | "left" | "right" | undefined = "right";
	const mockCenterAlign: "center" | "left" | "right" | undefined = "center";

	const mockMessagePaneService: StarkMessagePaneService = new MockStarkMessagePaneService();
	let mockMessages: StarkMessageCollection;
	let messageCollection$: BehaviorSubject<StarkMessageCollection>;

	const mockInfoMessage1: StarkMessage = {
		id: "3",
		key: "MESSAGES.INFOS.INFO1",
		interpolateValues: { var1: "some info value", var2: "whatever" },
		code: "1234",
		type: StarkMessageType.INFO
	};
	const mockWarningMessage1: StarkMessage = {
		id: "2",
		key: "MESSAGES.WARNINGS.WARNING1",
		interpolateValues: { var1: "some warning value", var2: "whatever" },
		code: "4321",
		type: StarkMessageType.WARNING
	};
	const mockWarningMessage2: StarkMessage = {
		id: "4",
		key: "MESSAGES.WARNINGS.WARNING2",
		interpolateValues: { var1: "some warning value", var2: "whatever" },
		code: "432122",
		type: StarkMessageType.WARNING
	};
	const mockErrorMessage1: StarkMessage = {
		id: "1",
		key: "MESSAGES.ERRORS.ERROR1",
		interpolateValues: { var1: "some error value", var2: "whatever" },
		code: "0159",
		type: StarkMessageType.ERROR
	};
	const mockErrorMessage2: StarkMessage = {
		id: "5",
		key: "MESSAGES.ERRORS.ERROR2",
		interpolateValues: { var1: "some error value", var2: "whatever" },
		code: "015922",
		type: StarkMessageType.ERROR
	};
	const mockErrorMessage3: StarkMessage = {
		id: "6",
		key: "MESSAGES.ERRORS.ERROR3",
		interpolateValues: { var1: "some error value", var2: "whatever" },
		code: "015933",
		type: StarkMessageType.ERROR
	};

	function getMessageElements(messagePaneContent: Element): NodeListOf<Element> {
		return StarkDOMUtil.getElementsBySelector(messagePaneContent, ".stark-message-pane-item");
	}

	function closeMessage(messageType: StarkMessagePaneNavItem, messageIndex: number): void {
		const messagePaneElement: HTMLElement = <HTMLElement>document.querySelector("stark-message-pane");
		const messagesButton: HTMLElement = <HTMLElement>messagePaneElement.querySelector("." + messageType);
		const messagePaneContent: HTMLElement = <HTMLElement>messagePaneElement.querySelector(".stark-message-pane-content");

		messagesButton.click();
		hostFixture.detectChanges();

		const messageElements: NodeListOf<Element> = getMessageElements(messagePaneContent);
		const closeButton: HTMLElement = <HTMLElement>messageElements[messageIndex].querySelector("button");
		closeButton.click();
		hostFixture.detectChanges();
	}

	/**
	 * check the total number of messages and the max level
	 */
	function assertDisplayedTotalMessages(messageType: StarkMessagePaneNavItem, numberOfMessages: number): void {
		const totalMessagesButton: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(".stark-message-pane-total");
		const messagesTab: HTMLElement = <HTMLElement>totalMessagesButton.querySelector("b");

		expect(totalMessagesButton.classList.contains(messageType)).toBe(true);
		expect(messagesTab.innerText).toEqual("" + numberOfMessages);
	}

	function assertDisplayedMessages(messageType: StarkMessagePaneNavItem, messages: StarkMessage[]): void {
		const messagePaneElement: HTMLElement = <HTMLElement>document.querySelector("stark-message-pane");
		const messagesButton: HTMLElement = <HTMLElement>messagePaneElement.querySelector("." + messageType + ".tab");
		const messagesTab: HTMLElement = <HTMLElement>messagePaneElement.querySelector("." + messageType + " b");
		const messagePaneContent: HTMLElement = <HTMLElement>messagePaneElement.querySelector(".stark-message-pane-content");

		if (messages.length > 0) {
			// if there are messages for the error-type
			// the button should be displayed
			expect(messagesButton).toBeDefined();
			expect(messagePaneContent).toBeDefined();
			expect(messagesTab).toBeDefined();
			expect(messagesTab.innerText).toEqual("" + messages.length);

			// clicking on the button should display the message-pane content
			messagesButton.click();
			hostFixture.detectChanges();

			expect(component.toggleActive).toHaveBeenCalled();
			expect(component.toggleActive).toHaveBeenCalledWith(messageType);

			let messageElements: NodeListOf<Element> = getMessageElements(messagePaneContent);
			expect(messageElements.length).toBe(messages.length);

			// clicking again on the button should hide the message-pane content
			messagesButton.click();
			hostFixture.detectChanges();
			messageElements = getMessageElements(messagePaneContent);
			expect(messageElements.length).toBe(0);
		} else {
			// if there are no messages for the error-type, then the button should not ne displayed
			expect(messagesButton).toBeNull();
		}
	}

	/**
	 * async beforeEach
	 */
	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkMessagePaneComponent, TestHostComponent],
			imports: [CommonModule, MatSelectModule, MatOptionModule, FormsModule, TranslateModule.forRoot(), NoopAnimationsModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_MESSAGE_PANE_SERVICE, useValue: mockMessagePaneService },
				TranslateService
			],
			schemas: [NO_ERRORS_SCHEMA] // to avoid errors due to "mat-icon" directive not known (which we don't want to add in these tests)
		}).compileComponents();
	}));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		component = hostComponent.messagePaneComponent;

		spyOn(component, "clearAllMessages").and.callThrough();
		spyOn(component, "collapseMessages").and.callThrough();
		spyOn(component, "expandMessages").and.callThrough();
		spyOn(component, "hidePane").and.callThrough();
		spyOn(component, "showPane").and.callThrough();
		spyOn(component, "toggleActive").and.callThrough();

		mockMessages = {
			infoMessages: [],
			warningMessages: [],
			errorMessages: []
		};
		messageCollection$ = new BehaviorSubject<StarkMessageCollection>(mockMessages);
		(<Spy>mockMessagePaneService.getAll).and.returnValue(messageCollection$);
	});

	describe("on initialization", () => {
		beforeEach(() => {
			hostFixture.detectChanges(); // trigger initial data binding
		});

		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
			expect(component.messagePaneService).not.toBeNull();
			expect(component.messagePaneService).toBeDefined();
		});

		it("should have default inputs", () => {
			expect(component.clearOnNavigation).toBeUndefined();
			expect(component.align).toBe(mockDefaultAlign);
		});
	});

	describe("on initialization with specific inputs", () => {
		beforeEach(() => {
			hostComponent.clearOnNavigation = mockClearOnNavigation;
			hostComponent.align = mockCenterAlign;

			hostFixture.detectChanges(); // trigger initial data binding
		});

		describe("Inputs", () => {
			it("should have inputs set", () => {
				expect(component.clearOnNavigation).toBe(mockClearOnNavigation);
				expect(component.align).toBe(mockCenterAlign);
			});
			it("should have the correct css classes", () => {
				const messagePaneElement: HTMLElement = <HTMLElement>document.querySelector("stark-message-pane");
				const alignClassname: string = starkMessagePaneAlignClassPrefix + mockCenterAlign;
				expect(messagePaneElement.classList.contains(alignClassname)).toBe(true);
			});
		});
	});

	describe("showPane", () => {
		it("should add classes to the root element", fakeAsync(() => {
			component.ngOnInit();

			expect(component.rootElement).toBeDefined();
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(false);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(false);

			component.showPane();

			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true);
			tick(component.showAnimationDelay + 10);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(true);
		}));

		it("when called right after hidePane(), it should wait fot the panel to be hidden before re-showing the pane", fakeAsync(() => {
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			component.ngOnInit();
			component.rootElement.classList.add(starkMessagePaneDisplayAnimatedClass);
			component.rootElement.classList.add(starkMessagePaneDisplayedClass);

			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(true);
			expect(component.hide$).toBeUndefined();

			component.hidePane();

			expect(component.hide$).toBeDefined();
			(<Observable<string>>component.hide$).subscribe(mockObserver);

			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(false);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true); // not yet removed

			component.showPane();

			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true); // because of showPane()
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(false);

			expect(mockObserver.next).not.toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			tick(component.hideAnimationDelay + 10);

			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true); // because of showPane()
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(false);

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect((<Spy>mockObserver.next).calls.argsFor(0)[0]).toContain("pane hidden");
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).toHaveBeenCalledTimes(1);

			tick(component.showAnimationDelay + 10);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(true);
		}));
	});

	describe("hidePane", () => {
		it("should remove classes from the root element", fakeAsync(() => {
			component.ngOnInit();
			expect(component.rootElement).toBeDefined();
			component.rootElement.classList.add(starkMessagePaneDisplayAnimatedClass);
			component.rootElement.classList.add(starkMessagePaneDisplayedClass);

			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(true);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true);

			component.hidePane();
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(false);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true); // not yet removed

			tick(component.hideAnimationDelay + 10);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(false);
		}));

		it("should create a new hide$ Subject that should emit once the hide process has finished", fakeAsync(() => {
			const mockObserver: Observer<any> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			component.ngOnInit();
			component.rootElement.classList.add(starkMessagePaneDisplayAnimatedClass);
			component.rootElement.classList.add(starkMessagePaneDisplayedClass);

			expect(component.hide$).toBeUndefined();
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(true);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true);

			component.hidePane();

			expect(component.hide$).toBeDefined();
			(<Observable<string>>component.hide$).subscribe(mockObserver);

			expect(mockObserver.next).not.toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(component.rootElement.classList.contains(starkMessagePaneDisplayAnimatedClass)).toBe(false);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(true); // not yet removed

			tick(component.hideAnimationDelay + 10);
			expect(component.rootElement.classList.contains(starkMessagePaneDisplayedClass)).toBe(false);

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect((<Spy>mockObserver.next).calls.argsFor(0)[0]).toContain("pane hidden");
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).toHaveBeenCalledTimes(1);
		}));
	});

	describe("message pane", () => {
		beforeEach(() => {
			hostFixture.detectChanges(); // trigger initial data binding (executes the ngOnInit)

			mockMessages = {
				infoMessages: [mockInfoMessage1],
				warningMessages: [mockWarningMessage1, mockWarningMessage2],
				errorMessages: [mockErrorMessage1, mockErrorMessage2, mockErrorMessage3]
			};

			messageCollection$.next(mockMessages);
			hostFixture.detectChanges(); // trigger changes in data binding (it does not execute ngOnInit again -> it remembers!)
		});

		describe("display message pane", () => {
			it("should render the appropriate content", () => {
				expect(component.showPane).toHaveBeenCalled();

				const messagePaneElement: HTMLElement = <HTMLElement>document.querySelector("stark-message-pane");

				const messagesNavBar: HTMLElement = <HTMLElement>document.querySelector(".summary");
				expect(messagesNavBar).not.toBeNull();

				const activeTab: HTMLElement = <HTMLElement>document.querySelector(".active");
				expect(activeTab).toBeNull();

				const errorMessagesTab: HTMLElement = <HTMLElement>messagePaneElement.querySelector(".errors b");
				expect(errorMessagesTab).toBeDefined();
				expect(errorMessagesTab).not.toBeNull();

				const warningMessagesTab: HTMLElement = <HTMLElement>messagePaneElement.querySelector(".warnings b");
				expect(warningMessagesTab).toBeDefined();
				expect(warningMessagesTab).not.toBeNull();

				const infoMessagesTab: HTMLElement = <HTMLElement>messagePaneElement.querySelector(".infos b");
				expect(infoMessagesTab).toBeDefined();
				expect(infoMessagesTab).not.toBeNull();

				const totalMessagesTab: HTMLElement = <HTMLElement>messagePaneElement.querySelector(".stark-message-pane-total b");
				expect(totalMessagesTab).toBeDefined();
				expect(totalMessagesTab).not.toBeNull();

				const totalMessages: number =
					mockMessages.infoMessages.length + mockMessages.warningMessages.length + mockMessages.errorMessages.length;

				expect(errorMessagesTab.innerText).toEqual("" + mockMessages.errorMessages.length);
				expect(warningMessagesTab.innerText).toEqual("" + mockMessages.warningMessages.length);
				expect(infoMessagesTab.innerText).toEqual("" + mockMessages.infoMessages.length);
				expect(totalMessagesTab.innerText).toEqual("" + totalMessages);
			});
		});

		describe("Collapse, expand and hide the message pane", () => {
			it("should expand and collapse upon button clicks", () => {
				const collapseMessagesButton: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(".collapse-pane");
				const totalMessagesButton: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(".stark-message-pane-total");

				expect(collapseMessagesButton).toBeDefined();
				expect(totalMessagesButton).toBeDefined();

				// the max. message level, initially mocked 'errors'
				expect(totalMessagesButton.classList.contains("errors")).toBe(true);

				collapseMessagesButton.click();

				expect(component.collapseMessages).toHaveBeenCalled();
				expect(component.collapseMessages).toHaveBeenCalledTimes(1);

				totalMessagesButton.click();

				expect(component.expandMessages).toHaveBeenCalled();
				expect(component.expandMessages).toHaveBeenCalledTimes(1);
			});

			it("should clear all messages and hide the message pane component", () => {
				const clearAllMessagesButton: HTMLElement = hostFixture.debugElement.nativeElement.querySelector(".clear-all-messages");

				expect(clearAllMessagesButton).toBeDefined();

				clearAllMessagesButton.click();

				expect(component.clearAllMessages).toHaveBeenCalled();
				expect(component.clearAllMessages).toHaveBeenCalledTimes(1);

				mockMessages = {
					infoMessages: [],
					warningMessages: [],
					errorMessages: []
				};

				messageCollection$.next(mockMessages);

				expect(component.hidePane).toHaveBeenCalled();
				expect(component.hidePane).toHaveBeenCalledTimes(1);
				expect(component.isVisible).toBe(false);
			});
		});

		describe("messages details", () => {
			it("should expand and collapse the error messages when clicking the errors button", () => {
				assertDisplayedMessages("errors", mockMessages.errorMessages);
				assertDisplayedMessages("warnings", mockMessages.warningMessages);
				assertDisplayedMessages("infos", mockMessages.infoMessages);
			});
		});

		describe("messages", () => {
			beforeEach(() => {
				hostFixture.detectChanges(); // trigger initial data binding (executes the ngOnInit)

				mockMessages = {
					infoMessages: [mockInfoMessage1],
					warningMessages: [mockWarningMessage1],
					errorMessages: [mockErrorMessage1]
				};

				messageCollection$.next(mockMessages);
				hostFixture.detectChanges(); // trigger changes in data binding (it does not execute ngOnInit again -> it remembers!)

				(<Spy>mockMessagePaneService.remove).and.callFake((messagesToRemove: StarkMessage[]) => {
					for (const message of messagesToRemove) {
						let messageArray: StarkMessage[];
						switch (message.type) {
							case StarkMessageType.INFO:
								messageArray = mockMessages.infoMessages;
								break;
							case StarkMessageType.WARNING:
								messageArray = mockMessages.warningMessages;
								break;
							case StarkMessageType.ERROR:
								messageArray = mockMessages.errorMessages;
								break;
							default:
								throw new Error("unknown message type");
						}
						const idx: number = messageArray.indexOf(message);
						if (idx !== -1) {
							messageArray.splice(idx, 1);
						}
					}
					messageCollection$.next(mockMessages);
					hostFixture.detectChanges(); // trigger changes in data binding (it does not execute ngOnInit again -> it remembers!)
				});
			});

			it("should be removed when its 'close' button is clicked and remove the current tab if it has no more messages", () => {
				let indexToRemove: number;

				assertDisplayedTotalMessages("errors", 3);

				indexToRemove = mockMessages.errorMessages.indexOf(mockErrorMessage1);
				closeMessage("errors", indexToRemove);
				// check if the button is removed
				assertDisplayedMessages("errors", mockMessages.errorMessages);
				assertDisplayedTotalMessages("warnings", 2);

				indexToRemove = mockMessages.warningMessages.indexOf(mockWarningMessage1);
				closeMessage("warnings", indexToRemove);
				// check if the button is removed
				assertDisplayedMessages("warnings", mockMessages.warningMessages);
				assertDisplayedTotalMessages("infos", 1);

				indexToRemove = mockMessages.infoMessages.indexOf(mockInfoMessage1);
				closeMessage("infos", indexToRemove);
				// check if the button is removed
				assertDisplayedMessages("infos", mockMessages.infoMessages);
				assertDisplayedTotalMessages("infos", 0);
			});
		});

		describe("toggleActive", () => {
			it("should change the current active tab", () => {
				component.ngOnInit();
				expect(component.currentNavItem).toBe("");
				component.toggleActive("errors");
				expect(component.currentNavItem).toBe("errors");
				component.toggleActive("warnings");
				expect(component.currentNavItem).toBe("warnings");
			});

			it("clicking twice should set the active tab to none", () => {
				component.ngOnInit();
				expect(component.currentNavItem).toBe("");
				component.toggleActive("errors");
				expect(component.currentNavItem).toBe("errors");
				component.toggleActive("errors");
				expect(component.currentNavItem).toBe("");
			});
		});
	});
});
