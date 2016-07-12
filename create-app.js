var fs = require('fs');
var fsx = require('fs-extra');

var CreatApp = {
	copyAllPrototypeFile:function(srcPath, targetPath, cb){
		fsx.copy(srcPath, targetPath, function (err) {
			if(!err){
				cb(true)
			}
			cb(false)
		});	
	},
	initialConfigDB:function(projectName, cb){
		var targetPath = process.cwd()+'/'+projectName;
		var obj = {
			db_name:projectName,
			db_type:'postgres'
		};
		var txt = JSON.stringify(obj, 0, 2);
		fs.writeFile(targetPath+'/config/db.json', txt, function(err) {
			if(err) {
				console.log(err);
				cb(true);
				return;
			}
			cb(false);	
		});

	},
	modifyFilePackage:function(projectName, cb){
		var targetPath = process.cwd()+'/'+projectName;
		var packageFile = targetPath+'/package.json';
		fs.readFile(packageFile, 'utf8', function(err, data) {
			if (err){
				console.log(err);
				cb(true);
				return;
			}
			var objFile = JSON.parse(data);
			objFile.name = projectName;
			var txt	= JSON.stringify(objFile, null, 2);
			var packageFileTar = targetPath+'/package.json';
			fsx.outputFile(packageFileTar, txt, function(err) {
				if(err) {
					cb(true);
					return;
				}
				cb(false);	
			});
		});
	},
	copyPrototype:function(projectName, cb){
		console.log('> initial prototype');
		console.log('> read prototype file');

		fs.realpath(__dirname, function(err, p){
			if(err){
				console.log('error');
				return;
			}

		});
		var libPath = __dirname + '/prototype';
		var cmdPath = process.cwd();

		//create folder project name
		console.log('> create project: '+projectName);
		var targetPath = cmdPath+"/"+projectName;

		//copy all temp file
		this.copyAllPrototypeFile(libPath, targetPath, function(err){
			if(err){
				cb(true);
				return;
			}
			cb(false);
		});
	}
}
module.exports = CreatApp;