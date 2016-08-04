#!/usr/bin/env node
var listCommand = [];
require('./listCommand')(listCommand)

var logDetail = (str) => {
	console.log('  > '+str);
}

var printHelp = () => {
	var txtHelp = "";
	var h = '  ';
	var t = '    ';

	txtHelp += "\n"+h+"Usage : rider [command] \n";
	txtHelp += "\n"+h+"Command List : \n";
	var maxText = 0;
	
	if(listCommand == undefined){
		logDetail("not found help detail");
		return;
	}
	Object.keys(listCommand).forEach((keyName) => {
		var item = listCommand[keyName];
		if(maxText < item.name.length+item.params.length) 
			maxText = item.name.length+item.params.length+4;
	});
	
	var maxT = Math.ceil(maxText/4);

	Object.keys(listCommand).forEach((keyName) => {
		var item = listCommand[keyName];
		var x = (item.name.length+item.params.length+4)/4;
		x = Math.ceil(x);
		var space = '\t';
		for (var i = 0; i < maxT-x-1; i++) {
			space += '\t'; 
		}
		var txt = "";
		if(item.params.length > 0){
			space += '\t';
			txt = '\t'+item.name +" [" +item.params+"] " + space +item.desc+"\n";
		}else{

			txt = '\t'+item.name + space +item.desc+"\n";
		}		
		txtHelp +=txt;	
		txtHelp	+"\n";	
	});
	console.log(txtHelp);
	process.exit(0);
}

var parseParams = (params, cb) => {
	if(params.length < 3){
		return cb(true);
	}
	cb(false);
}	

var checkCommand = (cmd) => {
	var foundCmd = false;
	
	Object.keys(listCommand).forEach((keyName) => {
		if(keyName == cmd){
			foundCmd = true;
			return;
		}
	});	
	return !foundCmd;
}

var runCommand = (params, cb) => {
	var opt = params[2];
	var objRun = listCommand[opt];
	if(objRun != undefined && objRun != null){
		objRun.runCommand(params, cb);
	}
}

var main = () => {
	console.log(">> Rider ... ");
	var params = process.argv;

	parseParams(params, (err) => {
		if(err){
			printHelp();
			return;
		}
		var opt = params[2];
		if(opt == "-h" || opt == "--help"){
			printHelp();
			return;
		}				
		if(checkCommand(opt)){
			printHelp();
			return;	
		}
		runCommand(params, () => {
			process.exit(0);	
		});
	});	
}

// -- call main function --
main();


