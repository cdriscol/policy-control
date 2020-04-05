module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'filenames'
	],
	"env": {
		node: true,
		jasmine: true,
		es6: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended"
	],
	rules: {
		'@typescript-eslint/interface-name-prefix': [1, { "prefixWithI": "always" }],
		'@typescript-eslint/explicit-function-return-type': 0,
        "filenames/match-exported": [2, [ null, "camel" ] ],
        "prettier/prettier": ["error", {
            "endOfLine": "auto",
        }]
	},
	ignorePatterns: ["lib/"]
  };
