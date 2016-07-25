var fs = require('fs');
var fsx = require('fs-extra');

var utils = require('./utils.js');

var logDetail = function(str){
	console.log("    -> "+str);
}

var CreatApp = {
	copyAllPrototypeFile:function(srcPath, targetPath, cb){
		fsx.copy(srcPath, targetPath, function (err) {
			if(err){
				cb(true)
				return;
			}
			cb(false)
		});	
	},
	initialConfigDB:function(projectName, cb){
		var targetPath = process.cwd()+'/'+projectName;
		var obj = {
			db_name:"",
			db_type:'mongo',
			host:"localhost",
			username: "",
			passwd: ""
		};
		var txt = JSON.stringify(obj, 0, 2);
		fs.writeFile(targetPath+'/config/db.json', txt, function(err) {
			if(err) {
				logDetail(err);
				cb(true);
				return;
			}
			logDetail('create file "config/db.json" completed.')
			cb(false);	
		});
	},
	modifyFilePackage:function(projectName, cb){
		
		var objFile = {
			"name": projectName,
			"version": "1.0.0",
			"description": "",
			"main": "index.js",
			"scripts": {
				"test": "echo \"Error: no test specified\" && exit 1"
			},
			"author": "",
			"license": "MIT",
			"dependencies": {
			"express": "^4.14.0",
			"mongoose":"^4.5.4",
			"body-parser": "^1.15.2",
			"cookie-parser": "^1.4.3",
			}
		};
		var txt	= JSON.stringify(objFile, null, 2);
		var targetPath = process.cwd()+'/'+projectName;
		var packageFileTar = targetPath+'/package.json';
		fs.writeFile(packageFileTar, txt, function(err) {
			if(err) {
				cb(true);
				return;
			}
			logDetail('modify files "package.json" completed.')
			cb(false);	
		});
	},
	copyPrototype:function(projectName, cb){
		fs.realpath(__dirname, function(err, p){
			if(err){
				logDetail('cannot get path');
				return;
			}
		});
		var libPath = __dirname + '/prototype';
		var cmdPath = process.cwd();

		//create folder project name
		logDetail('create project: "'+projectName+'" completed');
		var targetPath = cmdPath+"/"+projectName;

		//copy all temp file
		this.copyAllPrototypeFile(libPath, targetPath, function(err){
			if(err){
				logDetail('copy template files fails.')
				cb(true);
				return;
			}
			logDetail('copy template files completed.')
			
			//download jquery for normal function
			var urlJQuery = "https://code.jquery.com/jquery-3.1.0.min.js";
			utils.download(urlJQuery, process.cwd()+"/"+projectName+"/public/javascript/jquery-3.1.0.min.js", function(err){
				if(err){
					logDetail("cannot download jquery from ["+urlJQuery+"]");
					cb(false);
					return;
				}
				logDetail("download jquery : "+urlJQuery+" completed");
				cb(false);	
			});
			
		});
	}
}
module.exports = CreatApp;