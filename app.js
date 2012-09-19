var opts	= require("opts"),
    NApp	= require("./lib/napp");

// option setting
opts.parse([{
	short		: "l",
	long		: "list",
	description	: "Show project list",
	value		: false,
	required	: false
},{
	short		: "i",
	long		: "install",
	description	: "Install a application from project",
	value		: true,
	required	: false
},{
	short		: "u",
	long		: "uninstall",
	description	: "Uninstall a application",
	value		: true,
	required	: false
}], [], true);

// switching
switch(true){			
case !!opts.get("install"):
	// app installing
	var project_name = opts.get("install");

	(new NApp(project_name)).install(function (err, res){
		if(err){ console.error(err); return 0; }
		console.log("%s is installed successfully.", project_name);
	});

	break;
case !!opts.get("uninstall"):
	// app uninstalling
	var project_name = opts.get("uninstall");

	(new NApp(project_name)).uninstall(function (err, res){
		if(err){ console.error(err); return 0; }
		console.log("%s is uninstalled successfully.", project_name);
	});

	break;
case opts.get("list"):
	// listing projects
	NApp.names(function(err,projects){
		if(err){ console.error(err); return 0; }

		console.log(projects.join("\t"));
	});
	break;
default:
	require("opts").help();
}