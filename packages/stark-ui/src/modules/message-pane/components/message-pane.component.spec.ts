/* eslint-disable @angular-eslint/no-lifecycle-call */

/* angular imports */
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { Component, DebugElement, ViewChild } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyOptionModule as MatOptionModule } from "@angular/material/legacy-core";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { FormsModule } from "@angular/forms";
/* rxjs imports */
import { BehaviorSubject, Observable, Observer } from "rxjs";
/* stark-core imports */
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
/* stark-ui imports */
import { StarkMessagePaneComponent, StarkMessagePaneNavItem } from "./message-pane.component";
import { STARK_MESSAGE_PANE_SERVICE } from "../services";
import { MockStarkMessagePaneService } from "@nationalbankbelgium/stark-ui/testing";
import {
	starkMessagePaneAlignClassPrefix,
	starkMessagePaneDisplayAnimatedClass,
	starkMessagePaneDisplayedClass
} from "./message-pane.constants";
import { StarkMessage, StarkMessageCollection, StarkMessageType } from "@nationalbankbelgium/stark-ui/src/common";
import { StarkDOMUtil } from "@nationalbankbelgium/stark-ui/src/util";

/* jasmine imports */
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

/**
 * To be able to test changes to the input fields, the message pane component is hosted inside the TestComponentHost class.
 */
@Component({
	selector: `host-component`,
	template: ` <stark-message-pane [clearOnNavigation]="clearOnNavigation" [align]="align"></stark-message-pane> `
})
class TestHostComponent {
	@ViewChild(StarkMessagePaneComponent, { static: true })
	public messagePaneComponent!: StarkMessagePaneComponent;
	public clearOnNavigation?: boolean;
	public align?: string;
}

describe("MessagePaneComponent", () => {
	let component: StarkMessagePaneComponent;
	let debugElementComponent: DebugElement;
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;

	const mockClearOnNavigation = false;
	const mockDefaultAlign: "center" | "left" | "right" | undefined = "right";
	const mockCenterAlign: "center" | "left" | "right" | undefined = "center";

	const mockMessagePaneService: MockStarkMessagePaneService = new MockStarkMessagePaneService();
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
		const messagesButton: HTMLElement = debugElementComponent.query(By.css("." + messageType)).nativeElement;
		const messagePaneContent: HTMLElement = debugElementComponent.query(By.css(".stark-message-pane-content")).nativeElement;

		messagesButton.click();
		hostFixture.detectChanges();

		const messageElements: NodeListOf<Element> = getMessageElements(messagePaneContent);
		const closeButton: HTMLElement = <HTMLElement>messageElements[messageIndex].querySelector("button");
		closeButton.click();
		hostFixture.detectChanges();
	}

	/**
	 * @ignore
	 * check the total number of messages and the max level
	 */
	function assertDisplayedTotalMessages(messageType: StarkMessagePaneNavItem, numberOfMessages: number): void {
		const totalMessagesButton: DebugElement = debugElementComponent.query(By.css(".stark-message-pane-total"));
		const messagesTab: HTMLElement = <HTMLElement>totalMessagesButton.query(By.css("b")).nativeElement;

		expect(totalMessagesButton.classes[messageType]).toBe(true);
		expect(messagesTab.innerText).toEqual(`${numberOfMessages}`);
	}

	function assertDisplayedMessages(messageType: StarkMessagePaneNavItem, messages: StarkMessage[]): void {
		const messagesButton: DebugElement = debugElementComponent.query(By.css("." + messageType + ".tab"));
		const messagesTab: DebugElement = debugElementComponent.query(By.css("." + messageType + " b"));
		const messagePaneContent: HTMLElement = debugElementComponent.query(By.css(".stark-message-pane-content")).nativeElement;

		if (messages.length > 0) {
			// if there are messages for the error-type
			// the button should be displayed
			expect(messagesButton).toBeTruthy();
			expect(messagePaneContent).toBeTruthy();
			expect(messagesTab).toBeTruthy();
			expect(messagesTab.nativeElement.innerText).toEqual(`${messages.length}`);

			// clicking on the button should display the message-pane content
			messagesButton.nativeElement.click();
			hostFixture.detectChanges();

			expect(component.toggleActive).toHaveBeenCalled();
			expect(component.toggleActive).toHaveBeenCalledWith(messageType);

			let messageElements: NodeListOf<Element> = getMessageElements(messagePaneContent);
			expect(messageElements.length).toBe(messages.length);

			// clicking again on the button should hide the message-pane content
			messagesButton.nativeElement.click();
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
	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkMessagePaneComponent, TestHostComponent],
			imports: [
				CommonModule,
				MatIconModule,
				MatIconTestingModule,
				MatSelectModule,
				MatTooltipModule,
				MatOptionModule,
				FormsModule,
				TranslateModule.forRoot(),
				NoopAnimationsModule
			],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_MESSAGE_PANE_SERVICE, useValue: mockMessagePaneService },
				TranslateService
			]
		}).compileComponents()));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		component = hostComponent.messagePaneComponent;
		debugElementComponent = hostFixture.debugElement.query(By.directive(StarkMessagePaneComponent));

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
		mockMessagePaneService.getAll.and.returnValue(messageCollection$);
	});

	describe("on initialization", () => {
		beforeEach(() => {
			hostFixture.detectChanges(); // trigger initial data binding
		});

		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).toBeTruthy();
			expect(component.messagePaneService).toBeTruthy();
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

		describe("inputs", () => {
			it("should have inputs set", () => {
				expect(component.clearOnNavigation).toBe(mockClearOnNavigation);
				expect(component.align).toBe(mockCenterAlign);
			});
			it("should have the correct CSS classes", () => {
				const alignClassname: string = starkMessagePaneAlignClassPrefix + mockCenterAlign;
				expect(debugElementComponent.classes[alignClassname]).toBe(true);
			});
		});
	});

	describe("showPane", () => {
		it("should add classes to the root element", fakeAsync(() => {
			component.ngOnInit();

			expect(debugElementComponent).toBeTruthy();
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBeUndefined();
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBeUndefined();

			component.showPane();

			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true);
			tick(component.showAnimationDelay + 10);
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBe(true);
		}));

		it("when called right after hidePane(), it should wait fot the panel to be hidden before re-showing the pane", fakeAsync(() => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			component.ngOnInit();
			component["renderer"].addClass(component["elementRef"].nativeElement, starkMessagePaneDisplayAnimatedClass);
			component["renderer"].addClass(component["elementRef"].nativeElement, starkMessagePaneDisplayedClass);

			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true);
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBe(true);
			expect(component.hide$).toBeUndefined();

			component.hidePane();

			expect(component.hide$).toBeDefined();
			(<Observable<string>>component.hide$).subscribe(mockObserver);

			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBeUndefined();
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true); // not yet removed

			component.showPane();

			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true); // because of showPane()
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBeUndefined();

			expect(mockObserver.next).not.toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			tick(component.hideAnimationDelay + 10);

			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true); // because of showPane()
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBeUndefined();

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next.calls.argsFor(0)[0]).toContain("pane hidden");
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).toHaveBeenCalledTimes(1);

			tick(component.showAnimationDelay + 10);
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBe(true);
		}));
	});

	describe("hidePane", () => {
		it("should remove classes from the root element", fakeAsync(() => {
			component.ngOnInit();
			expect(component["elementRef"].nativeElement).toBeTruthy();
			component["renderer"].addClass(component["elementRef"].nativeElement, starkMessagePaneDisplayAnimatedClass);
			component["renderer"].addClass(component["elementRef"].nativeElement, starkMessagePaneDisplayedClass);

			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBe(true);
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true);

			component.hidePane();
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBeUndefined();
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true); // not yet removed

			tick(component.hideAnimationDelay + 10);
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBeUndefined();
		}));

		it("should create a new hide$ Subject that should emit once the hide process has finished", fakeAsync(() => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			component.ngOnInit();
			component["renderer"].addClass(component["elementRef"].nativeElement, starkMessagePaneDisplayAnimatedClass);
			component["renderer"].addClass(component["elementRef"].nativeElement, starkMessagePaneDisplayedClass);

			expect(component.hide$).toBeUndefined();
			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBe(true);
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true);

			component.hidePane();

			expect(component.hide$).toBeDefined();
			(<Observable<string>>component.hide$).subscribe(mockObserver);

			expect(mockObserver.next).not.toHaveBeenCalled();
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(debugElementComponent.classes[starkMessagePaneDisplayAnimatedClass]).toBeUndefined();
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBe(true); // not yet removed

			tick(component.hideAnimationDelay + 10);
			expect(debugElementComponent.classes[starkMessagePaneDisplayedClass]).toBeUndefined();

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next.calls.argsFor(0)[0]).toContain("pane hidden");
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
				expect(component.showPane).toHaveBeenCalledTimes(1);

				const messagesNavBar: HTMLElement = debugElementComponent.query(By.css(".summary")).nativeElement;
				expect(messagesNavBar).not.toBeNull();

				const activeTab: DebugElement = debugElementComponent.query(By.css(".active"));
				expect(activeTab).toBeNull();

				const errorMessagesTab: HTMLElement = debugElementComponent.query(By.css(".errors b")).nativeElement;
				expect(errorMessagesTab).toBeTruthy();

				const warningMessagesTab: HTMLElement = debugElementComponent.query(By.css(".warnings b")).nativeElement;
				expect(warningMessagesTab).toBeTruthy();

				const infoMessagesTab: HTMLElement = debugElementComponent.query(By.css(".infos b")).nativeElement;
				expect(infoMessagesTab).toBeTruthy();

				const totalMessagesTab: HTMLElement = debugElementComponent.query(By.css(".stark-message-pane-total b")).nativeElement;
				expect(totalMessagesTab).toBeTruthy();

				const totalMessages: number =
					mockMessages.infoMessages.length + mockMessages.warningMessages.length + mockMessages.errorMessages.length;

				expect(errorMessagesTab.innerText).toEqual(`${mockMessages.errorMessages.length}`);
				expect(warningMessagesTab.innerText).toEqual(`${mockMessages.warningMessages.length}`);
				expect(infoMessagesTab.innerText).toEqual(`${mockMessages.infoMessages.length}`);
				expect(totalMessagesTab.innerText).toEqual(`${totalMessages}`);
			});
		});

		describe("collapse, expand and hide the message pane", () => {
			beforeEach(fakeAsync(() => {
				mockMessagePaneService.clearAll.and.callFake(() => {
					const emptyMessageCollection: StarkMessageCollection = {
						infoMessages: [],
						warningMessages: [],
						errorMessages: []
					};

					messageCollection$.next(emptyMessageCollection);
					hostFixture.detectChanges();
				});
			}));

			it("should expand and collapse upon button clicks", () => {
				const collapseMessagesButton: DebugElement = debugElementComponent.query(By.css(".collapse-pane"));
				const totalMessagesButton: DebugElement = debugElementComponent.query(By.css(".stark-message-pane-total"));

				expect(collapseMessagesButton.nativeElement).toBeTruthy();
				expect(totalMessagesButton.nativeElement).toBeTruthy();

				// the max. message level, initially mocked 'errors'
				expect(totalMessagesButton.classes["errors"]).toBe(true);
				expect(debugElementComponent.classes["collapsed"]).toBeUndefined();

				collapseMessagesButton.nativeElement.click();
				hostFixture.detectChanges();

				expect(component.collapseMessages).toHaveBeenCalledTimes(1);
				expect(debugElementComponent.classes["collapsed"]).toBe(true);

				totalMessagesButton.nativeElement.click();
				hostFixture.detectChanges();

				expect(component.expandMessages).toHaveBeenCalledTimes(1);
				expect(debugElementComponent.classes["collapsed"]).toBeUndefined();
			});

			it("should clear all messages and hide the message pane component", () => {
				const clearAllMessagesButton: HTMLElement = debugElementComponent.query(By.css(".clear-all-messages")).nativeElement;

				expect(clearAllMessagesButton).toBeTruthy();

				clearAllMessagesButton.click();
				hostFixture.detectChanges();

				expect(component.clearAllMessages).toHaveBeenCalledTimes(1);
				expect(mockMessagePaneService.clearAll).toHaveBeenCalledTimes(1);

				expect(component.hidePane).toHaveBeenCalledTimes(1);
				expect(component.isVisible).toBe(false);

				// no more messages should be displayed
				const messagePaneContent: HTMLElement = debugElementComponent.query(By.css(".stark-message-pane-content")).nativeElement;
				const messageElements: NodeListOf<Element> = getMessageElements(messagePaneContent);
				expect(messageElements.length).toBe(0);

				// all tabs are removed as well
				assertDisplayedMessages("warnings", []);
				assertDisplayedMessages("infos", []);
				assertDisplayedMessages("errors", []);
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

				mockMessagePaneService.remove.and.callFake((messagesToRemove: StarkMessage[]) => {
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
