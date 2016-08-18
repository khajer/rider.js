var crypto = require('crypto');
var fs = require('fs');

module.exports = {
	checkAuth: function(req, res, next){
		if(req.cookies == undefined || req.cookies.logined == undefined || req.cookies.logined == false){
			res.send(403)
			return;
		}
		next();		
	},
	hashCode: function(pwdKey){
		var filePath = "../../config/keyphase.json";
		var keyphase = fs.readFileSync(filePath, 'utf8');
		return crypto.createHash('sha256').update(pwdKey+keyphase).digest('base64');
	}
}