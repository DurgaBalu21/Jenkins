module.exports = {
    default: {
        paths: ["features/**/*.feature"],
        require: ["support/**/*.js", "steps/**/*.js"],
        format: [
            "progress",
            "json:reports/cucumber-report.json"
        ],
        publishQuiet: true
    }
};
