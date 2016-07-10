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
		+t+"create-model [modelName]"+"\t"+"create new Data Model"+"\n"
		+t+"gen-model [modelName]"+"\t"+"generate controller Data Model"+"\n"
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

var copyPrototype = function(){
	console.log('> initial prototype');
	console.log('>read prototype file');

	fs.realpath(__dirname, function(err, p){
		if(err){
			console.log('error');
			return;
		}
		console.log(p);
		

	});

	console.log("current directory: "+__dirname);



}
var runCommand = function(opt, param, cb){
	if(opt == "create-app"){
		copyPrototype();
	}
	cb();
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

main();


