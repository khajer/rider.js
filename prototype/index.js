const fs = require('fs')
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('it work.');
});

// add static folder
// app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));

// load file controllers
var contPath = './app/controllers';
var contList = fs.readdirSync(contPath);
contList.forEach(function(item){
	var fileRequire = contPath+"/"+item;
	var filetype = item.substring( item.length -3 , item.length);
	if(filetype==".js"){
		require(fileRequire).init(app);		
	}
});

//connect db
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
	//define schema
	var contPath = './app/models';
	var models = fs.readdirSync(contPath);
	models.forEach(function(item){
		var fileRequire = contPath+"/"+item;
		var filetype = item.substring( item.length -3 , item.length);
		if(filetype==".js"){
			require(fileRequire).init(app);		
		}
	});
});

// load config db file
var dbconfig = JSON.parse(fs.readdirSync("./config/db.json"));
var auth = "";
if(dbconfig.username != "" || dbconfig.username != undefined){
	auth = dbconfig.username+":"dbconfig.passwd+"@";
}
if(dbconfig.port != "" || dbconfig.port != undefined){
	dbconfig.host+":"dbconfig.port;
}
var urlDB = 'mongodb://'+auth+dbconfig.host+'/'+dbconfig.db_name; 
mongoose.connect(urlDB);


app.listen(3000, function () {
  console.log('app listening on port 3000!');
});

