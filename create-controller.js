const fs = require('fs')
const contPath = '/app/controllers';

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
	return `
		var controllerName = "`+controllerName+`";
		var controller = {
			name: controllerName,
			init:function(app){
				app.get('/'+controllerName+'/index', function (req, res) {
					res.send('controler name:'+controllerName);
				});
			},
		};
		module.exports = controller;
	`;	
}
createController = {
	genController: function(controllerName, cb){
		var txt = getTemplateCon(controllerName);

		cntLoopPath = 0;
		var cmdPath = process.cwd();
		checkPath(cmdPath, function(err, p){
			if(err){
				console.log('connot found folder models');
				return;
			}
			var createFile = p+contPath+"/"+controllerName+".js";
			console.log('create file:'+contPath+"/"+controllerName+".js");
			fs.writeFile(createFile, txt, function(err) {
				if(err) {
					console.log(err);
					cb(true);
					return;
				}
				cb(false);	
			});
		});
	}
}

module.exports = createController;