
/**
 * Module dependencies.
 */

var opts	= require("opts"),
    NApp	= require(__dirname + "/lib/napp");


// CLI

opts.parse([{
	short		: "l",
	long		: "list",
	description	: "Show project list",
	value		: false,
	required	: false
},{
	short		: "i",
	long		: "install",
	description	: "Install a project as application",
	value		: false,
	required	: false
},{
	short		: "u",
	long		: "uninstall",
	description	: "Uninstall a application",
	value		: false,
	required	: false
},{
	short		: "n",
	long		: "new-project",
	description	: "create new project",
	value		: false,
	required	: false
}], [], true);

var project_name = opts.args().shift() || null;

switch(true){			
case opts.get("install") && !!project_name:
	// app installing
	(new NApp(project_name)).install(function (err, res){
		if(err){ console.error("[error] %s", err); return 0; }
		console.log("[ok] %s is installed successfully.", project_name);
	});

	break;
case opts.get("uninstall") && !!project_name:
	// app uninstalling
	(new NApp(project_name)).uninstall(function (err, res){
		if(err){ console.error("[error] %s", err); return 0; }
		console.log("[ok] %s is uninstalled successfully.", project_name);
	});

	break;
case opts.get("new-project") && !!project_name:
	// new project
	(new NApp(project_name)).create(function (err, res){
		if(err){ console.error("[error] %s", err); return 0; }
		console.log("[ok] %s is created successfully.", project_name);
	});

	break;
default:
	// listing projects
	NApp.names(function(err,projects){
		if(err){ console.error(err); return 0; }

		console.log(projects.join("\t"));
	});
	break;
}