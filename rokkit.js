//Adding dependencies.
var exports = module.exports = {};
var jsonfile = require('jsonfile');
var fs = require('fs');

//Loading existing table data from file.
var tables;
exports.load = function() {
	if (fs.existsSync('./rokkit/tables.json')) {
		tables = jsonfile.readFileSync("./rokkit/tables.json");
	} else {
		tables = []
	}

	//Checking folder exists. If not, making it.
	if (!fs.existsSync('./rokkit')) {
		fs.mkdirSync('./rokkit');
	}

	//Loading all table data into RAM.
	for (i in tables) {
		var table = jsonfile.readFileSync("./rokkit/"+tables[i]+".json");
		this[table.tname] = table;
		table.createRecord = function(name, inp) {
			//Checking for invalid record.
			if (name=="tname" || name=="deleteRecord" || name=="createRecord" || name=="this") {
				throw "Invalid record argument, cannot overwrite table name.";
			} else {
				//Create record function, adding record to table.
				this[name] = inp;
				jsonfile.writeFileSync("./rokkit/"+this.tname+".json", this);
			}
		}
		table.deleteRecord = function(name) {
			//Checking for invalid removal.
			if (name=="tname" || name=="deleteRecord" || name=="createRecord" || name=="this") {
				throw "Invalid record argument, cannot delete table name.";
			} else {
				//Delete record function, removing supposed property.
				delete this[name];
				jsonfile.writeFileSync("./rokkit/"+this.tname+".json", this);
			}
		}
	}
	console.log(this);
}

//Loading package functions.
exports.createTable = function (tname) {
	//Pushing a table into the table data array.
	doesExist = tables.indexOf(tname);
	if (doesExist=-1) {
		tables.push(tname);

		//Creating a blank table file under that name.
		var template = {};
		jsonfile.writeFileSync("./rokkit/"+tname+".json", template);

		//Instatiating a new table object.
		this[tname] = {
			tname: tname,
			createRecord: function(name, inp) {
				//Checking for invalid record.
				if (name=="tname" || name=="deleteRecord" || name=="createRecord" || name=="this") {
					throw "Invalid record argument, cannot overwrite table name.";
				} else {
					//Create record function, adding record to table.
					this[name] = inp;
					jsonfile.writeFileSync("./rokkit/"+this.tname+".json", this);
				}
			},
			deleteRecord: function(name) {
				//Checking for invalid removal.
				if (name=="tname" || name=="deleteRecord" || name=="createRecord" || name=="this") {
					throw "Invalid record argument, cannot delete table name.";
				} else {
					//Delete record function, removing supposed property.
					delete this[name];
					jsonfile.writeFileSync("./rokkit/"+this.tname+".json", this);
				}
			}
		};

		//Saving table file.
		jsonfile.writeFileSync('./rokkit/tables.json', tables);
	} else {
		throw "Table already exists.";
	}
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
		throw "Error: 2 arguments required to search a table.";
	}

	//Checking for table in table list.
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

//etc.