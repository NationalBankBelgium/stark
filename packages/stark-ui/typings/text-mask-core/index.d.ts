// typings not yet provided in the text-mask library
// TODO: remove these and use the ones from DefinitelyTyped once they are implemented
declare module "text-mask-core" {
	export = textMaskCore;

	namespace textMaskCore {
		type MaskArray = (string | RegExp)[];

		type MaskFunction = (rawValue: string, config: MaskFunctionConfig) => MaskArray;

		type Mask = MaskArray | MaskFunction | CombinedPipeMask;

		type PipeFunction = (conformedValue: string, config: TextMaskConfig) => false | string | PipeResultObject;

		interface MaskFunctionConfig {
			currentCaretPosition?: number;
			previousConformedValue?: string;
			placeholderChar?: string;
		}

		interface CombinedPipeMask {
			mask: Mask;
			pipe: PipeFunction;
		}

		interface PipeResultObject {
			value: string;
			indexesOfPipedChars: number[];
		}

		interface TextMaskConfig {
			mask: Mask | false;
			guide?: boolean;
			placeholderChar?: string;
			keepCharPositions?: boolean;
			pipe?: PipeFunction;
			showMask?: boolean;
		}

		interface ConformToMaskResult {
			conformedValue: string;
			meta: {
				someCharsRejected: boolean;
			};
		}

		interface ConformToMaskConfig {
			guide?: boolean;
			pipe?: PipeFunction;
			previousConformedValue?: string;
			placeholderChar?: string;
			placeholder?: string;
			currentCaretPosition: number;
			keepCharPositions: boolean;
		}

		function conformToMask(rawValue: string, mask: MaskArray | MaskFunction, config: ConformToMaskConfig): ConformToMaskResult;

		interface AdjustCaretPositionConfig {
			previousConformedValue: string;
			conformedValue: string;
			currentCaretPosition: number;
			rawValue: string;
			placeholderChar: string;
			placeholder: string;
			indexesOfPipedChars: string[];
			currentTrapIndexes: number[];
		}

		function adjustCaretPosition(config: AdjustCaretPositionConfig): number;

		interface CreateTextMaskInputElementConfig extends TextMaskConfig {
			inputElement: HTMLInputElement;
		}

		interface TextMaskInputElement {
			update(rawValue?: string): void;

			state: {
				// anything that needs to be kept between "update" calls, it is stored in this "state" object.
				previousConformedValue: string;
				previousPlaceholder: string;
			};
		}

		function createTextMaskInputElement(config: CreateTextMaskInputElementConfig): TextMaskInputElement;
	}
}
