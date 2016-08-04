var prompt = require('prompt');
var colors = require("colors/safe")

prompt.start();
prompt.message = colors.rainbow(" >> ");

module.exports = {
	init: function(cb){
		cb();
	}
}