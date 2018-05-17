var fs = require("fs");
var chalk = require("chalk");
var path = require("path");
var readMetadata = require("read-metadata");
var metalsmith = require("metalsmith");
var async = require("async");
var inquirer = require("inquirer");
var ora = require("ora");
var render = require("consolidate").handlebars.render;
var handlebars = require("handlebars");

function init(template, prjName) {
    template = getTemplatePath(template, prjName);
    if (!fs.existsSync(template)) {
        console.log(chalk.red(`${template}不存在`));
    }
    else {
        generate(template, prjName);
    }
};

function getTemplatePath(template) {
    if (path.isAbsolute(template)) {
        return template;
    }
    else {
        path.normalize(path.join(process.cwd(), template));
    }
};

function generate(template, prjName) {
    var metaData = getMetaData(template, prjName);
    var metal = metalsmith(path.join(template, "template"));
    var dest = path.resolve(prjName);
    metal.metadata(metaData);
    metal
        .use(inquery(metaData))
        .use(renderTemplate(metaData));

    metal
        .source(".")
        .destination(dest)
        .build(function (err, files) {
            if (err) {
                console.log(chalk.red(err));
                process.exit(1);
            }
            process.exit(0);
        })
};

function getMetaData(template, prjName) {
    var f = path.join(template, "meta.json");
    var metadata = readMetadata.sync(f);

    metadata.prompts["name"].default = prjName;

    return metadata;
};

function inquery(metaData) {
    return function (files, metalsmith, callback) {
        async.eachSeries(Object.keys(metaData.prompts), function (key, callback) {
            askQuestion(key, metaData.prompts[key], metalsmith, callback);
        }, function () {
            callback();
        })
    };
};

function askQuestion(key, prompt, metalsmith, callback) {
    inquirer
        .prompt({
            type: prompt.type,
            name: key,
            message: "please input " + prompt.label,
            default: prompt.default ? prompt.default : ""
        })
        .then(function (answers) {
            metalsmith.metadata()[key] = answers[key];
            callback();
        })
};

function renderTemplate(metaData) {
    return function (files, metalsmith, callback) {
        var spinner = ora("开始处理模板");
        spinner.start();
        async.each(Object.keys(files), function (key, cb) {
            var content = files[key].contents.toString();
            if (!/{{([^{}]+)}}/.test(content)) {
                return cb();
            }

            var template = handlebars.compile(content);
            var res = template(metalsmith.metadata());
            files[key].contents = new Buffer(res);
            cb();

            // render(content, metalsmith.metadata(), function(err, res){
            //     if(err){
            //         return cb(err);
            //     }
            //     files[key].contents = new Buffer(res);
            //     cb();
            // });

        }, function (err) {
            if (err) {
                console.log(chalk.red(err));
                spinner.fail("处理模板失败");
            } else {
                spinner.succeed("处理模板完成");
            }
            callback();
        });
    };
};

module.exports = init;