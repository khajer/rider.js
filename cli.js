#!/usr/bin/env node

var program = require('commander')
var currPath = process.cwd();


var main = function(){
	console.log("-- rider generator--");
	program
		.version('0.0.1')
		.command('<func> <projectName>')
		.option("create-app <projectName>", "create new project ")
		.action(function (func, projectName){
			console.log("function : "+func)
			console.log('create new project: "'+projectName+'"');
			
		});
	program.parse(process.argv);

}

main();


