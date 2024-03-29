import { Directive, ElementRef, forwardRef, Input, OnChanges, Provider, Renderer2 } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * The constant that contains the command for {@link StarkTransformInputDirective} to transform the input value in an element to uppercase.
 */
export const UPPERCASE: "uppercase" = "uppercase";

/**
 * The constant that contains the command for {@link StarkTransformInputDirective} to transform the input value in an element to lowercase.
 */
export const LOWERCASE: "lowercase" = "lowercase";

/**
 * Type of transformations that can be done via the {@link StarkTransformInputDirective}
 */
export type StarkInputTransformationType = typeof UPPERCASE | typeof LOWERCASE | ((value: any) => any);

/**
 * Provider for {@link StarkTransformInputDirective}
 */
export const STARK_TRANSFORM_INPUT_PROVIDER: Provider = {
	provide: NG_VALUE_ACCESSOR,
	// eslint-disable-next-line @angular-eslint/no-forward-ref
	useExisting: forwardRef(() => StarkTransformInputDirective),
	multi: true
};
/**
 * Directive to transform the input value of an input or textarea. It sits between the native element and the ngControl (ngModel/formControl) so observers are triggered only once.
 * This directive will not affect changes applied trough code, only user input will be transformed. This means i.a. initial values are not transformed.
 *
 * It is possible to pass 'uppercase', 'lowercase' or a custom function to transform the value. This directive works if the input is controlled or not.
 * @example
 * <input [(ngModel)] StarkTransformInputDirective="uppercase" />
 * // OR
 * <input [formControl] StarkTransformInputDirective="lowercase" />
 * // OR
 * <input StarkTransformInputDirective="someFunction" />
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: "[starkTransformInput]",
	providers: [STARK_TRANSFORM_INPUT_PROVIDER],
	host: {
		"(input)": "_onInput($event)",
		"(blur)": "_onTouched()"
	}
})
export class StarkTransformInputDirective implements ControlValueAccessor, OnChanges {
	/**
	 * @ignore
	 * Internal property for holding the transformation function
	 */
	public _transformation: (value: any) => any = (value: any): any => value;

	/**
	 * Transformation to be done on the input value
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input("starkTransformInput")
	public set transformation(transformation: StarkInputTransformationType) {
		switch (transformation) {
			case UPPERCASE:
				this._transformation = (v: string): string => v.toUpperCase();
				break;
			case LOWERCASE:
				this._transformation = (v: string): string => v.toLocaleLowerCase();
				break;
			default:
				this._transformation = transformation;
				break;
		}
	}

	/**
	 * @ignore
	 * The registered callback function called when an input event occurs on the input element.
	 */
	private _onChange: (_: any) => void = (_: any) => {
		/* noop*/
	};

	/**
	 * @ignore
	 * The registered callback function called when a blur event occurs on the input element.
	 */
	public _onTouched: () => void = (): void => {
		/* noop*/
	};

	/**
	 * Class constructor
	 * @param _renderer - Angular renderer
	 * @param _elementRef - Reference to the DOM element where this directive is applied to.
	 */
	public constructor(
		private _renderer: Renderer2,
		private _elementRef: ElementRef
	) {}

	/**
	 * Angular life cycle hook
	 */
	public ngOnChanges(): void {
		// Type guard
		if (typeof this._transformation !== "function" && ![UPPERCASE, LOWERCASE].includes(this._transformation)) {
			throw Error("[starkTransformInput]: the transformation input is not valid. It should be of type StarkInputTransformationType");
		}
	}

	/**
	 * Sets the "value" property on the input element.
	 *
	 * @param value - The checked value
	 */
	public writeValue(value: any): void {
		// eslint-disable-next-line no-null/no-null
		const normalizedValue: any = value === null ? "" : value;
		this._renderer.setProperty(this._elementRef.nativeElement, "value", normalizedValue);
	}

	/**
	 * Registers a function called when the control value changes.
	 *
	 * @param fn - The callback function
	 */
	public registerOnChange(fn: (_: any) => void): void {
		this._onChange = fn;
	}

	/**
	 * Registers a function called when the control is touched.
	 *
	 * @param fn - The callback function
	 */
	public registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	/**
	 * Sets the "disabled" property on the input element.
	 *
	 * @param isDisabled - The disabled value
	 */
	public setDisabledState(isDisabled: boolean): void {
		this._renderer.setProperty(this._elementRef.nativeElement, "disabled", isDisabled);
	}

	/**
	 * Listens to input event from the native element
	 * @param event - The handled event
	 */
	public _onInput(event: Event): void {
		const value: any = (<HTMLInputElement>event.target).value;
		const transformed: any = this._transformation(value);
		if (transformed !== value) {
			this._elementRef.nativeElement.value = transformed;
			this._onChange(transformed);
		} else {
			this._onChange(value);
		}
	}
}
