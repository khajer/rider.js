
const fs = require('fs');
var request = require('request');

var cntLoopPath = 0;
var staticPath = "";

var checkRecusivePath = (path, cb) => {
	var finalPath = path+staticPath;
	fs.stat(finalPath, (err, stats)  => {
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
	titleFormatName:(str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);

	},
	checkPath:(path, staticPath, cb) => {
		staticPath = staticPath;
		cntLoopPath = 0;
		checkRecusivePath(path, (err, p) => {
			cb(err, p);
		});
	},
	download:(url, dest, cb) => {
		request.get(url, (err, res, body)  => {
			if(err){
				cb(true);
				return;
			}
			fs.writeFile(dest, body, (err) => {
				if(err){
					cb(true);
					return;
				}
				cb(false);
			});
		});
	}
}

module.exports = Utils;