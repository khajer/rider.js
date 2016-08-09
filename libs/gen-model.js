const fs = require('fs')
const utils = require('./utils.js')
var ejs = require('ejs')

var contPath = '/app/controllers';
var modelPath = '/app/models';
var viewsPath = '/app/views';

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var logDetail = (str) => {
	console.log("    - "+str);
}

var GenModel = {
	name: "gen-model-controller",
	opt:{
		name:"gen-model-controller", 
		params:'modelName',
		options:"-a",
		desc: 'auto generate controller with Data model[-a : with authen]',
		runCommand:function(params, cb) {
			var modelName = params[3];
			logDetail("generate controller with model: " + modelName)
			generateControllerModel(modelName, (err) => {
				if(err){
					logDetail("create controller '"+modelName+ "' fails");
					cb();
				}
				logDetail("generate model to controller '"+modelName+ "' completed");
				cb();
			});
		}
	},
	init: function(listCommand){
		listCommand[this.name] = this.opt;
	},	
}

var generateControllerModel = function(modelName, cb){
	genMainControllerFile(modelName, (err) => {
		if(err){
			cb(true);
			return;
		}
		genViewFile(modelName, (err) => {
			cb(err);	
		});	
	});
}

var genMainControllerFile = (modelName, cb) => {
	var tempConFile = rootPath+'/template/modelController/model-controller.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	var txt = ejs.render(txtData, {modelName:modelName, titleName:utils.titleFormatName(modelName)});

	utils.checkPath(process.cwd(), contPath, (err, path) => {
		if(err){
			cb(true);
			return;
		}
		var fileCon = path+contPath+"/"+utils.titleFormatName(modelName)+"Controller.js";
		console.log('create file:'+contPath+"/"+utils.titleFormatName(modelName)+"Controller.js");
		fs.writeFile(fileCon, txt, (err)  => {
			if(err) {
				console.log(err);
				cb(true);
				return;
			}
			cb(false)
		});	
	});
	
}
var genViewFile = (modelName, cb) => {
	
	utils.checkPath(process.cwd(), modelPath, (err, path) => {
		var fieldModel = [];
		var modelFile = path+modelPath+"/"+utils.titleFormatName(modelName)+".js";
		// console.log(path);
		var modelSchema = require(modelFile);
		modelSchema.schema.eachPath((path)  => {
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
			rootPath+'/template/modelController/index-view.ejs', 
			objParam, 
			viewFolder+"/index.html"
		);
		console.log('create file : '+viewsPath+"/"+modelName+"/insert.html");
		createFileTemplate(
			rootPath+'/template/modelController/insert-view.ejs', 
			objParam, 
			viewFolder+"/insert.html"
		);
		console.log('create file : '+viewsPath+"/"+modelName+"/update.html");
		createFileTemplate(
			rootPath+'/template/modelController/update-view.ejs', 
			objParam, 
			viewFolder+"/update.html"
		);

		cb();
	});
}
var createFileTemplate = (fileTmp, objParam, writeFile) => {
	var txtData = fs.readFileSync(fileTmp, 'utf-8');
	var txt = ejs.render(txtData, objParam);
	fs.writeFileSync(writeFile, txt);
}

module.exports = GenModel;