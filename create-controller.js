const fs = require('fs')
const contPath = '/app/controllers';
const viewsPath = '/app/views';

var checkPath = function(path, cb){
	var finalPath = path+contPath;
	fs.stat(finalPath, function(err, stats) {
		cntLoopPath += 1;
		if(err){
			if(cntLoopPath > 5){
				cb(true, path);
				return;
			}

			var p = (path).split('/');
			path = p.slice(0, p.length-1).join("/")
			checkPath(path, cb);
			return;
		}
		if (stats.isDirectory()) {
			cb(false, path);
		}
	});
}
var getTemplateCon = function(controllerName){
	var txt = `
var controller = {
	name: '`+controllerName+`',
	init:function(app){
		app.get('/`+controllerName+`/index', function (req, res) {
			var paths = __dirname.split('/');
			var path = paths.slice(0, paths.length-1).join('/');
			var indexFilePath = path+"/views/`+controllerName+`/index.html";
			res.sendFile(indexFilePath);
		});
	},
};
module.exports = controller;`
	;
	return txt;
}

var templateIndexFile = function(controllerName){
	var txt = `<html>
	<body>
		<h1>`+controllerName+`</h1>
	<body/>
</html>	
`
	return txt;
}

var createViewAndControllerFile = function(path, controllerName, cb){
	// create views folder
	var viewFolder = path + viewsPath+"/"+controllerName;
	console.log('create view controller folder');
	fs.mkdirSync(viewFolder);
	var txtIndex = templateIndexFile(controllerName);
	
	var fileIndex = viewFolder+"/index.html";
	fs.writeFile(fileIndex, txtIndex, function(err){
		if(err){
			cb(true);
			return;
		}
		var createFile = path+contPath+"/"+controllerName+"Controller.js";
		console.log('create file:'+contPath+"/"+controllerName+"Controller.js");

		var txt = getTemplateCon(controllerName);
		fs.writeFile(createFile, txt, function(err) {
			if(err) {
				console.log(err);
				cb(true);
				return;
			}
			cb(false)
		});
	});
}

var createController = {
	genController: function(controllerName, cb){
		cntLoopPath = 0;
		var cmdPath = process.cwd();
		checkPath(cmdPath, function(err, path){
			if(err){
				console.log('connot found folder controller');
				return;
			}
			createViewAndControllerFile(path, controllerName, function(err){
				if(err){
					return cb(true);
					return;
				}
				cb(false);
			});
		});
	}
}

module.exports = createController;