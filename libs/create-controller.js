const fs = require('fs');

const viewsPath = '/app/views';
const ejs = require('ejs');

const utils = require('./utils.js')

var contPath = '/app/controllers';

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var logDetail = function(str){
	console.log("    > "+str);
}

var getTemplateCon = function(controllerName, cb){

	var tempConFile = rootPath+'/template/singleController/tempController.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	return ejs.render(txtData, {controllerName:controllerName});
}

var templateIndexFile = function(controllerName){
	var tempConFile = rootPath+'/template/singleController/viewIndex.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	return ejs.render(txtData, {controllerName:controllerName});
}

var createViewAndControllerFile = function(path, controllerName, cb){
	// create views folder
	var viewFolder = path + viewsPath+"/"+controllerName;
	logDetail('create view controller folder');
	fs.mkdirSync(viewFolder);
	var txtIndex = templateIndexFile(controllerName);
	
	var fileIndex = viewFolder+"/index.html";
	fs.writeFile(fileIndex, txtIndex, function(err){
		if(err){
			cb(true);
			return;
		}
		var createFile = path+contPath+"/"+utils.titleFormatName(controllerName)+"Controller.js";
		logDetail('create file:'+contPath+"/"+utils.titleFormatName(controllerName)+"Controller.js");

		var txt = getTemplateCon(controllerName);
		fs.writeFile(createFile, txt, function(err) {
			if(err) {
				logDetail(err);
				cb(true);
				return;
			}
			cb(false)
		});	
	});
}

var createController = {
	genController: function(controllerName, cb){
		var cmdPath = process.cwd();
		utils.checkPath(cmdPath, contPath, function(err, path){
			if(err){
				logDetail('connot found folder controller');
				return;
			}
			createViewAndControllerFile(path, controllerName, function(err){
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