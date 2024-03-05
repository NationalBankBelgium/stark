/* eslint-disable @angular-eslint/no-lifecycle-call */
import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { Component, ComponentFactoryResolver } from "@angular/core";
import {
	MatLegacyDialog as MatDialog,
	MatLegacyDialogModule as MatDialogModule,
	MatLegacyDialogRef as MatDialogRef
} from "@angular/material/legacy-dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { OverlayContainer } from "@angular/cdk/overlay";
import { ESCAPE } from "@angular/cdk/keycodes";
import { TranslateModule } from "@ngx-translate/core";
import { Observer } from "rxjs";
import { StarkAlertDialogContent } from "./alert-dialog-content.intf";
import { StarkAlertDialogComponent, StarkAlertDialogResult } from "./alert-dialog.component";
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

@Component({
	selector: `host-component`,
	template: ` no content `
})
class TestHostComponent {}

describe("AlertDialogComponent", () => {
	let hostFixture: ComponentFixture<TestHostComponent>;
	let hostComponent: TestHostComponent;
	let dialogService: MatDialog;
	let overlayContainer: OverlayContainer;
	let overlayContainerElement: HTMLElement;
	let dialogComponentSelector: string;
	let mockObserver: SpyObj<Observer<StarkAlertDialogResult>>;

	const dummyDialogContent: StarkAlertDialogContent = {
		title: "This is the dialog title",
		textContent: "Here goes the content",
		ok: "Ok button label"
	};

	const matDialogSelector = "mat-dialog-container";
	const matDialogTitleSelector = "[mat-dialog-title]";
	const matDialogContentSelector = "[mat-dialog-content]";
	const matDialogActionsSelector = "[mat-dialog-actions]";

	function openDialog(dialogData: StarkAlertDialogContent): MatDialogRef<StarkAlertDialogComponent, StarkAlertDialogResult> {
		return dialogService.open<StarkAlertDialogComponent, StarkAlertDialogContent, StarkAlertDialogResult>(StarkAlertDialogComponent, {
			data: dialogData
		});
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
			declarations: [TestHostComponent, StarkAlertDialogComponent],
			imports: [CommonModule, NoopAnimationsModule, MatDialogModule, MatIconModule, MatIconTestingModule, TranslateModule.forRoot()],
			providers: []
		})
			.overrideModule(BrowserDynamicTestingModule, {
				// FIXME review after https://github.com/angular/angular/issues/10760
				// add entryComponent to TestingModule (suggested in https://github.com/angular/angular/issues/10760#issuecomment-250522300)
				set: { entryComponents: [StarkAlertDialogComponent] }
			})
			.compileComponents()));

	beforeEach(inject(
		[MatDialog, OverlayContainer, ComponentFactoryResolver],
		(d: MatDialog, oc: OverlayContainer, cfr: ComponentFactoryResolver) => {
			dialogService = d;
			overlayContainer = oc;
			overlayContainerElement = oc.getContainerElement();
			dialogComponentSelector = cfr.resolveComponentFactory(StarkAlertDialogComponent).selector;
		}
	));

	afterEach(() => {
		overlayContainer.ngOnDestroy();
	});

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostFixture.detectChanges();

		mockObserver = createSpyObj<Observer<StarkAlertDialogResult>>("observerSpy", ["next", "error", "complete"]);
	});

	it("should be correctly opened via the MatDialog service", () => {
		expect(hostComponent).toBeDefined();
		expect(dialogService).toBeDefined();

		const dialogRef: MatDialogRef<StarkAlertDialogComponent, StarkAlertDialogResult> = openDialog(dummyDialogContent);
		hostFixture.detectChanges();

		expect(dialogRef.componentInstance instanceof StarkAlertDialogComponent).toBe(true);

		const dialogElement: HTMLElement | null = overlayContainerElement.querySelector<HTMLElement>(
			matDialogSelector + " " + dialogComponentSelector
		);

		const dialogTitleElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogTitleSelector);
		expect(dialogTitleElement).toBeDefined();
		expect((<HTMLElement>dialogTitleElement).innerHTML).toContain(<string>dummyDialogContent.title);

		const dialogContentElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogContentSelector);
		expect(dialogContentElement).toBeDefined();
		expect((<HTMLElement>dialogContentElement).innerHTML).toBe(<string>dummyDialogContent.textContent);

		const dialogActionsElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogActionsSelector);
		expect(dialogActionsElement).toBeDefined();
		const dialogButtonElements: NodeListOf<HTMLElement> = (<HTMLElement>dialogActionsElement).querySelectorAll("button");
		expect(dialogButtonElements.length).toBe(1);
		expect(dialogButtonElements[0].innerHTML).toBe(<string>dummyDialogContent.ok);
	});

	it("should return 'ok' as result when the 'Ok' button is clicked", fakeAsync(() => {
		const dialogRef: MatDialogRef<StarkAlertDialogComponent, StarkAlertDialogResult> = openDialog(dummyDialogContent);
		hostFixture.detectChanges();

		const dialogElement: HTMLElement | null = overlayContainerElement.querySelector<HTMLElement>(
			matDialogSelector + " " + dialogComponentSelector
		);

		dialogRef.afterClosed().subscribe(mockObserver);

		const dialogActionsElement: HTMLElement | null = (<HTMLElement>dialogElement).querySelector<HTMLElement>(matDialogActionsSelector);
		expect(dialogActionsElement).toBeDefined();
		const dialogButtonElements: NodeListOf<HTMLElement> = (<HTMLElement>dialogActionsElement).querySelectorAll("button");
		expect(dialogButtonElements.length).toBe(1);

		triggerClick(dialogButtonElements[0]);
		hostFixture.detectChanges();

		// to avoid NgZone error: "Error: 3 timer(s) still in the queue"
		tick(500); // the amount of mills can be known by calling flush(): const remainingMills: number = flush();

		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith("ok");
		expect(mockObserver.error).not.toHaveBeenCalled();
		expect(mockObserver.complete).toHaveBeenCalled();
	}));

	it("should return undefined as result when it is cancelled by clicking outside of the dialog", fakeAsync(() => {
		const dialogRef: MatDialogRef<StarkAlertDialogComponent, StarkAlertDialogResult> = openDialog(dummyDialogContent);
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
		const dialogRef: MatDialogRef<StarkAlertDialogComponent, StarkAlertDialogResult> = openDialog(dummyDialogContent);
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
