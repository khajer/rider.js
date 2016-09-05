const fs = require('fs');
const ejs = require('ejs');
const utils = require('./utils.js');

var inquirer = require('inquirer');

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var model = {};
const modelPath = '/app/models';

var logDetail = (str) => {
	console.log("    - "+str);
}

var askField = (model, cb) => {
	var questions = [{
		type: 'input',
		name: 'fieldName',
		message: 'What\'s your field name?',
	},{
		type: 'list',
		name: 'fieldType',
		message: 'What kind of field name?',
		choices: ['String', 'Number', 'Date'],
		// filter: function (val) {
		// 	return val.toLowerCase();
		// }
	},{
		type: 'confirm',
		name: 'addMore',
		message: 'insert More ?',
		default: false
	}];

	inquirer.prompt(questions).then(function (answers) {
		console.log(answers);
		model.fields.push({
			fieldName:answers.fieldName,
			typeName:answers.fieldType
		});

		if(answers.addMore == true)
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
	var txt = ejs.render(txtData, {model:model});

	var createFile = p+modelPath+"/"+model.modelName.toLowerCase()+".js";
	logDetail('create file:'+modelPath+"/"+model.modelName.toLowerCase()+".json")
	fs.writeFile(createFile, txt,  (err)  => {
		cb(err);
	});
}
var init = (modelName, cb) =>{
	model.fields = [];
	model.modelName = modelName;
	var cmdPath = process.cwd();
	utils.checkPath(cmdPath, modelPath, (err, p)  => {
		if(err){
			logDetail('connot found folder models');
			return;
		}
		askField(model, function(){
			// console.dir(model.fields);
			genFileModel(p, () => {
				cb(false);
			});
		});
	});
}

var CreateModel = {
	name:"create-model",
	opt:{
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
			init(modelName, (err) => {
				logDetail("create model '"+modelName+ "' completed");
				cb();
			});
		}
	},
	init: function(listCommand){
		listCommand[this.name] = this.opt;
	}
}
module.exports = CreateModel;
