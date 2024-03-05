import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
	MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
	MatLegacySnackBar as MatSnackBar,
	MatLegacySnackBarRef as MatSnackBarRef
} from "@angular/material/legacy-snack-bar";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkMessageType } from "@nationalbankbelgium/stark-ui/src/common";
import { StarkToastNotificationComponent } from "./toast-notification.component";

@Component({
	selector: `host-component`,
	template: ` <stark-toast-notification></stark-toast-notification> `
})
class TestHostComponent {
	@ViewChild(StarkToastNotificationComponent, { static: true })
	public toastNotificationComponent!: StarkToastNotificationComponent;
}

describe("ToastNotificationComponent", () => {
	let component: StarkToastNotificationComponent;
	let hostComponent: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	const mockMatSnackBarConfig: any = {
		delay: 10,
		actionLabel: "action",
		actionClasses: []
	};

	const mockSnackBarRef: Partial<MatSnackBarRef<any>> = {
		dismissWithAction: jasmine.createSpy("dismissWithAction")
	};

	const mockSnackBar: Partial<MatSnackBar> = {
		_openedSnackBarRef: <MatSnackBarRef<any>>mockSnackBarRef
	};
	/**
	 * async beforeEach
	 */
	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			declarations: [StarkToastNotificationComponent, TestHostComponent],
			imports: [TranslateModule.forRoot(), MatButtonModule, MatIconModule, MatIconTestingModule],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: MatSnackBar, useValue: mockSnackBar },
				// Need to clone the object to avoid mutation of it between tests
				{ provide: MAT_SNACK_BAR_DATA, useValue: { ...mockMatSnackBarConfig } }
			]
		})
			/**
			 * Compile template and css
			 */
			.compileComponents()));

	/**
	 * Synchronous beforeEach
	 */
	beforeEach(() => {
		fixture = TestBed.createComponent(TestHostComponent);
		hostComponent = fixture.componentInstance;
		fixture.detectChanges(); // trigger initial data binding

		component = hostComponent.toastNotificationComponent;
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(fixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();

			expect(component.snackBar).not.toBeNull();
			expect(component.snackBar).toBeDefined();

			expect(component.data).not.toBeNull();
			expect(component.data).toBeDefined();
			expect(component.data.delay).toBeDefined();
			expect(component.data.delay).toBe(10);
			expect(component.data.actionLabel).toBeDefined();
			expect(component.data.actionLabel).toBe("action");
			expect(component.data.actionClasses).toBeDefined();
			expect(component.data.type).toBeUndefined();
		});
	});

	describe("on closeToast() call", () => {
		it("should call hide service method", () => {
			component.closeToast();
			if (mockSnackBar._openedSnackBarRef) {
				expect(mockSnackBar._openedSnackBarRef.dismissWithAction).toHaveBeenCalled();
			}
		});
	});

	describe("on getMessageTypeClass() call", () => {
		it("should return the correct class name", () => {
			let cssClass: string = component.getMessageTypeClass();
			expect(cssClass).toBe("");

			component.data.type = StarkMessageType.WARNING;
			cssClass = component.getMessageTypeClass();
			expect(cssClass).toBe("stark-toast-message-warning");

			component.data.type = StarkMessageType.INFO;
			cssClass = component.getMessageTypeClass();
			expect(cssClass).toBe("stark-toast-message-info");

			component.data.type = StarkMessageType.ERROR;
			cssClass = component.getMessageTypeClass();
			expect(cssClass).toBe("stark-toast-message-error");
		});
	});
});
