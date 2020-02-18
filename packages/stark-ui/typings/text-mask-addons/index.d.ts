// typings not yet provided in the text-mask library
// TODO: remove these and use the ones from DefinitelyTyped once they are implemented
declare module "text-mask-addons" {
	import * as textMaskCore from "text-mask-core";

	export = textMaskAddons;

	namespace textMaskAddons {
		interface NumberMaskConfig {
			prefix?: string;
			suffix?: string;
			includeThousandsSeparator?: boolean;
			thousandsSeparatorSymbol?: string;
			allowDecimal?: boolean;
			decimalSymbol?: string;
			decimalLimit?: number;
			integerLimit?: number;
			requireDecimal?: boolean;
			allowNegative?: boolean;
			allowLeadingZeroes?: boolean;
		}

		function createNumberMask(config: NumberMaskConfig): textMaskCore.MaskFunction;

		function createAutoCorrectedDatePipe(dateFormat: string): textMaskCore.PipeFunction;

		const emailMask: textMaskCore.CombinedPipeMask;
	}
}
