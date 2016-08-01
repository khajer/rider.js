#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

var createApp = require('./libs/create-app.js');
var createController = require('./libs/create-controller.js');
var createModel = require('./libs/create-model.js');
var genModel = require('./libs/gen-model.js');
var createLogin = require('./libs/create-login.js');

var listCommand = [];
var setCommand = function(strName, obj){
	listCommand[strName] = obj;
};

var logDetail = function(str){
	console.log('  > '+str);

}
setCommand("create-app", {
	name:"create-app", 
	params:'appName',
	options:"",
	desc: 'create new app',
	runCommand:function(params, cb){
		var projectName = params[3];
		if(params[3] == undefined){
			cb();
			return;
		}
		logDetail("["+this.name+"] : "+projectName)
		createApp.copyPrototype(projectName, function(err){
			if(err){
				logDetail('generate project not completed');
				cb(true);
				return;
			}
			createApp.modifyFilePackage(projectName, function(err){
				if(err){
					logDetail('modify package error');
					cb(true);
					return;
				}
				createApp.initialConfigDB(projectName, function(err){
					if(err){
						logDetail('generate init config db fails');
						cb(true);
						return;	
					}
					createApp.automaticCallNpmInstall(projectName, function(err){
						if(err){
							logDetail('auto call npm install fails');
						}else{
							logDetail('auto call npm install completed');
						}
						cb(false);		
					})
				});	
				
			});				
		});
	}
});
setCommand("create-controller", {
	name:"create-controller", 
	params:'controllerName',
	options:"-a",
	desc: 'create controller (route), [-a : with authen]',
	runCommand:function(params, cb){
		var controllerName = params[3];
		var opt = params[4];

		objCreateCon = {
			controllerName: controllerName,
			auth:false
		};

		if(opt != undefined || opt != null){
			if(opt.trim() == "-a"){
				objCreateCon.auth = true;	
			}
		}

		logDetail('create controller: '+controllerName)
		createController.genController(objCreateCon, function(err){
			if(err){
				logDetail("create controller '"+controllerName+ "' fails");
				cb();
				return;
			}
			logDetail("create controller '"+controllerName+ "' completed");
			cb();
		});
	}
});
setCommand("create-model", {
	name:"create-model", 
	params:'modelName',
	options:"",
	desc: 'create new Data Model (database)',
	runCommand:function(params, cb){
		var modelName = params[3];
		logDetail('create model: '+modelName)
		createModel.beginPrompt(param, function(err){
			logDetail("create model '"+modelName+ "' completed");
			cb();
		});
	}
});
setCommand("gen-model-controller", {
	name:"gen-model-controller", 
	params:'modelName',
	options:"-a",
	desc: 'auto generate controller with Data model[-a : with authen]',
	runCommand:function(params, cb){
		var modelName = params[3];
		logDetail("generate controller with model: " + modelName)
		genModel.generateControllerModel(modelName, function(err){
			if(err){
				logDetail("create controller '"+modelName+ "' fails");
				cb();
			}
			logDetail("generate model to controller '"+modelName+ "' completed");
			cb();
		});
	}
});
setCommand("gen-rest-model", {
	name:"gen-rest-model", 
	params:'modelName',
	options:"",
	desc: 'auto generate controller REST API with Data model',
	runCommand:function(params, cb){
		logDetail('gen-rest-model');
		cb();
	}
});
setCommand("create-login", {
	name:"create-login", 
	params:'',
	options:"",
	desc: 'create simple and genenate login/register',
	runCommand:function(params, cb){
		createLogin.generateLogin(function(err){
			if(err){
				logDetail('generate login fails')
				cb(); 
				return;
			}
			logDetail('generate login success');
			cb();
		});		
	}
});

setCommand("create-login-model", {
	name:"create-login-model", 
	params:'',
	options:"-s",
	desc: 'create login with model and genenate login/register',
	runCommand:function(params, cb){
		logDetail('create-login');
		cb();
	}
});

setCommand("gen-fullmenu", {
	name:"gen-fullmenu", 
	params:'',
	desc: 'create nav-bar/sidemenu/mainview/footer',
	runCommand:function(params, cb){
		console.log('gen-fullmenu');
		cb();
	}
});

var printHelp = function(){
	var txtHelp = "";
	var h = '  ';
	var t = '    ';

	txtHelp += "\n"+h+"Usage : rider [command] \n";
	txtHelp += "\n"+h+"Command List : \n";
	var maxText = 0;
	
	Object.keys(listCommand).forEach(function(keyName){
		var item = listCommand[keyName];
		if(maxText < item.name.length+item.params.length) 
			maxText = item.name.length+item.params.length+4;
	});
	
	var maxT = Math.ceil(maxText/4);

	Object.keys(listCommand).forEach(function(keyName){
		var item = listCommand[keyName];
		var x = (item.name.length+item.params.length+4)/4;
		x = Math.ceil(x);
		var space = '\t';
		for (var i = 0; i < maxT-x-1; i++) {
			space += '\t'; 
		}
		var txt = "";
		if(item.params.length > 0){
			space += '\t';
			txt = '\t'+item.name +" [" +item.params+"] " + space +item.desc+"\n";
		}else{

			txt = '\t'+item.name + space +item.desc+"\n";
		}
		
		txtHelp +=txt;	
		txtHelp	+"\n";	
	});
	console.log(txtHelp);
	process.exit(0);

}
var parseParams = function(params, cb){
	if(params.length < 3){
		return cb(true, null, null);
	}
	cb(null, params);
}	

var checkCommand = function(cmd){
	var foundCmd = false;
	Object.keys(listCommand).forEach(function(keyName){
		if(keyName == cmd){
			foundCmd = true;
			return;
		}
	});
	return !foundCmd;
}

var runCommand = function(params, cb){
	var opt = params[2];
	var objRun = listCommand[opt];
	if(objRun != undefined && objRun != null){
		console.log('command: "'+opt+'"');
		objRun.runCommand(params, cb);
	}
}

var main = function(){
	console.log(">> Rider ... ");
	parseParams(process.argv, function(err, params){
		if(err){
			printHelp();
			return;
		}
		var opt = params[2];
		if(opt == "-h" || opt == "--help"){
			printHelp();
			return;
		}		
		if(checkCommand(opt)){
			printHelp();
			return;	
		}
		runCommand(params, function(){
			process.exit(0);	
		});
	});
}
// -- call main function --
main();


