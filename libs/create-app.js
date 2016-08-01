var fs = require('fs');
var fsx = require('fs-extra');

var utils = require('./utils.js');

var ar = __dirname.split("/")
var rootPath = ar.splice(0, ar.length-1).join("/");

var exec = require('child_process').exec;

var logDetail = (str) => {
	console.log("    - "+str);
}

var CreateApp = {
	copyAllPrototypeFile:function(srcPath, targetPath, cb) {
		fsx.copy(srcPath, targetPath,  (err) =>{
			if(err){
				cb(true)
				return;
			}
			cb(false)
		});	
	},
	initialConfigDB:function(projectName, cb) {
		var targetPath = process.cwd()+'/'+projectName;
		var obj = {
			db_name:"",
			db_type:'mongo',
			host:"localhost",
			username: "",
			passwd: ""
		};
		var txt = JSON.stringify(obj, 0, 2);
		fs.writeFile(targetPath+'/config/db.json', txt, (err) =>{
			if(err) {
				logDetail(err);
				cb(true);
				return;
			}
			logDetail('create file "config/db.json" completed.')
			cb(false);	
		});
	},
	modifyFilePackage:function(projectName, cb) {
		
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
		fs.writeFile(packageFileTar, txt, (err) =>{
			if(err) {
				cb(true);
				return;
			}
			logDetail('modify files "package.json" completed.')
			cb(false);	
		});
	},
	copyPrototype:function(projectName, cb) {
		var libPath = rootPath + '/prototype';
		var cmdPath = process.cwd();

		//create folder project name
		logDetail('create project: "'+projectName+'" completed');
		var targetPath = cmdPath+"/"+projectName;

		//copy all temp file
		this.copyAllPrototypeFile(libPath, targetPath, (err) => {
			if(err){
				logDetail('copy template files fails.')
				cb(true);
				return;
			}
			logDetail('copy template files completed.')
			
			//download jquery 
			var urlJQuery = "https://code.jquery.com/jquery-3.1.0.min.js";
			utils.download(urlJQuery, process.cwd()+"/"+projectName+"/public/javascript/jquery-3.1.0.min.js", (err) => {
				if(err){
					logDetail("cannot download jquery from ["+urlJQuery+"]");
					cb(false);
					return;
				}
				logDetail("download jquery (javascript): "+urlJQuery+" completed");
				cb(false);	
			});
			
		});
	},
	automaticCallNpmInstall:function(projectName, cb) {
		logDetail("automatic npm install . . .");
		var cmd = "cd "+projectName +" && npm install";
		exec(cmd, (error, stdout, stderr) =>{
		// command output is in stdout
			if(error){
				cb(true);
				return;
			}
			logDetail("npm install completed");
			cb(false);
		});
	}
}
module.exports = CreateApp;