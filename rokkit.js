//Adding dependencies.
var exports = module.exports = {};
var jsonfile = require('jsonfile');
var fs = require('fs');
var WatchJS = require('melanke-watchjs');
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

//Loading existing table data from file.
var tables;

//Sync on command flag.
exports.syncOnCommand = false;

//Table constructor.
exports.Table = function (tname) {
	//Checking if folder exists. If not, making it.
	if (!fs.existsSync('./rokkit')) {
		fs.mkdirSync('./rokkit');
	}
	//Loading in tables.
	if (fs.existsSync('./rokkit/tables.json')) {
		var tables = jsonfile.readFileSync('./rokkit/tables.json');
	} else {
		tables = [];
	}

	//Instatiating a new table object.
	this.tname = tname;
	this.contents = [];
	outer = this;

	//Pushing a table into the table data array.
	doesExist = tables.indexOf(tname);
	if (doesExist==-1) {
		tables.push(tname);

		//Creating a blank table file under that name.
		var template = {};
		jsonfile.writeFileSync("./rokkit/"+tname+".json", template);
	} else {
		//Already exists, loading table instead.
		var table = jsonfile.readFileSync('./rokkit/'+tname+".json");
		for (i in table.contents) {
			this[table.contents[i]] = table[table.contents[i]];
		}
	}

	//Table object functions.
	this.createRecord = function(name, inp) {
		//Checking for invalid record.
		if (name=="tname" || name=="deleteRecord" || name=="createRecord" || name=="this" || name=="contents") {
			throw "Invalid record argument, cannot overwrite critical table data.";
		} else {
			//Create record function, adding record to table.
			this[name] = inp;
			this.contents.push(name);

			//Checking if manual sync is enabled.
			if (exports.syncOnCommand==false) {
				//Resaving table.
				jsonfile.writeFileSync("./rokkit/"+this.tname+".json", this);
			}
		}
	}
	this.deleteRecord = function(name) {
		//Checking for invalid removal.
		if (name=="tname" || name=="deleteRecord" || name=="createRecord" || name=="this" || name=="contents") {
			throw "Invalid record argument, cannot delete critical table data.";
		} else {
			//Delete record function, removing supposed property.
			delete this[name];
			var contIndex = this.contents.indexOf(name);

			//Deleting contents record.
			if (contIndex!=-1) {
				this.contents.splice(contIndex, 1);
			}

			//Checking if manual sync is enabled.
			if (exports.syncOnCommand==false) {
				//Resaving table.
				jsonfile.writeFileSync("./rokkit/"+this.tname+".json", this);
			}
		}
	}

	//Checking if sync on command flag is enabled.
	if (exports.syncOnCommand==false) {
		//Creating a new watcher for this instance.
		watch(outer, function(){
			//Syncing object to the file, a property has changed.
			console.log(outer.tname);
			jsonfile.writeFileSync('./rokkit/'+outer.tname+".json", outer);
		});
	}

	//Saving table file.
	jsonfile.writeFileSync('./rokkit/tables.json', tables);
}

//Deleting table from table array.
exports.deleteTable = function (tname) {
	//Checking for table in array.
	var tIndex = tables.indexOf(tname);
	if (tIndex!=-1) {
		//Removing table index.
		tables.removeAt(1, tIndex);
		//Deleting table file.
		fs.unlink('./rokkit/'+tname+".json");
	} else {
		throw "Table \""+tname+"\" does not exist.";
	}
}

//Search through the properties of a table for a defined string.
exports.searchTable = function(tname, sterm) {
	if (!sterm || !tname) {
		throw "Error: 2 arguments required to search a table. (Table name and search term.)";
	}

	//Checking for table in table list.
	var tables = jsonfile.readFileSync('./rokkit/tables.json');
	var tIndex = tables.indexOf(tname);

	//Exists?
	if (tIndex!=-1) {
		//Loading in table.
		var table = jsonfile.readFileSync('./rokkit/'+tables[tIndex]+".json");

		//Checking for the selected string.
		if (table.hasOwnProperty(sterm)) {
			return true;
		} else {
			return false;
		}
	} else {
		throw "Table not found in directory. Does not exist or previously deleted.";
	}
}

//Check if a table exists.
exports.tableExists = function(tname) {
	var doesExist = tables.indexOf(tname);
	if (doesExist!=-1) {
		return true;
	} else {
		return false;
	}
}

//Save all existing tables.
exports.sync = function(name, obj) {
	//Checking if "sync on command" is enabled.
	if (exports.syncOnCommand==true) {
		//Checking if file exists.
		if (fs.existsSync('./rokkit/'+name+".json")) {
			jsonfile.writeFileSync("./rokkit/"+name+".json", obj);
		} else {
			throw "Table \""+name+"\" does not exist in database.";
		}
	} else {
		throw "syncOnCommand is not enabled. You must enable rokkit.syncOnCommand to use .sync(), otherwise tables are automatically saved.";
	}
}

//etc.
//