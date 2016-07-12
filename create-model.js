// var inquirer = require('inquirer');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var model = {};

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
CreateModel = {
	model:{},
	beginPrompt: function(modelName, cb){
		model.fields = [];
		model.modelName = modelName;
		
		askField(function(){
			console.log(model)
		});
	}
}
module.exports = CreateModel;
