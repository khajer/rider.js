const utils = require('./utils.js')

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

var contPath = '/app/controllers';
const viewsPath = '/app/views';

module.exports = {
	generateLogin: function(cb){		
		createControllerFile(function(err){
			if(err){
				cb(true);
				return;
			}
			//create view file 
			createViewFile(function(err){
				cb(err);
			});
		});		
	}
}

var createControllerFile = function(cb){
	var tempConFile = rootPath+'/template/login/controller.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');
	// find project controller path
	var cmdPath = process.cwd();
	utils.checkPath(cmdPath, contPath, function(err, path){
		if(err){	
			logDetail('connot found folder controller');
			cb(true);
			return;
		}
		//write file
		var targetFile = path+contPath+"/"+utils.titleFormatName(controllerName)+"Controller.js";
		fs.writeFile(targetFile, txtData, function(err){
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

var createViewFile = function(cb){
	var tempConFile = rootPath+'/template/login/login.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8');

	logDetail('create login view controller folder');
	var viewFolder = path + viewsPath+"/login";
	fs.mkdirSync(viewFolder);

	logDetail('create file view');
	var targetFile = viewFolder+"/index.html";
	utils.checkPath(cmdPath, viewsPath, function(err, path){
		fs.writeFile(targetFile, txtData, function(err){
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