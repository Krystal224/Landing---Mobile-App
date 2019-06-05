console.log('running create database');

const fs = require('fs');
var jsonText = fs.readFileSync('new.json');
// console.log(jsonText);
var jsonObj = JSON.parse(jsonText);

// console.log(jsonObj[0]['author']);

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('test.db');

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
  //DROP TABLE [IF EXISTS] [schema_name.]author_article;
db.serialize(() => {
  // create a new database table:
   // DROP TABLE [IF EXISTS] [schema_name.]author_article;
   // db.run("DROP TABLE author_article");
   db.run("CREATE TABLE IF NOT EXISTS bookmarks (title TEXT, link TEXT)");
   // db.run("CREATE TABLE author_article (id NUM, author TEXT, title TEXT, claps TEXT, reading_time NUM, link TEXT, like NUM)");
   //db.run( "DROP TABLE [IF EXISTS] [schema_name.]author_article");
  // db.run("CREATE TABLE author_article (author TEXT, claps NUM, link TEXT)");

  //load every author's information to this Database
  // 1. sort the json file by claps
  // how to link json file to here as an object and then get obj.key for value
  // 2. insert json file one by one, so db.run 100 times
  // 3. How to write on web page?

  // var i = 0
  // for (i = 0; i < 28; i++){
  //   // console.log("Hello World");
  //   // db.run("INSERT INTO author_article VALUES ('jsonObj[i]['author']' )");
  //    //console.log(jsonObj[0].claps);
  //    //console.log(jsonObj[0].link);
  //    db.run("INSERT INTO author_article VALUES(?,?,?,?,?,?,?,?,?)", i, jsonObj[i].author, jsonObj[i].title,jsonObj[i].claps,jsonObj[i].reading_time, jsonObj[i].link, 0,0,0);
  // }



  // console.log('successfully created the users_to_pets table in pets.db');

  // print them out to confirm their contents:
  db.each("SELECT * FROM bookmarks", (err, row) => {
      // console.log(row.name + ": " + row.job + ' - ' + row.pet);
      console.log("success");
      console.log(row);
      //console.log(row.author + " " + row.claps + " " + row.link);
  });
});

db.close();
