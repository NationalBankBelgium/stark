import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";

import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * @ignore
 */
const componentName = "stark-progress-indicator";

/**
 * Component that is dynamically created by the {@link StarkProgressIndicatorDirective}
 */
@Component({
	selector: "stark-progress-indicator",
	templateUrl: "./progress-indicator.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkProgressIndicatorComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService, renderer: Renderer2, elementRef: ElementRef) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.logger.debug(componentName + ": controller initialized");
	}
}
