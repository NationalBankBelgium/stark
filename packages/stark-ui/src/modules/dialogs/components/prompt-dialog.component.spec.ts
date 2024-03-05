/* eslint-disable @angular-eslint/no-lifecycle-call */
import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { Component, ComponentFactoryResolver } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
	MatLegacyDialog as MatDialog,
	MatLegacyDialogModule as MatDialogModule,
	MatLegacyDialogRef as MatDialogRef
} from "@angular/material/legacy-dialog";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { OverlayContainer } from "@angular/cdk/overlay";
import { ESCAPE } from "@angular/cdk/keycodes";
import { TranslateModule } from "@ngx-translate/core";
import { Observer } from "rxjs";
import { StarkPromptDialogContent } from "./prompt-dialog-content.intf";
import { StarkPromptDialogComponent, StarkPromptDialogResult } from "./prompt-dialog.component";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

@Component({
	selector: `host-component`,
	template: ` no content `
})
class TestHostComponent {}

describe("PromptDialogComponent", () => {
	let hostFixture: ComponentFixture<TestHostComponent>;
	let hostComponent: TestHostComponent;
	let dialogService: MatDialog;
	let overlayContainer: OverlayContainer;
	let overlayContainerElement: HTMLElement;
	let dialogComponentSelector: string;
	let mockObserver: SpyObj<Observer<StarkPromptDialogResult>>;

	const dummyDialogContent: StarkPromptDialogContent = {
		title: "This is the dialog title",
		textContent: "Here goes the content",
		label: "The input's label",
		placeholder: "The input's placeholder",
		initialValue: "The input's initial value",
		ok: "Ok button label",
		cancel: "Cancel button label"
	};

	const matDialogSelector = "mat-dialog-container";
	const matDialogTitleSelector = "[mat-dialog-title]";
	const matDialogContentSelector = "[mat-dialog-content]";
	const matDialogActionsSelector = "[mat-dialog-actions]";

	function openDialog(dialogData: StarkPromptDialogContent): MatDialogRef<StarkPromptDialogComponent, StarkPromptDialogResult> {
		return dialogService.open<StarkPromptDialogComponent, StarkPromptDialogContent, StarkPromptDialogResult>(
			StarkPromptDialogComponent,
			{
				data: dialogData
			}
		);
	}

	function triggerClick(element: HTMLElement): void {
		element.click();
	}

	/**
	 * Angular Material dialogs listen to the Escape key on the keydown event
	 */
	function triggerKeydownEscape(element: HTMLElement): void {
		// more verbose way to create and trigger an event (the only way it works in IE)
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
		const keydownEvent: Event = document.createEvent("Event");
		keydownEvent.initEvent("keydown", true, true);
		keydownEvent["key"] = "Escape";
		keydownEvent["keyCode"] = ESCAPE;
		element.dispatchEvent(keydownEvent);
	}

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [TestHostComponent, StarkPromptDialogComponent],
			imports: [CommonModule, ReactiveFormsModule, NoopAnimationsModule, MatInputModule, MatDialogModule, TranslateModule.forRoot()],
			providers: []
		})
			.overrideModule(BrowserDynamicTestingModule, {
				// FIXME review after https://github.com/angular/angular/issues/10760
				// add entryComponent to TestingModule (suggested in https://github.com/angular/angular/issues/10760#issuecomment-250522300)
				set: { entryComponents: [StarkPromptDialogComponent] }
			})
			.compileComponents()));

	beforeEach(inject(
		[MatDialog, OverlayContainer, ComponentFactoryResolver],
		(d: MatDialog, oc: OverlayContainer, cfr: ComponentFactoryResolver) => {
			dialogService = d;
			overlayContainer = oc;
			overlayContainerElement = oc.getContainerElement();
			dialogComponentSelector = cfr.resolveComponentFactory(StarkPromptDialogComponent).selector;
		}
	));

	afterEach(() => {
		overlayContainer.ngOnDestroy();
	});

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostFixture.detectChanges();

		mockObserver = createSpyObj<Observer<StarkPromptDialogResult>>("observerSpy", ["next", "error", "complete"]);
	});

	it("should be correctly opened via the MatDialog service", () => {
		expect(hostComponent).toBeDefined();
		expect(dialogService).toBeDefined();

		const dialogRef: MatDialogRef<StarkPromptDialogComponent, StarkPromptDialogResult> = openDialog(dummyDialogContent);
		hostFixture.detectChanges();

		expect(dialogRef.componentInstance instanceof StarkPromptDialogComponent).toBe(true);

		const dialogElement: HTMLElement | null = overlayContainerElement.querySelector<HTMLElement>(
			matDialogSelector + " " + dialogComponentSelector
		);

		const dialogTitleElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogTitleSelector);
		expect(dialogTitleElement).toBeDefined();
		expect((<HTMLElement>dialogTitleElement).innerHTML).toEqual(<string>dummyDialogContent.title);

		const dialogContentElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogContentSelector);
		expect(dialogContentElement).toBeDefined();
		expect((<HTMLElement>dialogContentElement).innerHTML).toContain(<string>dummyDialogContent.textContent);

		const dialogActionsElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogActionsSelector);
		expect(dialogActionsElement).toBeDefined();
		const dialogButtonElements: NodeListOf<HTMLElement> = (<HTMLElement>dialogActionsElement).querySelectorAll("button");
		expect(dialogButtonElements.length).toBe(2);
		expect(dialogButtonElements[0].innerHTML).toBe(<string>dummyDialogContent.cancel);
		expect(dialogButtonElements[1].innerHTML).toContain(<string>dummyDialogContent.ok);
	});

	it("should return the value typed by the user as result when the 'Ok' button is clicked", fakeAsync(() => {
		const dialogRef: MatDialogRef<StarkPromptDialogComponent, StarkPromptDialogResult> = openDialog(dummyDialogContent);
		hostFixture.detectChanges();

		const dialogElement: HTMLElement | null = overlayContainerElement.querySelector<HTMLElement>(
			matDialogSelector + " " + dialogComponentSelector
		);

		dialogRef.afterClosed().subscribe(mockObserver);

		const dummyValue = "some dummy value";
		expect(dialogRef.componentInstance.formControl.value).toBe(dummyDialogContent.initialValue);
		dialogRef.componentInstance.formControl.setValue(dummyValue); // changing the input's value

		const dialogActionsElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogActionsSelector);
		expect(dialogActionsElement).toBeDefined();
		const dialogButtonElements: NodeListOf<HTMLElement> = (<HTMLElement>dialogActionsElement).querySelectorAll("button");
		expect(dialogButtonElements.length).toBe(2);

		triggerClick(dialogButtonElements[1]); // clicking the "ok" button
		hostFixture.detectChanges();

		// to avoid NgZone error: "Error: 3 timer(s) still in the queue"
		tick(500); // the amount of mills can be known by calling flush(): const remainingMills: number = flush();

		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith(dummyValue);
		expect(mockObserver.error).not.toHaveBeenCalled();
		expect(mockObserver.complete).toHaveBeenCalled();
	}));

	it("should return 'cancel' as result when the 'Cancel' button is clicked", fakeAsync(() => {
		const dialogRef: MatDialogRef<StarkPromptDialogComponent, StarkPromptDialogResult> = openDialog(dummyDialogContent);
		hostFixture.detectChanges();

		const dialogElement: HTMLElement | null = overlayContainerElement.querySelector<HTMLElement>(
			matDialogSelector + " " + dialogComponentSelector
		);

		dialogRef.afterClosed().subscribe(mockObserver);

		const dialogActionsElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogActionsSelector);
		expect(dialogActionsElement).toBeDefined();
		const dialogButtonElements: NodeListOf<HTMLElement> = (<HTMLElement>dialogActionsElement).querySelectorAll("button");
		expect(dialogButtonElements.length).toBe(2);

		triggerClick(dialogButtonElements[0]); // clicking the "cancel" button
		hostFixture.detectChanges();

		// to avoid NgZone error: "Error: 3 timer(s) still in the queue"
		tick(500); // the amount of mills can be known by calling flush(): const remainingMills: number = flush();

		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith("cancel");
		expect(mockObserver.error).not.toHaveBeenCalled();
		expect(mockObserver.complete).toHaveBeenCalled();
	}));

	it("should return undefined as result when it is cancelled by clicking outside of the dialog", fakeAsync(() => {
		const dialogRef: MatDialogRef<StarkPromptDialogComponent, StarkPromptDialogResult> = openDialog(dummyDialogContent);
		hostFixture.detectChanges();

		dialogRef.afterClosed().subscribe(mockObserver);

		triggerClick(<HTMLElement>overlayContainerElement.querySelector(".cdk-overlay-backdrop")); // clicking on the backdrop
		hostFixture.detectChanges();

		// to avoid NgZone error: "Error: 3 timer(s) still in the queue"
		tick(500); // the amount of mills can be known by calling flush(): const remainingMills: number = flush();

		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith(undefined);
		expect(mockObserver.error).not.toHaveBeenCalled();
		expect(mockObserver.complete).toHaveBeenCalled();
	}));

	it("should return undefined as result when it is cancelled by pressing the ESC key", fakeAsync(() => {
		const dialogRef: MatDialogRef<StarkPromptDialogComponent, StarkPromptDialogResult> = openDialog(dummyDialogContent);
		hostFixture.detectChanges();

		dialogRef.afterClosed().subscribe(mockObserver);

		triggerKeydownEscape(overlayContainerElement); // pressing Esc key in the overlay
		hostFixture.detectChanges();

		// to avoid NgZone error: "Error: 3 timer(s) still in the queue"
		tick(500); // the amount of mills can be known by calling flush(): const remainingMills: number = flush();

		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith(undefined);
		expect(mockObserver.error).not.toHaveBeenCalled();
		expect(mockObserver.complete).toHaveBeenCalled();
	}));
});
