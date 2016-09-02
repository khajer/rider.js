const fs = require('fs');

const viewsPath = '/app/views';
const ejs = require('ejs');

const utils = require('./utils.js')

var contPath = '/app/controllers';

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var logDetail = function(str){
	console.log("    - "+str);
}

var createView = function(objCreateCon, path, cb){
	var viewTemp = rootPath+'/template/singleController/viewIndex.ejs';
	var objEJS = {
		controllerName:objCreateCon.controllerName
	}	
	var txtData = fs.readFileSync(viewTemp, 'utf-8');
	var txt = ejs.render(txtData, objEJS);
	
	var viewFolder = path + viewsPath+"/"+objCreateCon.controllerName;
	fs.mkdir(viewFolder, function(err){
		if(err && err.code != "EEXIST"){
			logDetail('["'+objCreateCon.controllerName+'"]folder has been created');
			cb(true);
			return;
		}
		var fileIndex = viewFolder+"/index.html";
		fs.writeFile(fileIndex, txt, function(err) {
			if(err) {
				logDetail(err);
				cb(true);
				return;
			}
			logDetail('create view of controller : '+objCreateCon.controllerName +' completed.')
			cb(false)
		});	
	});
}

var createControllerFile = function(objCreateCon, path, cb){
	var tempConFile = rootPath+'/template/singleController/tempController.ejs';	
	var objEJS = {
		controllerName:objCreateCon.controllerName,
		auth:objCreateCon.auth
	}
	
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	var txt = ejs.render(txtData, objEJS);
	var fileCont = path+contPath+"/"+utils.titleFormatName(objCreateCon.controllerName)+"Controller.js";
	fs.writeFile(fileCont, txt, function(err) {
		if(err) {
			logDetail(err);
			cb(true);
			return;
		}
		logDetail('create controller '+objCreateCon.controllerName +' completed.')
		cb(false)
	});	
}

var createViewAndControllerFile = function(path, objCreateCon, cb){
	createControllerFile(objCreateCon, path, function(err){
		if(err){
			cb(true);
			return
		}
		createView(objCreateCon, path, function(err){
			if(err){
				cb(true);
				return;
			}
			cb(false);
		});
	});
}

var genController = function(objCreateCon, cb){
	var cmdPath = process.cwd();
	utils.checkPath(cmdPath, contPath, function(err, path){
		if(err){
			logDetail('connot found folder controller');
			return;
		}
		createViewAndControllerFile(path, objCreateCon, function(err){
			if(err){
				cb(true);
				return;
			}
			cb(false);
		});
	});
}

var createController = {
	name:"create-controller",
	opt:{
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
			genController(objCreateCon, (err) => {
				if(err){
					logDetail("create controller '"+controllerName+ "' fails");
					cb();
					return;
				}
				logDetail("create controller '"+controllerName+ "' completed");
				cb();
			});
		}
	},
	init: function(listCommand){
		listCommand[this.name] = this.opt;
	}
}

module.exports = createController;