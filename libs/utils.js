
const fs = require('fs');
var request = require('request');

var cntLoopPath = 0;
var staticPath = "";

var checkRecusivePath = function(path, cb){
	var finalPath = path+staticPath;
	fs.stat(finalPath, function(err, stats) {
		cntLoopPath += 1;
		if(err){
			if(cntLoopPath > 5){
				cb(true, path);
				return;
			}

			var p = (path).split('/');
			path = p.slice(0, p.length-1).join("/")
			checkRecusivePath(path, cb);
			return;
		}
		if (stats.isDirectory()) {
			cb(false, path);
		}
	});
}
var Utils = {
	titleFormatName:function(str){
		return str.charAt(0).toUpperCase() + str.slice(1);

	},
	checkPath:function(path, staticPath, cb){
		staticPath = staticPath;
		cntLoopPath = 0;
		checkRecusivePath(path, function(err, p){
			cb(err, p);
		});
	},
	download:function(url, dest, cb){
		request.get(url, function(err, res, body) {
			if(err){
				cb(true);
				return;
			}
			fs.writeFile(dest, body, function(err){
				if(err){
					cb(true);
					return;
				}
				cb(false);
			});
			cb(false);
		});
	}
}

module.exports = Utils;