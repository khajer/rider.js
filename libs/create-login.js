const utils = require('./utils.js')
var fs = require('fs');

var prompt = require('prompt');
var colors = require("colors/safe")

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var contPath = '/app/controllers';
const viewsPath = '/app/views';

var logDetail = (str) => {
	console.log("    - "+str);
}

prompt.start();
prompt.message = colors.rainbow(" >> ");

var path = "";

module.exports = {
	generateLogin: function(cb) {		
		createControllerFile((err) => {
			if(err){
				cb(true);
				return;
			}
			//create view file 
			createViewFile((err) =>{
				if(err){
					cb(true);
					return;
				}
				changeAuthHelper((err) => {
					if(err){
						cb(true);
						return;
					}
					cb(false);
				});
			});
		});		
	}
}

var createControllerFile = (cb) => {
	var controllerName = "Login";
	var tempConFile = rootPath+'/template/login/controller.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	var cmdPath = process.cwd();
	utils.checkPath(cmdPath, contPath, (err, pathChk) => {
		if(err){	
			logDetail('connot found folder controller');
			cb(true);
			return;
		}
		path = pathChk;
		//write file
		var targetFile = path+contPath+"/"+utils.titleFormatName(controllerName)+"Controller.js";
		fs.writeFile(targetFile, txtData, (err) =>{
			if(err){
				logDetail(err);
				cb(true);
			}else{
				logDetail('create file login controller completed');
				cb(false);
			}			
		});	
	});	
}

var createViewFile = (cb) => {
	var tempConFile = rootPath+'/template/login/login.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');

	logDetail('create login view controller folder');
	var viewFolder = path + viewsPath+"/login";
	// fs.mkdirSync(viewFolder);
	fs.mkdir(viewFolder, function(err){
		if(err && err.code != "EEXIST"){
			logDetail(err);
		}
		logDetail('create file view');
		var targetFile = viewFolder+"/index.html";
		fs.writeFile(targetFile, txtData, (err) => {
			if(err){
				logDetail(err);
				cb(true);
			}else{
				logDetail('create file login controller completed');
				cb(false);
			}
		});	
	});
}

var changeAuthHelper = (cb) => {	
	var schemaOverride = {
		properties:{
			confirmOverride:{
				message:'are you want redirect to login when not login (Y/N)'
			}
		}
	}
	
	prompt.get([schemaOverride], function(err, result){
		if(result.confirmOverride.toLowerCase()=="y"){
			var txt = `module.exports = {
	checkAuth: function(req, res, next){
		if(req.cookies == undefined || req.cookies.logined == undefined || req.cookies.logined == false){
			res.redirect("/login/index");
			return;
		}
		next();		
	}	
}`;
			var authFile = path+'/app/helpers/auth.js';
			fs.writeFile(authFile, txt, (err) => {
				if(err){
					cb(true);
					return;
				}
				cb(false);
			})
		}else{
			cb(false);
		}
	});
}