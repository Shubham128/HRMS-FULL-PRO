var mysql = require('mysql');

var config = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hrms_database",
  multipleStatements: true
});

config.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = config;