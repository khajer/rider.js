#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

var commandList = [
	"create-app",
	"create-model"
];

var printHelp = function(){
	var txtHelp = "";
	var h = '  ';
	var t = '    ';
	txtHelp += "\n"+h+"Usage : rider [command]"
		+"\n\n"
		+h+"Commands: "+"\n\n"
		+t+"create-app [appName]"+"\t"+"create new app"+"\n"
		// +t+"create-model [modelName]"+"\t"+"create new Data Model"+"\n"
		// +t+"gen-model [modelName]"+"\t"+"generate controller Data Model"+"\n"
		+"";
	console.log(txtHelp);

}
var parseParam = function(params, cb){
	// console.log(params);
	if(params.length < 3){
		return cb(true, null, null);
	}
	cb(null, params[2], params[3]);
}	

var checkCommand = function(cmd){
	var foundCmd = false;
	commandList.forEach(function(command){
		if(cmd == command){
			foundCmd = true;
			return;
		}
	});
	return !foundCmd;
}

var copyFile = function(source, target, cb){
	var cbCalled = false;
	var rd = fs.createReadStream(source);
	rd.on("error", function(err) { done(err); });
	
	var wr = fs.createWriteStream(target);
	wr.on("error", function(err) { done(err); });
	wr.on("close", function(ex) { done(); });
	rd.pipe(wr);
	function done(err) {
		if (!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
}

var copyPrototype = function(projectName, cb){
	console.log('> initial prototype');
	console.log('> read prototype file');

	fs.realpath(__dirname, function(err, p){
		if(err){
			console.log('error');
			return;
		}
		console.log(p);

	});
	var p = __dirname + '/prototype';
	var cmdPath = process.cwd();
	// console.log("lib path: "+p);
	// console.log("command path: "+cmdPath);

	//create folder project name
	console.log('initial project : '+projectName);
	var targetPath = cmdPath+"/"+projectName;

	fs.mkdir(targetPath,function(e){
		if(!e || (e && e.code === 'EEXIST')){
			//copy index.js (main file)
			var srcFile = p+'/index.js';
			var desFile = targetPath+'/index.js';
			// console.log('copy file from: '+srcFile+', to:'+desFile);
			copyFile(srcFile, desFile, function(err){
				if(err){
					console.log(err);
					cb(true);
				}

				//config project file (package.json)
				var packageFile = p+'/package.json';
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
					fs.writeFile(packageFileTar, txt, function(err) {
						if(err) {
							return console.log(err);
						}
						cb(false);	
					});
				});				
			});			
		}else{
			console.log(e);
			cb(true);
		}
	});

}
var runCommand = function(opt, param, cb){
	if(opt == "create-app"){
		copyPrototype(param, function(err){
			cb();		
		});
	}	
}

var main = function(){
	console.log(">> Rider ... ");
	parseParam(process.argv, function(err, opt, params){
		if(err){
			printHelp();
			return;
		}
		if(opt == "-h" || opt == "--help"){
			printHelp();
			return;
		}
		if(checkCommand(opt)){
			printHelp();
			return;	
		}
		// console.log('cmd: '+opt +", name: "+params);
		runCommand(opt, params, function(){
			process.exit(0);	
		});
	});
}
// -- call main function --
main();


