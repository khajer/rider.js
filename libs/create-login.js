const utils = require('./utils.js')
var fs = require('fs');

var inquirer = require('inquirer');

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var contPath = '/app/controllers';
const viewsPath = '/app/views';

var logDetail = (str) => {
	console.log("    - "+str);
}

var path = "";

var generateLogin = (cb) =>{
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
module.exports = {
	name:"create-login",
	opt:{
		name:"create-login", 
		params:'',
		options:"",
		desc: 'create simple and genenate login/register',
		runCommand:function(params, cb) {
			generateLogin((err) => {
				if(err){
					logDetail('generate login fails')
					cb(); 
					return;
				}
				logDetail('generate login success');
				cb();
			});		
		}
	},
	init: function(listCommand){
		listCommand[this.name] = this.opt;
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
	
	fs.mkdir(viewFolder, function(err){
		if(err && err.code != "EEXIST"){
			logDetail(err);
			cb(true);
			return;
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
	var questions = [{
		type: 'confirm',
		name: 'redirectOveride',
		message: 'are you want redirect to login when not login ?',
		default: false
	}];

	inquirer.prompt(questions).then(function (answers) {
		if(answers.redirectOveride == true){
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