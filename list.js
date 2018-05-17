var readMetadata = require("read-metadata");
var chalk = require("chalk");
var path = require("path");

var oConfig = readMetadata.sync(path.join(__dirname, "config.json"));

module.exports = function () {
    var templates = oConfig.templates;
    templates.forEach(function (template) {
        console.log(chalk.green(template.name) + " ---- " + chalk.yellow(template.description));
    });
};
