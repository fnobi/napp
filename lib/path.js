var path = require("path"),
    fs = require("fs");

// add "expand" to path module
path.expand = function (relpath) {
	return this.resolve(relpath.replace(/^~/, process.env.HOME));
};

// add "existsSync" from fs
path.existsSync = fs.existsSync || path.existsSync;


module.exports = path;