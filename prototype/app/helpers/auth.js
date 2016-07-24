module.exports = {
	checkAuth: function(req, res, next){
		if(req.cookies == undefined || req.cookies.logined == undefined || req.cookies.logined == false){
			res.send(403)
			return;
		}
		next();		
	}	
}