var inquirer = require("inquirer");

module.exports = function () {
    inquirer
        .prompt({
            type: "input",
            name: "test",
            message: "please input project name",
            default: "demo",
            validate: function(strInput){return strInput.length > 0}
        })
        .then(function (answers) {
            debugger;
            console.log(answers);
        })
};