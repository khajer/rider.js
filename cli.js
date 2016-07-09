#!/usr/bin/env node

var program = require('commander')
var currPath = process.cwd();


var main = function(){
	console.log("-- rider generator--");
	console.log(process.argv);
	program
		.version('0.0.1')
		.command('<func> <projectName>', 'create project ')
		.action(function (func, projectName){
			if(func=="create-app"){
				console.log('project name:'+projectName);
			}else{

			}
			
		});
	program.parse(process.argv);

}

main();


