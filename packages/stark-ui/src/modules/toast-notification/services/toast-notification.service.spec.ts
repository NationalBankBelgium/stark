import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { ApplicationRef } from "@angular/core";
import { fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import {
	MatLegacySnackBar as MatSnackBar,
	MatLegacySnackBarConfig as MatSnackBarConfig,
	MatLegacySnackBarDismiss as MatSnackBarDismiss,
	MatLegacySnackBarRef as MatSnackBarRef
} from "@angular/material/legacy-snack-bar";
import { StarkMessageType } from "@nationalbankbelgium/stark-ui/src/common";
import { StarkToastMessage, StarkToastNotificationComponent } from "../components";
import { StarkToastNotificationResult } from "./toast-notification-result.intf";
import { StarkToastNotificationServiceImpl } from "./toast-notification.service";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { Observable, Observer } from "rxjs";

describe("ToastNotificationService", () => {
	const message: StarkToastMessage = {
		key: "testMessage",
		id: "1",
		code: "abc",
		type: StarkMessageType.ERROR,
		actionLabel: "testAction",
		delay: 4321
	};

	let service: StarkToastNotificationServiceImpl;

	/** This observer is used to mimic Angular Material's MatSnackBar's behavior */
	let observer: Observer<MatSnackBarDismiss>;

	beforeEach(waitForAsync(() => {
		const mockLogger: MockStarkLoggingService = new MockStarkLoggingService();
		const afterDismissedObs: Observable<MatSnackBarDismiss> = new Observable<MatSnackBarDismiss>(
			(o: Observer<MatSnackBarDismiss>): void => {
				observer = o;
			}
		);
		const mockSnackBar: SpyObj<MatSnackBar> = createSpyObj<MatSnackBar>("MatSnackBar", {
			openFromComponent: <any>createSpyObj<MatSnackBarRef<StarkToastNotificationComponent>>("MatSnackBarRef", {
				afterDismissed: afterDismissedObs,
				dismissWithAction: <any>jasmine.createSpy("dismissWithAction"),
				dismiss: <any>jasmine.createSpy("dismiss")
			}),
			dismiss: undefined
		});
		const mockApplicationRef: SpyObj<ApplicationRef> = createSpyObj<ApplicationRef>("ApplicationRef", {
			tick: undefined
		});
		service = new StarkToastNotificationServiceImpl(
			<MatSnackBar>(<unknown>mockSnackBar),
			mockLogger,
			<ApplicationRef>(<unknown>mockApplicationRef),
			{
				delay: 3000,
				position: "top right",
				actionClasses: []
			}
		);
	}));

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(service.snackBar).not.toBeNull();
			expect(service.snackBar).toBeDefined();
			expect(service.logger).not.toBeNull();
			expect(service.logger).toBeDefined();
		});
	});

	describe("on getConfig", () => {
		it("should return default configuration", () => {
			const conf: MatSnackBarConfig = service.getConfig(message);
			expect(conf).not.toBeNull();
			expect(conf).toBeDefined();

			expect(conf.data).not.toBeNull();
			expect(conf.data).toBeDefined();
			expect(conf.data).toBe(message);

			expect(conf.duration).not.toBeNull();
			expect(conf.duration).toBeDefined();
			expect(conf.duration).toBe(4321);

			expect(conf.horizontalPosition).not.toBeNull();
			expect(conf.horizontalPosition).toBeDefined();
			expect(conf.horizontalPosition).toBe("right");

			expect(conf.verticalPosition).not.toBeNull();
			expect(conf.verticalPosition).toBeDefined();
			expect(conf.verticalPosition).toBe("top");
		});
	});

	describe("on show", () => {
		it("should display the snack bar", fakeAsync(() => {
			let showObs: Observable<StarkToastNotificationResult> = service.show(message);
			expect(showObs).not.toBeNull();
			expect(showObs).toBeDefined();

			expect(service.snackBar.openFromComponent).toHaveBeenCalledTimes(0);

			expect((<any>service).currentToastResult$).not.toBeDefined();

			showObs.subscribe((ret: StarkToastNotificationResult) => {
				expect(ret).toBe(StarkToastNotificationResult.CLOSED_BY_NEW_TOAST);
			});

			tick();

			expect(service.snackBar.openFromComponent).toHaveBeenCalledTimes(1);

			expect((<any>service).currentToastResult$).not.toBeNull();
			expect((<any>service).currentToastResult$).toBeDefined();

			showObs = service.show(message);

			/** Mimic MatSnackBar's behavior */
			observer.next({ dismissedByAction: false });

			expect(showObs).not.toBeNull();
			expect(showObs).toBeDefined();

			expect((<any>service).currentToastResult$).not.toBeDefined();

			expect(service.snackBar.openFromComponent).toHaveBeenCalledTimes(1);

			showObs.subscribe((ret: StarkToastNotificationResult) => {
				expect(ret).toBe(StarkToastNotificationResult.CLOSED_ON_DELAY_TIMEOUT);
			});

			tick();

			expect(service.snackBar.openFromComponent).toHaveBeenCalledTimes(2);

			expect((<any>service).currentToastResult$).not.toBeNull();
			expect((<any>service).currentToastResult$).toBeDefined();

			/** Mimic MatSnackBar's behavior */
			observer.next({ dismissedByAction: false });

			tick();
		}));
	});

	describe("on hide", () => {
		it("should hide the snackbar", fakeAsync(() => {
			service.show(message).subscribe((ret: StarkToastNotificationResult) => {
				expect(ret).toBe(StarkToastNotificationResult.HIDDEN);
			});

			tick();

			spyOn((<any>service).currentToastResult$, "complete");

			const privateObserver: Observer<StarkToastNotificationResult> = (<any>service).currentToastResult$;

			expect(privateObserver.complete).not.toHaveBeenCalled();

			service.hide();

			/** Mimic MatSnackBar's behavior */
			observer.next({ dismissedByAction: true });

			tick();

			expect(privateObserver.complete).toHaveBeenCalled();
		}));
	});
});
