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
		if(err){
			logDetail('["'+objCreateCon.controllerName+'"]folder has been created');
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
		authText:""
	}
	if(objCreateCon.auth == true){
		objEJS.authText = "auth.checkAuth,";
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

var createController = {
	genController: function(objCreateCon, cb){
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
}

module.exports = createController;