const fs = require('fs');
const ejs = require('ejs');
const utils = require('./utils.js');

var inquirer = require('inquirer');

var logDetail = (str) => {
	console.log("    - "+str);
}
var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

const modelPath = '/app/models';
const contPath = '/app/controllers';
const viewsPath = '/app/views';

var model = {};
var path = "";

// begin method
var getEnv = (cb) =>{
	utils.checkPath(process.cwd(), "/config", (err, pathChk) => {
		if(err){
			cb(true);
			return;
		}
		path = pathChk;
		cb(false)
	});	
}

function randString(totalLength){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

	for( var i=0; i < totalLength; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
var autoGenerateKeyPhase = (cb)=>{
	var keyphase = randString(8);
	var authConf = path+"/config/keyphase.json";
	var txt = JSON.stringify({keyphase:keyphase}, 0, 4);
	fs.writeFile(authConf, txt, (err) => {
		if(err){
			logDetail("generate keyphase ["+keyphase+"] fails.")
			logDetail(err);
			cb(true);
			return;
		}
		logDetail("generate keyphase ["+keyphase+"] completed.")
		cb(false)
	});
}

var askMore = (model, cb) => {
	var questions = [{
		type: 'input',
		name: 'fieldName',
		message: 'What\'s your field name?',
	},{
		type: 'list',
		name: 'fieldType',
		message: 'What Schema Type of field name?',
		choices: ['String', 'Date']
	},{
		type: 'confirm',
		name: 'addMore',
		message: 'insert More ?',
		default: false
	}];

	inquirer.prompt(questions).then(function (answers) {
		model.fields.push({
			fieldName:answers.fieldName,
			typeName:answers.fieldType
		});
		if(answers.addMore == true)
			askMore(model, cb);
		else
			cb(false);		
	});
}

var askModelLoginName = (cb) =>{
	var questions = [{
		type: 'input',
		name: 'modelName',
		message: 'What\'s your login model name?',
	},{
		type: 'confirm',
		name: 'addMore',
		message: 'insert More ?',
		default: false
	}];
	inquirer.prompt(questions).then(function (answers) {
		// initial model name
		model.modelName = answers.modelName;
		model.fields.push({
			fieldName:"username",
			typeName:"String"
		});
		model.fields.push({
			fieldName:"password",
			typeName:"String"
		});	
		model.fields.push({
			fieldName:"user_role",
			typeName:"Number"
		});	
		if(answers.addMore == true)
			askMore(model, cb);
		else
			cb(false);	
	});
}

var generateController = (cb) =>{
	model.titleModelName = utils.titleFormatName(model.modelName);

	var controllerName = "Login";
	var tempConFile = rootPath+'/template/login/model-controller.ejs';	
	
	var txtData = fs.readFileSync(tempConFile, 'utf-8'); 
	var txt = ejs.render(txtData, {model:model});

	var targetFile = path+contPath+"/"+utils.titleFormatName(controllerName)+"Controller.js";
	fs.writeFile(targetFile, txt, (err) =>{
		if(err){
			logDetail(err);
			cb(true);
		}else{
			cb(false);
		}			
	});	
}

// create 2 file view login/register
var generateView = (cb) => {

	logDetail('create login view controller folder');
	var viewFolder = path + viewsPath+"/login";
	
	// create folder /login
	fs.mkdir(viewFolder, function(err){
		if(err && err.code != "EEXIST"){
			logDetail(err);
			cb(true);
			return;
		}

		var tempLoginFile = rootPath+'/template/login/login.ejs';	
		var txtData = fs.readFileSync(tempLoginFile, 'utf-8');

		logDetail('create file login view (index.html)');
		var targetFile = viewFolder+"/index.html";
		fs.writeFile(targetFile, txtData, (err) => {
			if(err){
				logDetail(err);
				cb(true);
				return;
			}

			logDetail('create file register view (register.html)');
			var targetFile = viewFolder+"/register.html";
			var tempLoginFile = rootPath+'/template/login/register.ejs';	
			var txtData = fs.readFileSync(tempLoginFile, 'utf-8');
			var txt = ejs.render(txtData, {fieldModel:model.fields});
			fs.writeFile(targetFile, txt, (err) => {
				if(err){
					logDetail(err);
					cb(true);
					return;
				}	
				logDetail('create register file completed');
				cb(false);

			});
		});	
	});
}


var generateControllerAndView = (cb) =>{
	generateController( (err)=>{
		if(err){
			cb(true);
			return;
		}
		logDetail("genrate controller file completed");
		generateView( (err)=>{
			if(err){
				cb(true);	
				return;
			}	
			cb(false);	
		});		
	});	
}

var generateModelControllerAndView = function(cb){
	createModelFile( (err)=>{
		if(err){
			cb(true);
			return;
		}
		logDetail("generate model file completed.")
		generateControllerAndView( (err)=>{
			if(err){
				cb(true);
				return;
			}	
			cb(false);
		});
	})
}

var createModelFile = (cb) =>{
	model.titleName = utils.titleFormatName(model.modelName);
	var tempConFile = rootPath+'/template/model/tempModel.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8'); 
	txt = ejs.render(txtData, {model:model});

	var createFile = path+modelPath+"/"+model.modelName.toLowerCase()+".js";
	logDetail('create file:'+modelPath+"/"+model.modelName.toLowerCase()+".json")
	fs.writeFile(createFile, txt,  (err)  => {
		cb(err);
	});	
}
	
var initial = function(cb) {	
	getEnv((err)=>{
		if(err){
			cb(err);
			return;
		}
		//initial value
		model.modelName = "";
		model.fields = [];
		askModelLoginName( (err)=>{
			if(err){
				cb(err);
				return;		
			}
			autoGenerateKeyPhase( (err) =>{
				if(err){
					cb(err);
					return;
				}
				generateModelControllerAndView( (err) =>{
					if(err){
						cb(true);
						return;
					}
					cb(false)
				});					
			});
		});		
	});	
}

module.exports = {
	name:"create-login-model",
	opt:{
		name:"create-login-model", 
		params:'',
		options:"-s",
		desc: 'create login with model and genenate login/register',
		runCommand:function(params, cb) {
			logDetail('create-login-model');
			initial((err) =>{
				cb(err);
			});
		}
	},
	init: function(listCommand){
		listCommand[this.name] = this.opt;
	}
}