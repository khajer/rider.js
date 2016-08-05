const utils = require('./utils.js')
var fs = require('fs');

var prompt = require('prompt');
var colors = require("colors/safe")

prompt.start();
prompt.message = colors.rainbow(" >> ");

var logDetail = (str) => {
	console.log("    - "+str);
}
var dataModelField = [];
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
var writeFileKeyphase = (keyphase, cb)=>{
	var authConf = path+"/config/keyphase.json";
	var txt = JSON.stringify({keyphase:keyphase}, 0, 4);
	fs.writeFile(authConf, txt, (err) => {
		if(err){
			cb(true);
			return;
		}
		cb(false)
	});
}

var addmoreField = (cb) =>{
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
	prompt.get([schemaFieldName, schemaFieldType, schemaFieldMore], function(err, result){
		dataModelField.push({
			fieldName: result.fieldName,
			fieldType: result.fieldType
		});

		if(result.moreInsert.toLowerCase() == "y")
			addmoreField(cb);
		else
			cb(false);
	});
}

var askField = (cb) => {
	var schemaUser = {
		properties:{
			username:{
				message:'username login field(username)'
			},

		}
	}
	var schemaKeyphase = {
		properties:{
			keyphase:{
				message:'key for encoding password'
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
	prompt.get([schemaUser, schemaKeyphase, schemaFieldMore], function(err, result){
		console.dir(result);
		dataModelField.push({
			fieldName: result.username,
			fieldType: "String"
		});
		dataModelField.push({
			fieldName: 'password',
			fieldType: "String"
		});

		if(result.moreInsert.toLowerCase() == "y"){
			addmoreField( (err)=>{
				if(err){
					cb(true);
					return;
				}
				writeFileKeyphase(result.keyphase, (err) => {
					if(err){
						cb(true);
						return;
					}
					logDetail("create 'keyphase' file (config/keyphase.json) completed.");
					cb(false);	
				});
			});
		}else{
			writeFileKeyphase(result.keyphase, (err) => {
				if(err){
					cb(true);
					return;
				}
				logDetail("create 'keyphase' file (config/keyphase.json) completed.");
				cb(false);	
			});
		}		
	});	
}

var writeModelFile = (cb) => {
	cb(false);
}

var writeControllerAndView = (cb) => {
	cb(false);
}


module.exports = {
	init: function(cb){
		getEnv((err)=>{
			if(err){
				cb(err);
				return;
			}
			askField((err)=>{
				if(err){
					cb(err);
					return;
				}
				writeModelFile( (err) => {
					if(err){
						cb(err);
						return;
					}
					writeControllerAndView( (err) => {
						if(err){
							cb(err);
							return;
						}
						cb(false);	
					})
				});
			});
		});			
	}
}