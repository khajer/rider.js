var createApp = require('./libs/create-app.js');
var createModel = require('./libs/create-model.js');
var createController = require('./libs/create-controller.js');
var genModel = require('./libs/gen-model.js');
var createLogin = require('./libs/create-login.js');
var createLoginModel = require('./libs/create-login-model.js');

var listCommand;

var setCommand = (strName, obj) => {
	listCommand[strName] = obj;
};

var logDetail = (str) => {
	console.log('  > '+str);
}

module.exports = function(listCmd){
	listCommand = listCmd;

	setCommand("create-app", {
		name:"create-app", 
		params:'appName',
		options:"",
		desc: 'create new app',
		runCommand:function(params, cb) {
			var projectName = params[3];
			if(params[3] == undefined){
				cb();
				return;
			}
			logDetail("["+this.name+"] : "+projectName)
			createApp.copyPrototype(projectName, (err) => {
				if(err){
					logDetail('generate project not completed');
					cb(true);
					return;
				}
				createApp.modifyFilePackage(projectName, (err) => {
					if(err){
						logDetail('modify package error');
						cb(true);
						return;
					}
					createApp.initialConfigDB(projectName, (err) => {
						if(err){
							logDetail('generate init config db fails');
							cb(true);
							return;	
						}
						createApp.automaticCallNpmInstall(projectName, (err) => {
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
		runCommand:function(params, cb) {
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
			createController.genController(objCreateCon, (err) => {
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
		runCommand:function(params, cb) {
			
			if(params[3]==undefined){
				logDetail('not found model name');
				cb(true);
				return 
			}
			var modelName = params[3];
			logDetail('create model: '+modelName)
			createModel.init(modelName, (err) => {
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
		runCommand:function(params, cb) {
			var modelName = params[3];
			logDetail("generate controller with model: " + modelName)
			genModel.generateControllerModel(modelName, (err) => {
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
		runCommand:function(params, cb) {
			logDetail('gen-rest-model');
			cb();
		}
	});
	setCommand("create-login", {
		name:"create-login", 
		params:'',
		options:"",
		desc: 'create simple and genenate login/register',
		runCommand:function(params, cb) {
			createLogin.generateLogin((err) => {
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
		runCommand:function(params, cb) {
			logDetail('create-login-model');
			createLoginModel.init(()=>{
				cb();	
			})
			
		}
	});

	setCommand("gen-fullmenu", {
		name:"gen-fullmenu", 
		params:'',
		desc: 'create nav-bar/sidemenu/mainview/footer',
		runCommand:function(params, cb) {
			console.log('gen-fullmenu');
			cb();
		}
	});


}