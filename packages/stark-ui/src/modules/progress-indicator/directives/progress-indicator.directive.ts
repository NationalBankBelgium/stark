import {
	ComponentFactoryResolver,
	Directive,
	ElementRef,
	Inject,
	Injector,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewContainerRef,
	ViewRef
} from "@angular/core";
import { STARK_PROGRESS_INDICATOR_SERVICE, StarkProgressIndicatorService } from "../services";
import { StarkProgressIndicatorConfig, StarkProgressIndicatorType } from "../entities";
import { Subscription } from "rxjs";
import { StarkProgressIndicatorComponent } from "../components";

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
	/**
	 * Configuration object for the progress indicator to be shown.
	 */
	@Input()
	public starkProgressIndicator!: StarkProgressIndicatorConfig;

	/**
	 * The topic that the progress indicator will subscribe to.
	 */
	public topic!: string;

	/**
	 * Type of progress indicator
	 */
	public type!: StarkProgressIndicatorType | string;

	/**
	 * @ignore
	 */
	private progressSubscription?: Subscription;

	/**
	 * @ignore
	 */
	private readonly componentViewRef!: ViewRef;

	/**
	 * Class constructor
	 * @param _progressService - The ProgressIndicator service of the application
	 * @param componentFactoryResolver - Resolver that returns Angular component factories
	 * @param injector - The application Injector
	 * @param _viewContainer - The container where one or more views can be attached to the host element of this directive.
	 * @param renderer - Angular Renderer wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this directive is applied to.
	 */
	public constructor(
		@Inject(STARK_PROGRESS_INDICATOR_SERVICE) public _progressService: StarkProgressIndicatorService,
		componentFactoryResolver: ComponentFactoryResolver,
		injector: Injector,
		private _viewContainer: ViewContainerRef,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		const componentFactory = componentFactoryResolver.resolveComponentFactory(StarkProgressIndicatorComponent);
		const componentRef = componentFactory.create(injector);
		this.componentViewRef = componentRef.hostView;
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
	 * The directive registers itself to the {@link StarkProgressIndicatorService}.
	 * The component to add is then created and inserted inside of the container.
	 * Finally, if the host component should be hidden or shown, the "stark-hide" class is removed/added accordingly
	 */
	public ngOnInit(): void {
		if (!this.starkProgressIndicator) {
			throw new Error("StarkProgressIndicatorDirective: a StarkProgressIndicatorConfig is required.");
		}
		this.registerInstance(this.starkProgressIndicator);

		this.progressSubscription = this._progressService.isVisible(this.topic).subscribe(
			(isVisible: boolean = false): void => {
				if (isVisible) {
					// TODO The element is here added as a child, not as a sibling
					// this.renderer.appendChild(this.elementRef.nativeElement, componentRef.location.nativeElement);

					this._viewContainer.insert(this.componentViewRef); // insert the view in the last position
					this.renderer.addClass(this.elementRef.nativeElement, "stark-hide");
				} else {
					this._viewContainer.detach(this._viewContainer.indexOf(this.componentViewRef));
					this.renderer.removeClass(this.elementRef.nativeElement, "stark-hide");
				}
			}
		);
	}

	/**
	 * The directive de-registers itself from the {@link StarkProgressIndicatorService} when it is destroyed.
	 */
	public ngOnDestroy(): void {
		this.componentViewRef.destroy(); // destroy the progress indicator
		if (this.progressSubscription) {
			this.progressSubscription.unsubscribe();
		}
		this._progressService.deregister(this.topic);
	}
}
