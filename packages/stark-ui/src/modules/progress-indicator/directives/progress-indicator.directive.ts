import {
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Directive,
	ElementRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewContainerRef
} from "@angular/core";
import { STARK_PROGRESS_INDICATOR_SERVICE, StarkProgressIndicatorService } from "../services";
import { StarkProgressIndicatorConfig, StarkProgressIndicatorType } from "../entities";
import { Subscription } from "rxjs";
import { StarkProgressIndicatorComponent } from "../components/progress-indicator.component";

/**
 * Name of the directive
 */
const directiveName = "[starkProgressIndicator]";

/**
 * This directive must be used as attribute on a DOM element and the config provided should be a {@link StarkProgressIndicatorConfig} object:
 *
 * ```html
 * <some-element [starkProgressIndicator]="{topic: 'some-topic', type: 'SPINNER'}" ></some-element>
 * <!-- or -->
 * <some-element [starkProgressIndicator]="progressIndicatorConfig" ></some-element>
 * ```
 *
 * Once the directive is initialized, it registers itself to the {@link StarkProgressIndicatorService} and creates an instance of the {@link StarkProgressIndicatorComponent} which is the one that actually displays the progress indicator (e.g., spinner).
 *
 * From then on you can control the state/visibility of the progress indicator programmatically by using the {@link StarkProgressIndicatorService}:
 *
 * ```typescript
 * // the service should be injected in your component
 * @Inject(STARK_PROGRESS_INDICATOR_SERVICE) private progressService: StarkProgressIndicatorService
 *
 * // then you can call the method to show the progress indicator
 * this.progressService.show(this.progressIndicatorConfig.topic);
 * // or to hide it
 * this.progressService.hide(this.progressIndicatorConfig.topic);
 * ```
 */
@Directive({
	selector: directiveName
})
export class StarkProgressIndicatorDirective implements OnInit, OnDestroy {
	@Input()
	public starkProgressIndicator!: StarkProgressIndicatorConfig;

	public topic!: string;
	public type!: StarkProgressIndicatorType | string;
	public progressSubscription!: Subscription;
	private _componentFactory: ComponentFactory<StarkProgressIndicatorComponent>;
	public _componentRef!: ComponentRef<StarkProgressIndicatorComponent>;

	public constructor(
		@Inject(STARK_PROGRESS_INDICATOR_SERVICE) public _progressService: StarkProgressIndicatorService,
		componentFactoryResolver: ComponentFactoryResolver,
		private _viewContainer: ViewContainerRef,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		this._componentFactory = componentFactoryResolver.resolveComponentFactory(StarkProgressIndicatorComponent);
	}

	/**
	 * Registers an instance of progress indicator
	 */
	public registerInstance(progressConfig: StarkProgressIndicatorConfig): void {
		this.topic = progressConfig.topic;

		if (typeof StarkProgressIndicatorType[progressConfig.type] !== "undefined") {
			this.type = StarkProgressIndicatorType[progressConfig.type];
		} else {
			this.type = StarkProgressIndicatorType.SPINNER;
		}

		this._progressService.register(this.topic, <StarkProgressIndicatorType>this.type);
	}

	/**
	 * The directive registers itself with the StarkProgressIndicator service.
	 * The component to add is then created and inserted inside of the container.
	 * Finally, if the component should be hidden or shown, the stark-hide class is removed/added accordingly
	 */
	public ngOnInit(): void {
		this._componentRef = this._viewContainer.createComponent(this._componentFactory);

		// TODO The element is here added as a child, not as a sibling
		// this.renderer.appendChild(this.elementRef.nativeElement, this._componentRef.location.nativeElement);

		this._viewContainer.insert(this._componentRef.hostView);

		this.progressSubscription = this._progressService.isVisible(this.topic).subscribe(
			(isVisible: boolean = false): void => {
				this._componentRef.instance.isShown = isVisible;
				if (isVisible) {
					this.renderer.addClass(this.elementRef.nativeElement, "stark-hide");
				} else {
					this.renderer.removeClass(this.elementRef.nativeElement, "stark-hide");
				}
			}
		);

		if (!this.starkProgressIndicator) {
			throw new Error("StarkProgressIndicatorDirective: a StarkProgressIndicatorConfig is required.");
		}
		this.registerInstance(this.starkProgressIndicator);
	}

	/**
	 * The directive de-registers itself from the StarkProgressIndicator service when it is destroyed.
	 */
	public ngOnDestroy(): void {
		this._viewContainer.clear();
		this.progressSubscription.unsubscribe();
		this._progressService.deregister(this.topic);
	}
}
