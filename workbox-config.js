module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,js,html,css}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};