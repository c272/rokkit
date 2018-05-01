//Adding dependencies.
var jsonfile = require('jsonfile');
var fs = require('fs');

//Loading existing table data from file.
if (fs.existsSync('./tables.json')) {
	var tables = jsonfile.readFileSync("./tables.json");
} else {
	tables = []
}


//Loading package functions.
function createTable(tname) {
	//Pushing a table into the table data array.
	tables.push(tname);

	//Creating a blank table file under that name.
	var template = {};
	jsonfile.writeFileSync("./"+tname+".json", template);

	//Instatiating a new table object.
	this[tname] = {
		tname: tname,
		createRecord: function(name, inp) {
			//Create record function, adding record to table.
			this[name] = inp;
			jsonfile.writeFileSync("./"+this.tname+".json", this);
		},
		deleteRecord: function(name) {
			//Delete record function, removing supposed property.
			delete this[name];
			jsonfile.writeFileSync("./"+this.tname+".json", this);
		}
	};

	//Saving table file.
	jsonfile.writeFileSync('./tables.json', tables);
}

//Deleting table from table array.
function deleteTable(tname) {
	//Checking for table in array.
	var tIndex = tables.indexOf(tname);
	if (tIndex!=-1) {
		//Removing table index.
		tables.removeAt(1, tIndex);
		//Deleting table file.
		fs.unlink('./'+tname+".json");
	} else {
		throw "Table \""+tname+"\" does not exist.";
	}
}