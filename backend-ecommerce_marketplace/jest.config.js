module.exports = {
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\tests\\\\", "\\\\unitTestReports\\\\"],
	coverageProvider: "v8",

	reporters: [
		"default",
		[
			"./node_modules/jest-html-reporter", //HTML
			{
				pageTitle: "One-Click-Classified-Backend Test Report",
				outputPath: "test-report/report.html",
				includeConsoleLog: true,
				includeFailureMsg: true,
				statusIgnoreFilter: '"passed", "pending", "failed"',
			},
		],
	],

	testEnvironment: "node",

	verbose: true,
};
