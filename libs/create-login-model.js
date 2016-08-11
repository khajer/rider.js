const utils = require('./utils.js')
var fs = require('fs');

var inquirer = require('inquirer');

var logDetail = (str) => {
	console.log("    - "+str);
}
var model = {};
var path = "";

var getEnv = (cb) =>{
	var cmdPath = process.cwd();
	var confPath = '/config';

	utils.checkPath(cmdPath, confPath, (err, pathChk) => {
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
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < totalLength; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
var autoGenerateKeyPhase = (cb)=>{

	var keyphase = randString(8);
	var authConf = path+"/config/keyphase.json";
	var txt = JSON.stringify({keyphase:keyphase}, 0, 4);
	fs.writeFile(authConf, txt, (err) => {
		logDetail("generate keyphase ["+keyphase+"]")
		if(err){
			cb(true);
			return;
		}
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
		message: 'What kind of field name?',
		choices: ['String', 'Date'],
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

var askModelLoginName = (cb) =>{
	var questions = [{
		type: 'input',
		name: 'modelName',
		message: 'What\'s your login model name?',
	},{
		type: 'input',
		name: 'fieldUserName',
		message: 'What\'s field of user login (ex: username/email) ?',
	}];
	inquirer.prompt(questions).then(function (answers) {
		// initial model name
		model.modelName = answers.modelName;
		model.fields.push({
			fieldName:answers.fieldUserName,
			typeName:"String"
		});
		model.fields.push({
			fieldName:"password",
			typeName:"String"
		});	
		askMore( (err)=>{
			if(err){
				cb(true);
				return;
			}
		});
	});
}

var genrateModelControllerAndView = function(cb){
	console.dir(model);

}


var writeModelFile = (cb) => {
	cb(false);
}

var writeControllerAndView = (cb) => {
	cb(false);
}

var initial = (err) => {	
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
				autoGenerateKeyPhase( (err) =>{
					if(err){
						cb(true);
						return;
					}
					genrateModelControllerAndView( (err) =>{
						if(err){
							cb(true);
							return;
						}
						cb(false)
					});
					
				});		
			}
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