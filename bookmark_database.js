/**Create another table in sqlite database to store bookmark data**/

console.log('running create database');

const fs = require('fs');
var jsonText = fs.readFileSync('new.json');
// console.log(jsonText);
var jsonObj = JSON.parse(jsonText);

// console.log(jsonObj[0]['author']);

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('test.db');

db.serialize(() => {

   db.run("CREATE TABLE IF NOT EXISTS bookmarks (title TEXT, link TEXT)");

  // print them out to confirm their contents:
  db.each("SELECT * FROM bookmarks", (err, row) => {
      console.log("success");
      console.log(row);
  });
});

db.close();
