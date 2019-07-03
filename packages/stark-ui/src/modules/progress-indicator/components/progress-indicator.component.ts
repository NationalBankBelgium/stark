import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";

import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * Name of the component
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
	 * @param logger- The logger of the application
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
	}
}
