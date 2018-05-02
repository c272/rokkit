# Rokkit
*A simple JSON database package, using tables and records to emulate more traditional database structures.*

This is a really simple JSON database, which allows you to create and delete tables, search whether tables exist, add records and delete records, and more. Extra features are coming in the future to match the other common database solutions. Data in Rokkit is **always persistent**, so whenever you instantiate a new table called "foo", all data from previous runtimes' "foo" table will be present. All of the database structure is stored in a folder called "Rokkit", in the root of your project directory.

## Example Usage
```var rokkit = require('rokkit'); //adding rokkit
var table = new rokkit.Table('foo'); //creating a new table

table.createRecord('bar', 123); //creates a new record called "bar"
console.log(table.bar); //logs "123" to console

console.log(rokkit.searchTable('foo', 'bar')); //logs "true", returns a boolean
table.deleteRecord('bar'); //deletes the "bar" record

rokkit.deleteTable('foo'); //deletes the "foo" table
rokkit.tableExists('foo'); //returns false, the table no longer exists
```

## Documentation
**Constructors**
`Table`
Creates a new table instance, saving the table to a file of the same name. (eg. creating a table called "foo" will save a JSON file with the name "foo.json" inside ./rokkit.)
Usage:
`var tablevar = new Table('tablename');`

**Functions**
`Table.createRecord`
Creates a record within the table which is being used. For example, using `foo.createRecord('bar', data)` would create a record called "bar" in table "foo".
Usage:
`tablevar.createRecord('recordname', data);`

 `Table.deleteRecord`
 Deletes an existing record within a table. For example, using `foo.deleteRecord('bar')` would delete the record "bar" from table "foo".
