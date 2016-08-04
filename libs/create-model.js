const fs = require('fs');
const ejs = require('ejs');
var prompt = require('prompt');
const utils = require('./utils.js');
var colors = require("colors/safe")

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var model = {};
const modelPath = '/app/models';

var logDetail = (str) => {
	console.log("    - "+str);
}

var schemaFieldName = {
	properties:{
		fieldName:{
			message:'field name'
		}
	}
}
var schemaFieldType = {
	properties:{
		fieldType:{
			message:'field string (String/Date)'
		}
	}	
}
var schemaFieldMore = {
	properties:{
		moreInsert:{
			message:'insert more ?'
		}
	}	
}

prompt.start();
prompt.message = colors.rainbow(" >> ");

var askField = (model, cb) => {
	prompt.get([schemaFieldName, schemaFieldType, schemaFieldMore], function(err, result){
		//contain field
		model.fields.push({
			fieldName:result.fieldName,
			typeName:result.fieldType
		});
		if(result.moreInsert.toLowerCase() == "y")
			askField(model, cb);
		else
			cb(false);
	});
}

var genFileModel = (p, cb)  => {
	//gen txt
	model.titleName = utils.titleFormatName(model.modelName);
	var tempConFile = rootPath+'/template/model/tempModel.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8'); 
	txt = ejs.render(txtData, {model:model});

	var createFile = p+modelPath+"/"+model.modelName.toLowerCase()+".js";
	logDetail('create file:'+modelPath+"/"+model.modelName.toLowerCase()+".json")
	fs.writeFile(createFile, txt,  (err)  => {
		cb(err);
	});
}

var CreateModel = {
	model:{},
	init: function(modelName, cb){
		model.fields = [];
		model.modelName = modelName;
		var cmdPath = process.cwd();

		utils.checkPath(cmdPath, modelPath, (err, p)  => {
			if(err){
				logDetail('connot found folder models');
				return;
			}
			askField(model, function(){
				console.dir(model.fields);
				genFileModel(p, () => {
					cb(false);
				});
			});
		});
	}
}
module.exports = CreateModel;
