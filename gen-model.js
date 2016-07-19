const fs = require('fs')
const utils = require('./utils.js')
var ejs = require('ejs')

var contPath = '/app/controllers';
var modelPath = '/app/models';
var viewsPath = '/app/views';

var GenModel = {
	generateControllerModel: function(modelName, cb){
		genMainControllerFile(modelName, function(err){
			if(err){
				cb(true);
				return;
			}
			genViewFile(modelName, function(err){
				cb(err);	
			});	
		});
	}
}

var genMainControllerFile = function(modelName, cb){
	var tempConFile = __dirname+'/templateFile/genModel/model-controller.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	var txt = ejs.render(txtData, {modelName:modelName, titleName:utils.titleFormatName(modelName)});

	utils.checkPath(process.cwd(), contPath, function(err, path){
		if(err){
			cb(true);
			return;
		}
		var fileCon = path+contPath+"/"+utils.titleFormatName(modelName)+"Controller.js";
		console.log('create file:'+contPath+"/"+utils.titleFormatName(modelName)+"Controller.js");
		fs.writeFile(fileCon, txt, function(err) {
			if(err) {
				console.log(err);
				cb(true);
				return;
			}
			cb(false)
		});	
	});
	
}
var genViewFile = function(modelName, cb){
	
	utils.checkPath(process.cwd(), modelPath, function(err, path){

		var fieldModel = [];
		var modelFile = path+modelPath+"/"+utils.titleFormatName(modelName)+".js";
		// console.log(path);
		var modelSchema = require(modelFile);
		modelSchema.schema.eachPath(function(path) {
			if(path.substring(0, 1) != "_"){
				fieldModel.push(path);
			}
		});
		// create folder
		var viewFolder = path + viewsPath+"/"+modelName;
		fs.mkdirSync(viewFolder);

		var objParam = {
			modelName:modelName, 
			titleName:utils.titleFormatName(modelName), 
			fieldModel:fieldModel
		}
		console.log('create file : '+viewsPath+"/"+modelName+"/index.html");

		createFileTemplate(
			__dirname+'/templateFile/genModel/index-view.ejs', 
			objParam, 
			viewFolder+"/index.html"
		);
		console.log('create file : '+viewsPath+"/"+modelName+"/insert.html");
		createFileTemplate(
			__dirname+'/templateFile/genModel/insert-view.ejs', 
			objParam, 
			viewFolder+"/insert.html"
		);
		console.log('create file : '+viewsPath+"/"+modelName+"/update.html");
		createFileTemplate(
			__dirname+'/templateFile/genModel/update-view.ejs', 
			objParam, 
			viewFolder+"/update.html"
		);

		cb();
	});
}
var createFileTemplate = function(fileTmp, objParam, writeFile){
	var txtData = fs.readFileSync(fileTmp, 'utf-8');
	var txt = ejs.render(txtData, objParam);
	fs.writeFileSync(writeFile, txt);
}

module.exports = GenModel;