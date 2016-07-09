#!/usr/bin/env node

var program = require('commander')
var currPath = process.cwd();


var main = function(){
	console.log("-- rider generator--");
	program
		.version('0.0.1')
		.command('create-app <projectName>', 'create project ')
		.action(function (projectName){
			console.log('project name:'+projectName);
		});
	program.parse(process.argv);

}

main();


