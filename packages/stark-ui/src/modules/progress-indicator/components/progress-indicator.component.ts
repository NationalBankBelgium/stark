import { Component, ElementRef, Inject, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";

import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * Name of the component
 */
const componentName: string = "stark-progress-indicator";

/**
 * Component that is dynamically created by the ProgressIndicatorDirective
 */
@Component({
	selector: "stark-progress-indicator",
	templateUrl: "./progress-indicator.component.html",
	encapsulation: ViewEncapsulation.None,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkProgressIndicatorComponent extends AbstractStarkUiComponent implements OnInit {
	public isShown: boolean = false;

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
