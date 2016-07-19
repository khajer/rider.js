const readline = require('readline');
const fs = require('fs');
const ejs = require('ejs');

const utils = require('./utils.js');

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
		rl.question('field type(String/Date):', (answer) => {
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

var genFileModel = function(model, p, cb){
	//gen txt
	model.titleName = utils.titleFormatName(model.modelName);
	var tempConFile = __dirname+'/templateFile/tempModel.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8'); 
	txt = ejs.render(txtData, {model:model});

	var createFile = p+modelPath+"/"+model.modelName.toLowerCase()+".js";
	console.log('create file:'+modelPath+"/"+model.modelName.toLowerCase()+".json")
	fs.writeFile(createFile, txt, function(err) {
		cb(err);
	});
}

var CreateModel = {
	model:{},
	beginPrompt: function(modelName, cb){
		model.fields = [];
		model.modelName = modelName;
		askField(function(){
			var cmdPath = process.cwd();
			utils.checkPath(cmdPath, modelPath, function(err, p){
				if(err){
					console.log('connot found folder models');
					return;
				}

				genFileModel(model, p, function(err){
					cb(err);
				})
			});
		});
	}
}
module.exports = CreateModel;
