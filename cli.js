#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// var fsx = require('fs-extra');

var createApp = require('./create-app.js');
var createController = require('./create-controller.js');
var createModel = require('./create-model.js');


var commandList = [
	"create-app",
	"create-controller",
	"create-model",
];

var printHelp = function(){
	var txtHelp = "";
	var h = '  ';
	var t = '    ';
	txtHelp += "\n"+h+"Usage : rider [command]"
		+"\n\n"
		+h+"Commands: "+"\n\n"
		+t+"create-app [appName]"+"\t\t"+"create new app"+"\n"
		+t+"gen-controller [controllerName]"+"\t"+"create controller "+"\n"
		+t+"create-model [modelName]"+"\t\t"+"create new Data Model"+"\n"
		+"";
	console.log(txtHelp);
	process.exit(0);

}
var parseParam = function(params, cb){
	if(params.length < 3){
		return cb(true, null, null);
	}
	cb(null, params[2], params[3]);
}	

var checkCommand = function(cmd){
	var foundCmd = false;
	commandList.forEach(function(command){
		if(cmd == command){
			foundCmd = true;
			return;
		}
	});
	return !foundCmd;
}

var runCommand = function(opt, param, cb){
	if(opt == "create-app"){
		var projectName = param;
		createApp.copyPrototype(projectName, function(err){
			if(!err){
				createApp.modifyFilePackage(projectName, function(err){
					if(!err){
						createApp.initialConfigDB(projectName, function(err){
							cb();		
						});	
					}
				});	
			}
		});
	}else if(opt == "create-model"){
		console.log('create model: '+param)
		createModel.beginPrompt(param, function(err){
			console.log("create model '"+param+ "' completed");
			cb();
		});
	}else if(opt == "create-controller"){
		console.log('create controller: '+param)
		createController.genController(param, function(err){
			if(err){
				console.log("create controller '"+param+ "' fails");
				cb();
				return;
			}
			console.log("create controller '"+param+ "' completed");
			cb();
		});
	}	
}

var main = function(){
	console.log(">> Rider ... ");
	parseParam(process.argv, function(err, opt, params){
		if(err){
			printHelp();
			return;
		}
		if(opt == "-h" || opt == "--help"){
			printHelp();
			return;
		}
		if(checkCommand(opt)){
			printHelp();
			return;	
		}
		runCommand(opt, params, function(){
			process.exit(0);	
		});
	});
}
// -- call main function --
main();


