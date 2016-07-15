const fs = require('fs');

const viewsPath = '/app/views';
const ejs = require('ejs');

const utils = require('./utils.js')

var contPath = '/app/controllers';

var getTemplateCon = function(controllerName, cb){
	var tempConFile = __dirname+'/templateFile/tempController.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	return ejs.render(txtData, {controllerName:controllerName});
}

var templateIndexFile = function(controllerName){
	var tempConFile = __dirname+'/templateFile/viewIndex.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	return ejs.render(txtData, {controllerName:controllerName});
}

var createViewAndControllerFile = function(path, controllerName, cb){
	// create views folder
	var viewFolder = path + viewsPath+"/"+controllerName;
	console.log('create view controller folder');
	fs.mkdirSync(viewFolder);
	var txtIndex = templateIndexFile(controllerName);
	
	var fileIndex = viewFolder+"/index.html";
	fs.writeFile(fileIndex, txtIndex, function(err){
		if(err){
			cb(true);
			return;
		}
		var createFile = path+contPath+"/"+utils.titleFormatName(controllerName)+"Controller.js";
		console.log('create file:'+contPath+"/"+utils.titleFormatName(controllerName)+"Controller.js");

		var txt = getTemplateCon(controllerName);
		fs.writeFile(createFile, txt, function(err) {
			if(err) {
				console.log(err);
				cb(true);
				return;
			}
			cb(false)
		});	
	});
}

var createController = {
	genController: function(controllerName, cb){
		cntLoopPath = 0;
		var cmdPath = process.cwd();
		utils.checkPath(cmdPath, contPath, function(err, path){
			if(err){
				console.log('connot found folder controller');
				return;
			}
			createViewAndControllerFile(path, controllerName, function(err){
				if(err){
					return cb(true);
					return;
				}
				cb(false);
			});
		});
	}
}

module.exports = createController;