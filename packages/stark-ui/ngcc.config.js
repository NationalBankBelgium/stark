module.exports = {
	ignorableDeepImportMatchers: [
		/lodash-es\/(cloneDeep|find|findIndex|get|isEmpty|isEqual|merge|reduce|sortBy|uniqueId)/,
		/prettier\/(parser-angular|parser-babel|parser-html|parser-postcss|parser-typescript|standalone)/,
		/prismjs\/components/,
		/angular2-text-mask/,
		/text-mask-core\/dist\/textMaskCore/
	],
	packages: {
		"angular2-text-mask": {
			ignorableDeepImportMatchers: [/text-mask-core\//]
		}
	}
};
