const readline = require('readline');
const fs = require('fs');
const ejs = require('ejs');

const utils = require('./utils.js');

var ar = __dirname.split("/");
var rootPath = ar.splice(0, ar.length-1).join("/");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var model = {};

const modelPath = '/app/models';

var askField = (cb) => {
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
				if(answer.toLowerCase() == 'y'){
					askField(cb);
				}else{
					rl.close();	
					cb();
				}
			});
		});		
	});
}

var genFileModel = (model, p, cb) => {
	//gen txt
	model.titleName = utils.titleFormatName(model.modelName);
	var tempConFile = rootPath+'/template/model/tempModel.ejs';
	var txtData = fs.readFileSync(tempConFile, 'utf-8'); 
	txt = ejs.render(txtData, {model:model});

	var createFile = p+modelPath+"/"+model.modelName.toLowerCase()+".js";
	console.log('create file:'+modelPath+"/"+model.modelName.toLowerCase()+".json")
	fs.writeFile(createFile, txt, (err) => {
		cb(err);
	});
}

var CreateModel = {
	model:{},
	beginPrompt: (modelName, cb) => {
		model.fields = [];
		model.modelName = modelName;
		askField(() => {
			var cmdPath = process.cwd();
			utils.checkPath(cmdPath, modelPath, (err, p) => {
				if(err){
					console.log('connot found folder models');
					return;
				}

				genFileModel(model, p, (err) => {
					cb(err);
				})
			});
		});
	}
}
module.exports = CreateModel;
