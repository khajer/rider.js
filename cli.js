#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

var createApp = require('./create-app.js');
var createController = require('./create-controller.js');
var createModel = require('./create-model.js');
var genModel = require('./gen-model.js');

var commandList = [
	"create-app",
	"create-controller",
	"create-model",
	"gen-model",
	"gen-rest-model"
];

var cmdList = [{
		name:"create-app", 
		params:'appName',
		desc: 'create new app'
	},{
		name:"create-controller", 
		params:'controllerName',
		desc: 'create controller (route)'
	},{
		name:"create-model", 
		params:'modelName',
		desc: 'create new Data Model (database)'
	},{
		name:"gen-model", 
		params:'modelName',
		desc: 'auto generate controller with Data model'
	},{
		name:"gen-rest-model", 
		params:'modelName',
		desc: 'auto generate controller REST API with Data model'
	}
]

var printHelp = function(){
	var txtHelp = "";
	var h = '  ';
	var t = '    ';

	txtHelp += "\n"+h+"Usage : rider [command] \n";

	txtHelp += "\n"+h+"Command List : \n";
	var maxText = 0;
	cmdList.forEach(function(item){
		if(maxText < item.name.length+item.params.length) 
			maxText = item.name.length+item.params.length;
	});
	var maxT = Math.ceil(maxText/4);
	cmdList.forEach(function(item){
		var x = (item.name.length+item.params.length)/4;
		x = Math.ceil(x);
		var space = '\t';
		for (var i = 0; i < maxT-x-1; i++) {
			space += '\t'; 
		}
		var txt = '\t'+item.name +" [" +item.params+"] " + space +item.desc+"\n";
		txtHelp +=txt;
	});		
	txtHelp	+"\n";
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
	cmdList.forEach(function(item){
		if(item.name == cmd){
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
	}else if(opt == "gen-model"){
		console.log("generate controller with model: " + param)
		genModel.generateControllerModel(param, function(err){

			if(err){
				console.log("create controller '"+param+ "' fails");
				cb();
			}
			console.log("generate model to controller '"+param+ "' completed");
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


