process.env.NODE_CONFIG_DIR = __dirname + "/../config";

var fs		= require("fs"),
    async	= require("async"),
    config	= require("config"),
    mkdirp	= require("mkdirp"),
    path	= require(__dirname + "/path");

var NApp = function (name) {
	this.name = name;
	this.project_path = path.join(NApp.projects_path, this.name);
	this.bin_path = path.join(NApp.bin_path, this.name);

	this.shellscript = [
		"#!" + config.shell,
		"node " + path.join(NApp.projects_path, name, this.basename()) + " $*"
	].join("\n");
};

NApp.projects_path	= path.expand(config.projects_path);
NApp.bin_path		= path.expand(config.bin_path);
NApp.basenames		= ["app.js"];

NApp.names = function (callback) {
	// プロジェクト一覧の配列を返す
	var projects_path = NApp.projects_path;
	
	fs.readdir(projects_path, function (err, dirs) {
		if (err) { return callback(err, null); }

		async.filter(dirs, NApp.isValidName, function (results) {
			callback(null, results);
		});
	});
};

NApp.isValidName = function (name, callback) {
	// 渡されたnameのプロジェクトがあるかどうか試す
	callback = callback || function () {};

	var project_path = path.join(NApp.projects_path, name);

	async.some(NApp.basenames, function (basename, callback) {
		path.exists(
			path.join(project_path, basename),
			callback
		);
	}, callback);
};

NApp.prototype.basename = function () {
	var basenames = [];

	var self = this;
	NApp.basenames.forEach(function (basename) {
		if (path.existsSync(path.join(self.project_path, basename))) {
			basenames.push(basename);
		}
	});
	
	return basenames[0] || NApp.basenames[0];
};

NApp.prototype.validate = function (callback) {
	NApp.isValidName(this.name, callback);
};

NApp.prototype.install = function (callback) {
	// install -> プロジェクトの実行ファイルを呼び出すシェルスクリプトを作成
	var bin_path = this.bin_path;

	var self = this;
	async.series([function (callback) {
		self.validate(function (result) {
			if (!result) {
				callback(self.name + " is not valid project.", null);
			} else {
				callback(null, self.name + " is valid project.");
			}
		});
	}, function (callback) {
		path.exists(bin_path, function (result) {
			if (result) {
				callback(self.name + " has been already installed.", null);
			} else {
				callback(null, self.name + " has not been installed yet.");
			}
		});
	}, function (callback) {
		fs.writeFile(
			bin_path,
			self.shellscript,
			"utf8", 
			callback
		);
	}, function (callback) {
		fs.chmod(bin_path, "0755", callback);
	}],callback);
};

NApp.prototype.uninstall = function (callback) {
	// uninstall -> プロジェクトの実行ファイルを呼び出すシェルスクリプトを削除
	var bin_path = this.bin_path;

	var self = this;
	async.series([function (callback) {
		self.validate(function (result) {
			if (!result) {
				callback(self.name + " is not valid project.", null);
			} else {
				callback(null, self.name + " is valid project.");
			}
		});
	}, function (callback) {
		path.exists(bin_path, function (result) {
			if (!result) {
				callback(self.name + " is not installed.", null);
			} else {
				callback(null, self.name + " is installed.");
			}
		});
	}, function (callback) {
		fs.unlink(bin_path, callback);
	}],callback);
};

NApp.prototype.create = function (callback) { 
	var self = this;
	async.series([function (callback) {
		mkdirp(self.project_path, 0755, callback);
	}, function (callback) {
		fs.writeFile(
			path.join(self.project_path, self.basename()),
			"",
			"utf8", 
			callback
		);
	}], callback);
};

module.exports = NApp;