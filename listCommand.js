module.exports = function(listCmd){

	require('./libs/create-app.js').init(listCmd);
	require('./libs/create-model.js').init(listCmd);
	require('./libs/create-controller.js').init(listCmd);
	require('./libs/gen-model.js').init(listCmd);
	require('./libs/create-login.js').init(listCmd);
	require('./libs/create-login-model.js').init(listCmd);

	// setCommand("gen-rest-model", {
	// 	name:"gen-rest-model", 
	// 	params:'modelName',
	// 	options:"",
	// 	desc: 'auto generate controller REST API with Data model',
	// 	runCommand:function(params, cb) {
	// 		logDetail('gen-rest-model');
	// 		cb();
	// 	}
	// });

	// setCommand("create-login-model", {
	// 	name:"create-login-model", 
	// 	params:'',
	// 	options:"-s",
	// 	desc: 'create login with model and genenate login/register',
	// 	runCommand:function(params, cb) {
	// 		logDetail('create-login-model');
	// 		createLoginModel.init(()=>{
	// 			cb();	
	// 		})
			
	// 	}
	// });

	// setCommand("gen-fullmenu", {
	// 	name:"gen-fullmenu", 
	// 	params:'',
	// 	desc: 'create nav-bar/sidemenu/mainview/footer',
	// 	runCommand:function(params, cb) {
	// 		console.log('gen-fullmenu');
	// 		cb();
	// 	}
	// });

}