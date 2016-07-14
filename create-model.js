const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var model = {};

const modelPath = '/app/models';

var askField = function(cb){
	var ask = this.askField;
	rl.question('field name: ', (answer) => {
		var fieldName = answer;
		rl.question('field type:', (answer) => {
			var typeName = answer;
			
			model.fields.push({
				fieldName:fieldName,
				typeName:typeName
			});
			rl.question('insert more ? ', (answer) => {
				if(answer == 'Y' || answer == 'y'){
					askField(cb);
				}else{
					rl.close();	
					cb();
				}
			});
		});		
	});
}
var cntLoopPath = 0;
var checkPath = function(path, cb){
	var finalPath = path+modelPath;
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
var CreateModel = {
	model:{},

	beginPrompt: function(modelName, cb){
		model.fields = [];
		model.modelName = modelName;
		askField(function(){
			var txt = JSON.stringify(model, 0, 2);
			
			cntLoopPath = 0;
			var cmdPath = process.cwd();
			checkPath(cmdPath, function(err, p){
				if(err){
					console.log('connot found folder models');
					return;
				}
				var createFile = p+modelPath+"/"+modelName+".json";
				console.log('create file:'+modelPath+"/"+modelName+".json")
				fs.writeFile(createFile, txt, function(err) {
					if(err) {
						console.log(err);
						cb(true);
						return;
					}
					cb(false);	
				});
			});
		});
	}
}
module.exports = CreateModel;
