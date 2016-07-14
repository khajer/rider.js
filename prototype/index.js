var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('it work.');
});

// load file controllers
var contPath = './app/controllers';
var contList = fs.readdirSync(contPath);
contList.forEach(function(item){
	var fileRequire = "./app/controllers/"+item;
	var filetype = item.substring( item.length -3 , item.length);
	if(filetype==".js"){
		require(fileRequire).init(app);		
	}
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

