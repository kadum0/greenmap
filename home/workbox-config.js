module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{css,html,js,png}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};