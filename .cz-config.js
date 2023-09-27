const commitLintConfig = require("./commitlint.config");
const generateScopes = () => {
	let rules = [];
	for (rule of commitLintConfig.rules["scope-enum"][2]) {
		rules.push({ name: rule });
	}
	return rules;
};

module.exports = {
	//See here for options details https://github.com/leonardoanalista/cz-customizable#options
	types: [
		{ value: "feat", name: "feat:     A new feature" },
		{ value: "fix", name: "fix:      A bug fix" },
		{ value: "docs", name: "docs:     Documentation only changes" },
		{
			value: "style",
			name: "style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)"
		},
		{ value: "refactor", name: "refactor: A code change that neither fixes a bug nor adds a feature" },
		{ value: "perf", name: "perf:     A code change that improves performance" },
		{ value: "test", name: "test:     Adding missing tests or correcting existing tests" },
		{
			value: "build",
			name: "build:     Changes that affect the build system or external dependencies (example scopes: rollup, npm)"
		},
		{
			value: "ci",
			name: "ci:     Changes to our CI configuration files and scripts (example scopes: GitHub Actions, Circle, BrowserStack, SauceLabs)"
		},
		{
			value: "chore",
			name: "chore:    Changes to the build process or auxiliary tools and libraries such as documentation generation"
		},
		{ value: "revert", name: "revert:      Reverts a previous commit" }
	],
	scopes: generateScopes()
};
